import { Link } from 'react-router-dom'
import { User } from '../../types'
import Avatar from '../Avatar/Avatar'
import './ProfileHeader.sass'
import Button from '../Button/Button'
import { auth } from '../../firebase'

interface ProfileHeaderProps {
  user: User
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  const handleClick = () => {
    console.log('ok')
  }
  const isCurrentUser = user.id === auth.currentUser?.uid

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
            <Button handleClick={handleClick}>Follow</Button>
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
