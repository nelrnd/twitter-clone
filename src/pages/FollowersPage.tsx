import { db } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, limit, query, where } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { User } from '../types'
import PageHeader from '../components/PageHeader/PageHeader'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import Tabs from '../components/Tabs/Tabs'
import ProfileItem from '../components/ProfileItem/ProfileItem'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import useAuthRedirect from '../hooks/useAuthRedirect'

function FollowersPage() {
  const params = useParams()
  const username = params.username
  const [data, loading] = useCollectionData(query(collection(db, 'users') as CollectionReference<User>, where('username', '==', username), limit(1)))
  const user = !!data && data[0]
  const navigate = useNavigate()

  useAuthRedirect()

  const usersRef = collection(db, 'users') as CollectionReference<User>
  const arr = user && user.followers.length ? user.followers : ['_']
  const usersQuery = query(usersRef, where('id', 'in', arr))
  const [users] = useCollectionData(usersQuery)

  const goBack = () => navigate('/' + username)

  if (loading) return <p>Loading...</p>

  return user ? (
    <LayoutWithSidebar>
      <main>
        <PageHeader goBack={true} onClick={goBack}>
          <h2 className="heading">{user.name}</h2>
          <p className="grey small">@{username}</p>
        </PageHeader>
        <Tabs
          tabs={[
            { text: 'Followers', link: `/${username}/followers`, active: true },
            { text: 'Following', link: `/${username}/following`, active: false },
          ]}
        />

        <div>{users && users.map((user) => <ProfileItem key={user.id} user={user} />)}</div>
      </main>
    </LayoutWithSidebar>
  ) : (
    <p>This accoun't doesn't exists</p>
  )
}

export default FollowersPage
