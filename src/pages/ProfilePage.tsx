import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionReference, collection, limit, query, where } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { User } from '../types'
import useAuthRedirect from '../hooks/useAuthRedirect'
import ProfileHeader, { NoMatchingAccount } from '../components/ProfileHeader/ProfileHeader'
import Feed, { LikeFeed } from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import Tabs from '../components/Tabs/Tabs'
import Loader from '../components/Loader/Loader'

function ProfilePage() {
  const { username } = useParams<'username'>()
  const navigate = useNavigate()
  const location = useLocation()
  // Get user data
  const ref = collection(db, 'users') as CollectionReference<User>
  const qry = query(ref, where('username', '==', username), limit(1))
  const [data, loading] = useCollectionData(qry)
  const user = !!data && data[0]

  useAuthRedirect()

  const goBack = () => navigate('/')

  if (loading) return <Loader />

  return user ? (
    <LayoutWithSidebar>
      <main>
        <PageHeader goBack={true} onClick={goBack}>
          <h2 className="heading">{user.name}</h2>
          <p className="small grey">{!location.pathname.includes('likes') ? user.tweetsCount + ' Tweets' : user.likesCount + ' Likes'}</p>
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
    <LayoutWithSidebar>
      <main>
        <PageHeader goBack={true} onClick={goBack}>
          <h2 className="heading">Profile</h2>
        </PageHeader>
        <NoMatchingAccount username={username} />
      </main>
    </LayoutWithSidebar>
  )
}

export default ProfilePage
