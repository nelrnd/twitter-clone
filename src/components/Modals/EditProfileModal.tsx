import { ChangeEvent, useEffect, useState } from 'react'
import Button from '../Buttons/Button'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'
import Avatar from '../Avatar/Avatar'
import TextAreaInput from '../TextInput/TextAreaInput'
import { updateUserInfo, uploadImage } from '../../firebase'
import { User } from '../../types'
import IconButton from '../Buttons/IconButton'
import PhotoIcon from '../../assets/add-photo.svg'
import CloseIcon from '../../assets/close.svg'

type EditProfileModalProps = {
  show: boolean
  setShow: (show: boolean) => void
  user: User
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, setShow, user }) => {
  const [newName, setName] = useState(user.name)
  const [newBio, setBio] = useState(user.bio)
  const [newProfileURL, setProfileURL] = useState(user.profileURL)
  const [newProfileFile, setProfileFile] = useState<File | null>(null)
  const [newHeaderURL, setHeaderURL] = useState(user.headerURL)
  const [newHeaderFile, setHeaderFile] = useState<File | null>(null)

  useEffect(() => {
    if (newProfileFile) {
      const url = URL.createObjectURL(newProfileFile)
      setProfileURL(url)
    }
  }, [newProfileFile])

  useEffect(() => {
    if (newHeaderFile) {
      const url = URL.createObjectURL(newHeaderFile)
      setHeaderURL(url)
    } else {
      setHeaderURL(null)
    }
  }, [newHeaderFile])

  const save = async () => {
    const updatedInfo: { name?: string; bio?: string; profileURL?: string; headerURL?: string } = {}
    if (newName !== user.name) {
      updatedInfo.name = newName
    }
    if (newBio !== user.bio) {
      updatedInfo.bio = newBio
    }
    if (newProfileFile) {
      const url = await uploadImage(newProfileFile, 'profiles', user.id)
      updatedInfo.profileURL = url
    }
    if (newHeaderFile) {
      const url = await uploadImage(newHeaderFile, 'headers', user.id)
      updatedInfo.headerURL = url
    }
    if (Object.keys(updatedInfo).length !== 0) {
      await updateUserInfo(updatedInfo, user.id)
    }
    setShow(false)
  }

  return (
    <Modal show={show} setShow={setShow} showCloseBtn={true} width={600}>
      <div className="top-bar">
        <h1 className="heading">Edit profile</h1>
        <Button onClick={save}>Save</Button>
      </div>

      <div className="banner-wrapper">
        <div className="row gap-16">
          <UploadButton setFile={setHeaderFile} />
          <IconButton style="dark">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="banner" style={{ backgroundImage: `url(${newHeaderURL}` }} />
      </div>
      <div className="Avatar-wrapper">
        <UploadButton setFile={setProfileFile} />
        <Avatar src={newProfileURL} size={116} />
      </div>
      <TextInput label="Name" value={newName} setValue={setName} />
      <TextAreaInput label="Bio" value={newBio} setValue={setBio} />
    </Modal>
  )
}

type UploadButtonProps = {
  setFile: (file: File) => void
}

const UploadButton: React.FC<UploadButtonProps> = ({ setFile }) => {
  const id = Math.random().toString()

  const updateProfileFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files && e.target.files[0]) || null
    if (file) {
      setFile(file)
    }
  }

  return (
    <>
      <label htmlFor={id}>
        <IconButton style="dark">
          <PhotoIcon />
        </IconButton>
      </label>
      <input type="file" id={id} accept="image/*" style={{ display: 'none' }} onChange={updateProfileFile} />
    </>
  )
}

export default EditProfileModal
