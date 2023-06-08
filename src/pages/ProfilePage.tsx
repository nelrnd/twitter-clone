import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionReference, collection, limit, query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { User } from '../types'
import useAuthRedirect from '../hooks/useAuthRedirect'
import ProfileHeader from '../components/ProfileHeader/ProfileHeader'
import Feed, { LikeFeed } from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import Tabs from '../components/Tabs/Tabs'

function ProfilePage() {
  const params = useParams()
  const username = params.username
  const navigate = useNavigate()
  const location = useLocation()
  // Get user data
  const ref = collection(db, 'users') as CollectionReference<User>
  const qry = query(ref, where('username', '==', username), limit(1))
  const [data, loading] = useCollectionData(qry)
  const user = !!data && data[0]

  useAuthRedirect()

  const goBack = () => navigate('/')

  if (loading) return <p>Loading...</p>

  return user ? (
    <LayoutWithSidebar>
      <main>
        <PageHeader>
          <div className="bar">
            <IconButton onClick={goBack}>
              <BackIcon />
            </IconButton>
            <div>
              <h2 className="heading">{user.name}</h2>
              <p className="small grey">{!location.pathname.includes('likes') ? user.tweetsCount + ' Tweets' : user.likesCount + ' Likes'}</p>
            </div>
          </div>
        </PageHeader>

        <ProfileHeader user={user} />

        <Tabs
          tabs={[
            { text: 'Tweets', link: `/${user.username}`, active: !location.pathname.includes('likes') },
            { text: 'Likes', link: `/${user.username}/likes`, active: location.pathname.includes('likes') },
          ]}
        />

        {!location.pathname.includes('likes') ? <Feed userIds={[user.id]} /> : <LikeFeed userId={user.id} />}
      </main>
    </LayoutWithSidebar>
  ) : (
    <p>This account doesn't exists</p>
  )
}

export default ProfilePage
