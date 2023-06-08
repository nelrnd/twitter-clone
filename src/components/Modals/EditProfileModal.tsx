import { useState } from 'react'
import Button from '../Buttons/Button'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'
import Avatar from '../Avatar/Avatar'
import TextAreaInput from '../TextInput/TextAreaInput'
import { updateUserInfo } from '../../firebase'

type EditProfileModalProps = {
  show: boolean
  setShow: (show: boolean) => void
  name: string
  bio: string
  userId: string
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, setShow, name, bio, userId }) => {
  const [newName, setName] = useState(name)
  const [newBio, setBio] = useState(bio)

  const save = async () => {
    const updatedInfo: { name?: string; bio?: string } = {}
    if (newName !== name) {
      updatedInfo.name = newName
    }
    if (newBio !== bio) {
      updatedInfo.bio = newBio
    }
    if (Object.keys(updatedInfo).length === 0) return
    await updateUserInfo(updatedInfo, userId)
    setShow(false)
  }

  return (
    <Modal show={show} setShow={setShow} showCloseBtn={true} width={600}>
      <div className="top-bar">
        <h1 className="heading">Edit profile</h1>
        <Button onClick={save}>Save</Button>
      </div>

      <div className="banner" />
      <Avatar size={116} />
      <TextInput label="Name" value={newName} setValue={setName} />
      <TextAreaInput label="Bio" value={newBio} setValue={setBio} />
    </Modal>
  )
}

export default EditProfileModal
