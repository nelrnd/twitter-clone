import { Link } from 'react-router-dom'
import { User } from '../../types'
import { auth } from '../../firebase'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import FollowButton from '../Buttons/FollowButton'
import './ProfileHeader.sass'

interface ProfileHeaderProps {
  user: User
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  const handleClick = () => {
    console.log('ok')
  }
  const currentUserId: string | undefined = auth.currentUser?.uid
  const isCurrentUser = user.id === currentUserId
  const followed: boolean = (currentUserId && user.followers.includes(currentUserId)) || false

  return (
    <header className="ProfileHeader">
      <div className="banner" style={{ backgroundImage: `url(${user.headerURL})` }}></div>

      <Avatar src={user.profileURL} size={134} />

      <div className="content">
        <div className="action-bar">
          {isCurrentUser ? (
            <Button onClick={handleClick} style="outline">
              Edit profile
            </Button>
          ) : (
            <FollowButton userId={user.id} currentUserId={currentUserId} followed={followed} />
          )}
        </div>
        <h2 className="heading">{user.name}</h2>
        <p className="username">@{user.username}</p>

        <div className="stat-bar">
          <Link to={`/${user.username}/following`} className="small">
            <span className="bold">{user.following.length} </span>
            <span className="grey">Following</span>
          </Link>
          <Link to={`/${user.username}/followers`} className="small">
            <span className="bold">{user.followers.length} </span>
            <span className="grey">Followers</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default ProfileHeader
