import { db } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, limit, query, where } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import { User } from '../types'
import Layout from '../components/Layout/Layout'
import PageHeader from '../components/PageHeader/PageHeader'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'
import Tabs from '../components/Tabs/Tabs'

function FollowingPage() {
  const params = useParams()
  const username = params.username
  const [data, loading] = useCollectionData(query(collection(db, 'users') as CollectionReference<User>, where('username', '==', username), limit(1)))
  const user = !!data && data[0]
  const navigate = useNavigate()

  const goBack = () => navigate('/' + username)

  if (loading) return <p>Loading...</p>

  return user ? (
    <Layout>
      <main>
        <PageHeader>
          <div className="bar">
            <IconButton handleClick={goBack}>
              <BackIcon />
            </IconButton>
            <div>
              <h2 className="heading">{user.name}</h2>
              <p className="grey small">@{username}</p>
            </div>
          </div>
          <Tabs
            tabs={[
              { text: 'Followers', link: `/${username}/followers`, active: false },
              { text: 'Following', link: `/${username}/following`, active: true },
            ]}
          />
        </PageHeader>
      </main>
    </Layout>
  ) : (
    <p>This accoun't doesn't exists</p>
  )
}

export default FollowingPage
