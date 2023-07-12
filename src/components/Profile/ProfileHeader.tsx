import { Link, useLocation, useNavigate } from "react-router-dom"
import { auth } from "../../firebase"
import { User } from "../../types"
import Avatar from "../Avatar/Avatar"
import Button from "../Buttons/Button"
import FollowButton from "../Buttons/FollowButton"
import Banner from "./Banner"
import MessageIcon from '../../assets/message.svg'
import './ProfileHeader.sass'
import { getChatId } from "../../utils"

type ProfileHeaderProps = {
  user: User
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({user}) => {
  const authUserId: string | undefined = auth.currentUser?.uid
  const sameUser = user.id === authUserId
  const followed: boolean = (authUserId && user.followers.includes(authUserId)) || false
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="ProfileHeader">
      <div className="avatar-header_wrapper">
        {user.headerURL ? (
          <Link to="header_photo" state={{backgroundLocation: location}}>
            <Banner src={user.headerURL} />
          </Link>
        ) : (
          <Banner src={user.headerURL} />
        )}
        <Link to="photo" state={{backgroundLocation: location}}>
          <Avatar src={user.profileURL} size={132} />
        </Link>
      </div>
      <div className="content">
        <div className="actions-bar">
          {sameUser ? (
            <Button style="outline" onClick={() => navigate('/settings/profile', {state: {backgroundLocation: location}})}>Edit profile</Button>
          ) : (
            <>
              <Button style="outline icon" onClick={() => navigate(`/messages/${getChatId([user.id, authUserId])}`)}><MessageIcon /></Button>
              <FollowButton userId={user.id} authUserId={authUserId} followed={followed} />
            </>
          )}
        </div>
        <h2 className="heading-2">{user.name}</h2>
        <p className="username">@{user.username}</p>

        {user.bio && <div className="bio">{user.bio}</div>}

        <div className="stats-bar small">
          <Link to={'/' + user.username + '/following'}>
            <span className="bold">{user.following.length}</span>
            <span className="grey"> Following</span>
          </Link>
          <Link to={'/' + user.username + '/followers'}>
            <span className="bold">{user.followers.length}</span>
            <span className="grey"> Followers</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default ProfileHeader