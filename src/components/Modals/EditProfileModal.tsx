import { useState } from 'react'
import Button from '../Buttons/Button'
import TextInput from '../TextInput/TextInput'
import Modal from './Modal'
import Avatar from '../Avatar/Avatar'
import TextAreaInput from '../TextInput/TextAreaInput'

type EditProfileModalProps = {
  show: boolean
  setShow: (show: boolean) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, setShow }) => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  return (
    <Modal show={show} setShow={setShow} showCloseBtn={true} width={600}>
      <div className="top-bar">
        <h1 className="heading">Edit profile</h1>
        <Button>Save</Button>
      </div>

      <div className="banner" />
      <Avatar size={116} />
      <TextInput label="Name" value={name} setValue={setName} />
      <TextAreaInput label="Bio" value={bio} setValue={setBio} />
    </Modal>
  )
}

export default EditProfileModal
