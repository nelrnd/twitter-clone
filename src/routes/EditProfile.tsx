import { useContext, useEffect, useState } from "react"
import Modal from "../components/Modals/Modal"
import ModalHeader from "../components/Modals/ModalHeader"
import Button from "../components/Buttons/Button"
import Banner from "../components/Profile/Banner"
import useAuthRedirect from "../hooks/useAuthRedirect"
import Avatar from "../components/Avatar/Avatar"
import TextInput from "../components/TextInput/TextInput"
import TextAreaInput from "../components/TextInput/TextAreaInput"
import IconButton from "../components/Buttons/IconButton"
import PhotoIcon from '../assets/add-photo.svg'
import CloseIcon from '../assets/close.svg'
import { useLocation, useNavigate } from "react-router-dom"
import { updateUserInfo, uploadImage } from "../firebase"
import { GlobalContext } from "../contexts/GlobalContext"

const EditProfile: React.FC = () => {
  const { authUser } = useContext(GlobalContext)
  const [newName, setName] = useState(authUser?.name || '')
  const [newBio, setBio] = useState(authUser?.bio || '')
  const [newProfileFile, setProfileFile] = useState<File | null>(null)
  const [newHeaderFile, setHeaderFile] = useState<File | null>(null)
  const [newHeaderURL, setHeaderURL] = useState(authUser?.headerURL)

  const navigate = useNavigate()
  const location = useLocation()

  useAuthRedirect()

  const removeHeader = () => setHeaderURL(null)

  useEffect(() => {
    if (newHeaderFile) {
      setHeaderURL(URL.createObjectURL(newHeaderFile))
    }
  }, [newHeaderFile])

  const goBack = () => {
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation.pathname)
    } else {
      navigate('/home')
    }
  }

  const save = async () => {
    if (!authUser) return
    const updatedInfo: { name?: string; bio?: string; profileURL?: string; headerURL?: string | null } = {}
    if (newName !== authUser.name) {
      updatedInfo.name = newName
    }
    if (newBio !== authUser.bio) {
      updatedInfo.bio = newBio
    }
    if (newProfileFile) {
      const URL = await uploadImage(newProfileFile, `profiles/${authUser.id}`)
      updatedInfo.profileURL = URL
    }
    if (newHeaderFile) {
      const URL = await uploadImage(newHeaderFile, `headers/${authUser.id}`)
      updatedInfo.headerURL = URL
    }
    if (!newHeaderURL) {
      updatedInfo.headerURL = null
    }
    if (Object.keys(updatedInfo).length !== 0) {
      await updateUserInfo(updatedInfo, authUser.id)
    }
    goBack()
  }

  return (
    <Modal width={600} height={650} className="EditProfile" onClick={goBack}>
      <ModalHeader onClick={goBack}>
        <h2>Edit profile</h2>
        <Button onClick={save}>Save</Button>
      </ModalHeader>

      <div className="Banner_wrapper">
        <div className="bar">
          <UploadButton setFile={setHeaderFile} />
          {newHeaderURL && (
            <IconButton style="dark" onClick={removeHeader}>
              <CloseIcon />
            </IconButton>
          )}
        </div>
        <Banner src={newHeaderURL} />
      </div>
      <div className="Avatar_wrapper">
        <UploadButton setFile={setProfileFile} />
        <Avatar src={newProfileFile ? URL.createObjectURL(newProfileFile) : authUser?.profileURL} size={116} />
      </div>

      <div className="text-inputs">
        <TextInput label="Name" value={newName} setValue={setName} />
        <TextAreaInput label="Bio" value={newBio} setValue={setBio} />
      </div>
    </Modal>
  )
}

type UploadButtonProps = {
  setFile: (file: File) => void
}

const UploadButton: React.FC<UploadButtonProps> = ({ setFile }) => {
  const id = Math.random().toString()

  const updateProfileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files?.length ? e.target.files[0] : null)
    if (file) {
      setFile(file)
    }
  }

  return (
    <>
      <label htmlFor={id}>
        <div className="IconButton dark">
          <PhotoIcon />
        </div>
      </label>
      <input type="file" id={id} accept="image/*" style={{ display: 'none' }} onChange={updateProfileFile} />
    </>
  )
}

export default EditProfile