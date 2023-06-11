import IconButton from '../Buttons/IconButton'
import CloseIcon from '../../assets/close.svg'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useUserDataWithUsername } from '../../hooks/useUserData'
import Loader from '../Loader/Loader'
import Avatar from '../Avatar/Avatar'
import './PhotoModal.sass'

const PhotoModal: React.FC = () => {
  const { username } = useParams<'username'>()
  const location = useLocation()
  const photoType = location.pathname.split('/').pop()
  const navigate = useNavigate()

  const [user, loading] = useUserDataWithUsername(username)

  const goBack = () => navigate(`/${username}`)

  if (!loading && !user) {
    goBack()
  }

  return (
    <div className="PhotoModal_wrapper">
      <IconButton onClick={goBack} style="dark">
        <CloseIcon />
      </IconButton>

      {loading && <Loader />}

      {user && (photoType === 'photo' ? <Avatar src={user.profileURL} size={400} /> : <img src={user.headerURL || ''} />)}

      <div className="PhotoModal_backdrop" onClick={goBack} />
    </div>
  )
}

export default PhotoModal
