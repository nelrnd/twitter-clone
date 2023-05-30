import { Link } from 'react-router-dom'
import { auth } from '../../firebase'
import { User } from '../../types'
import Avatar from '../Avatar/Avatar'
import FollowButton from '../Buttons/FollowButton'
import './ProfileItem.sass'

function ProfileItem({ user }: { user: User }) {
  const currentUserId = auth.currentUser?.uid || ''
  const followed = user.followers.includes(currentUserId)

  return (
    <div className="ProfileItem">
      <Link to={`/${user.username}`}>
        <Avatar profileURL={user.profileURL} />
      </Link>

      <div>
        <div className="bar">
          <div>
            <Link to={`/${user.username}`}>
              <h3 className="name">{user.name}</h3>
            </Link>
            <Link to={`/${user.username}`}>
              <p className="grey">@{user.username}</p>
            </Link>
          </div>

          {user.id !== auth.currentUser?.uid && <FollowButton userId={user.id} currentUserId={auth.currentUser?.uid} followed={followed} size="small" />}
        </div>
      </div>
    </div>
  )
}

export default ProfileItem
