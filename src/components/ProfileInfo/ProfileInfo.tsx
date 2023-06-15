import { Link } from 'react-router-dom'
import { User } from '../../types'
import Avatar from '../Avatar/Avatar'
import './ProfileInfo.sass'

type ProfileInfoProps = {
  user: User
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({user}) => {
  const link = '/' + user.username
  return (
    <div className="ProfileInfo">
      <Link to={link}>
        <Avatar src={user.profileURL} />
      </Link>
      <div className="names">
        <Link to={link}>
          <div className="name">{user.name}</div>
        </Link>
        <Link to={link}>
          <div className="username">@{user.username}</div>
        </Link>
      </div>
    </div>
  )
}

export default ProfileInfo