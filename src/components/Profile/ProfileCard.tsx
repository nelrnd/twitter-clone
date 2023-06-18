import { Link, useNavigate } from "react-router-dom"
import { User } from "../../types"
import Avatar from "../Avatar/Avatar"
import './ProfileCard.sass'
import FollowButton from "../Buttons/FollowButton"
import { auth } from "../../firebase"

type ProfileCardProps = {
  user: User
  showBio?: boolean
  showFollow?: boolean
}

const ProfileCard: React.FC<ProfileCardProps> = ({user, showBio, showFollow}) => {
  const authUserId: string | undefined = auth.currentUser?.uid
  const sameUser = user.id === authUserId
  const followed: boolean = (authUserId && user.followers.includes(authUserId)) || false
  const navigate = useNavigate()

  return (
    <div className="ProfileCard" onClick={() => navigate('/' + user.username)}>
      <div className="left-col">
        <Link to={'/' + user.username}>
          <Avatar src={user.profileURL} size={40} />
        </Link>
      </div>
      <div className="right-col">
        <header>
          <div>
            <Link to={'/' + user.username}>
              <h3 className="name">{user.name}</h3>
            </Link>
            <Link to={'/' + user.username}>
              <p className="username">@{user.username}</p>
            </Link>
          </div>
          {showFollow && !sameUser && <FollowButton userId={user.id} authUserId={authUserId} followed={followed} size='small' />}
        </header>
        {showBio && <div className="bio">{user.bio}</div>}
      </div>
    </div>
  )
}

export default ProfileCard