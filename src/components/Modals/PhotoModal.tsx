import IconButton from '../Buttons/IconButton'
import CloseIcon from '../../assets/close.svg'
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import './PhotoModal.sass'
import { User } from '../../types'

const PhotoModal: React.FC = () => {
  const [user]: [user: User] = useOutletContext()
  const { username } = useParams<'username'>()
  const location = useLocation()
  const navigate = useNavigate()
  const photoType: string | undefined = location.pathname.split('/').pop()

  const goBack = () => {
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation.pathname)
    } else {
      navigate('/home')
    }
  }

  if (!user) {
    return <Navigate to={'/' + username} />
  }

  return (
    <div className="PhotoModal_wrapper">
      <IconButton onClick={goBack} style="dark">
        <CloseIcon />
      </IconButton>

      { photoType === 'photo' && <Avatar src={user.profileURL} size={400} /> }
      { photoType === 'header_photo' && <img src={user.headerURL || ''} /> }

      <div className="backdrop" onClick={goBack}/>
    </div>
  )
}

export default PhotoModal
