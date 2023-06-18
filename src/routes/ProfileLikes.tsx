import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { User } from '../types'
import PageHeader from "../components/PageHeader/PageHeader"
import Tabs from "../components/Tabs/Tabs"
import ProfileHeader from "../components/Profile/ProfileHeader"
import LikeFeed from "../components/Feed/LikeFeed"

const ProfileLikes: React.FC = () => {
  const { username } = useParams<'username'>()
  const [user]: [user: User] = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { text: 'Tweets', link: `/${user?.username}`, active: !location.pathname.includes('likes') },
    { text: 'Likes', link: `/${user?.username}/likes`, active: location.pathname.includes('likes') }
  ]

  const goBack = () => navigate('/home')

  return user ? (
    <main>
      <PageHeader onClick={goBack}>
        <h2 className="heading">{user.name}</h2>
        <p className="small grey">{user.likesCount} Likes</p>
      </PageHeader>
      <ProfileHeader user={user} />
      <Tabs tabs={tabs} />
      <LikeFeed userId={user.id} />
    </main>
  ) : <Navigate to={"/" + username} />
}

export default ProfileLikes