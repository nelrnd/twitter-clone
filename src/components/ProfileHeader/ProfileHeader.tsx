import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User } from '../../types'
import { auth } from '../../firebase'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import FollowButton from '../Buttons/FollowButton'
import './ProfileHeader.sass'
import EditProfileModal from '../Modals/EditProfileModal'

interface ProfileHeaderProps {
  user: User
}

function ProfileHeader({ user }: ProfileHeaderProps) {
  const currentUserId: string | undefined = auth.currentUser?.uid
  const isCurrentUser = user.id === currentUserId
  const followed: boolean = (currentUserId && user.followers.includes(currentUserId)) || false

  const [show, setShow] = useState(false)

  return (
    <>
      <header className="ProfileHeader">
        <div className="banner" style={{ backgroundImage: `url(${user.headerURL})` }}></div>

        <Link to={`/${user.username}/photo`}>
          <Avatar src={user.profileURL} size={134} />
        </Link>

        <div className="content">
          <div className="action-bar">
            {isCurrentUser ? (
              <Button onClick={() => setShow(true)} style="outline">
                Edit profile
              </Button>
            ) : (
              <FollowButton userId={user.id} currentUserId={currentUserId} followed={followed} />
            )}
          </div>
          <h2 className="heading">{user.name}</h2>
          <p className="username">@{user.username}</p>

          {user.bio != '' && <div className="bio">{user.bio}</div>}

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
      <EditProfileModal show={show} setShow={setShow} user={user} />
    </>
  )
}

type NoMatchingAccountProps = {
  username?: string
}

const NoMatchingAccount: React.FC<NoMatchingAccountProps> = ({ username }) => {
  return (
    <>
      <header className="NoMatchingAccount">
        <div className="blank_banner"></div>
        <div className="blank_avatar"></div>
        <h2>@{username}</h2>

        <div className="no-found-text">
          <p className="big">This account doesn’t exist</p>
          <p className="grey">Try searching for another.</p>
        </div>
      </header>
    </>
  )
}

export default ProfileHeader
export { NoMatchingAccount }
