import { Link } from 'react-router-dom'
import { auth } from '../../firebase'
import { User } from '../../types'
import Avatar from '../Avatar/Avatar'
import FollowButton from '../Buttons/FollowButton'
import './ProfilePopup.sass'

type ProfilePopupProps = {
  user: User
  position: { x: number, y: number } | null
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void
  onMouseLeave?: () => void
}

const ProfilePopup: React.FC<ProfilePopupProps> = ({ user, position, onMouseEnter, onMouseLeave }) => {
  if (!user) return null

  const authUserId: string | undefined = auth.currentUser?.uid
  const sameUser = user.id === authUserId
  const followed: boolean = (authUserId && user.followers.includes(authUserId)) || false

  return (
    <div 
      className='ProfilePopup' 
      style={{ display: position ? 'flex' : 'none', top: position ? position.y : 0, left: position ? position.x : 0 }} 
      onMouseEnter={onMouseEnter} 
      onMouseLeave={onMouseLeave}>
      <div className="top">
        <Link to={`/${user.username}`}>
          <Avatar src={user.profileURL} size={64} />
        </Link>
        {!sameUser && <FollowButton userId={user.id} authUserId={auth.currentUser?.uid} followed={followed} />}
      </div>
      <div className="names">
        <Link to={`/${user.username}`}>
          <h2 className="name heading">{user.name}</h2>
        </Link>
        <Link to={`/${user.username}`}>
          <p className="grey">@{user.username}</p>
        </Link>
      </div>
      <div className='bio'>{user.bio}</div>
      <div className="stat">
        <Link to={`/${user.username}/following`}>
          <span className="bold">{user.following.length} </span>
          <span className="grey">Following</span>
        </Link>
        <Link to={`/${user.username}/followers`}>
          <span className="bold">{user.followers.length} </span>
          <span className="grey">Followers</span>
        </Link>
      </div>
    </div>
  )
}

export default ProfilePopup