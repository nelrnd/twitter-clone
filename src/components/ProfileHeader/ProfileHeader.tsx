import { Link } from 'react-router-dom'
import { User } from '../../types'
import { auth } from '../../firebase'
import Avatar from '../Avatar/Avatar'
import Button from '../Button/Button'
import FollowButton from '../Button/FollowButton'
import './ProfileHeader.sass'

interface ProfileHeaderProps {
  user: User
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  const handleClick = () => {
    console.log('ok')
  }
  const currentUserId = auth.currentUser?.uid
  const isCurrentUser = user.id === currentUserId
  const followed = (currentUserId && user.followers.includes(currentUserId)) || false

  return (
    <header className="ProfileHeader">
      <div className="banner" style={{ backgroundImage: `url(${user.headerURL})` }}></div>

      <Avatar profileURL={user.profileURL} size="xl" />

      <div className="content">
        <div className="action-bar">
          {isCurrentUser ? (
            <Button handleClick={handleClick} type="outline">
              Edit profile
            </Button>
          ) : (
            <FollowButton userId={user.id} currentUserId={currentUserId} followed={followed} />
          )}
        </div>
        <h2 className="heading">{user.name}</h2>
        <p className="username">@{user.username}</p>

        <div className="stat-bar">
          <Link to="following" className="small">
            <span className="bold">{user.following.length} </span>
            <span className="grey">Following</span>
          </Link>
          <Link to="followers" className="small">
            <span className="bold">{user.followers.length} </span>
            <span className="grey">Followers</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default ProfileHeader
