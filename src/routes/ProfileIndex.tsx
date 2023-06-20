import { useLocation, useNavigate, useOutletContext } from "react-router-dom"
import { User } from '../types'
import PageHeader from "../components/PageHeader/PageHeader"
import NoProfileHeader from "../components/Profile/NoProfileHeader"
import Tabs from "../components/Tabs/Tabs"
import Feed from "../components/Feed/Feed"
import ProfileHeader from "../components/Profile/ProfileHeader"

const ProfileIndex: React.FC = () => {
  const {user}: {user: User} = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { text: 'Tweets', link: `/${user?.username}`, active: !location.pathname.includes('likes') },
    { text: 'Likes', link: `/${user?.username}/likes`, active: location.pathname.includes('likes') }
  ]

  const goBack = () => navigate('/home')

  return (
    <main>
      <PageHeader onClick={goBack}>
        {user ? (
          <>
            <h2 className="heading">{user.name}</h2>
            <p className="small grey">{tabs[0].active ? user.tweetsCount + ' Tweets' : user.likesCount + ' Likes' }</p>
          </>
        ) : (
          <div className="heading">Profile</div>
        )}
      </PageHeader>

      {user ? <ProfileHeader user={user} /> : <NoProfileHeader />}

      {user && 
        <>
          <Tabs tabs={tabs} />
          <Feed userIds={[user.id]} />
        </>
      }
    </main>
  )
}

export default ProfileIndex