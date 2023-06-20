import IconButton from '../Buttons/IconButton'
import CloseIcon from '../../assets/close.svg'
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import './PhotoModal.sass'
import { Tweet, User } from '../../types'

const getType = (pathname: string): string => {
  if (pathname.split('/').pop() === 'photo') {
    return 'photo'
  } else if (pathname.split('/').pop() === 'header_photo') {
    return 'header_photo'
  } else {
    return 'tweet_photo'
  }
}

const PhotoModal: React.FC = () => {
  const {user, tweet}: {user: User, tweet?: Tweet} = useOutletContext()
  const { username } = useParams<'username'>()
  const location = useLocation()
  const navigate = useNavigate()
  const type = getType(location.pathname)

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

      { type === 'photo' && <Avatar src={user.profileURL} size={400} /> }
      { type === 'header_photo' && <img src={user.headerURL || ''} /> }
      { type === 'tweet_photo' && <img src={tweet?.media[Number(location.pathname.split('/').pop()) - 1]} /> }

      <div className="backdrop" onClick={goBack}/>
    </div>
  )
}

export default PhotoModal
