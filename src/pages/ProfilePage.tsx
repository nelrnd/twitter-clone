import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CollectionReference, collection, limit, query, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { User } from '../types'
import useAuthRedirect from '../hooks/useAuthRedirect'
import Layout from '../components/Layout/Layout'
import ProfileHeader from '../components/ProfileHeader/ProfileHeader'
import Feed from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'
import IconButton from '../components/Buttons/IconButton'
import BackIcon from '../assets/back.svg'

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

  const goBack = () => {
    if (location.key === 'default') {
      navigate('/home')
    } else {
      navigate(-1)
    }
  }

  if (loading) return <p>Loading...</p>

  return user ? (
    <Layout>
      <main>
        <PageHeader>
          <IconButton handleClick={goBack}>
            <BackIcon />
          </IconButton>
          <div>
            <h2 className="heading">{user.name}</h2>
            <p className="small grey">{user.posts.length} Tweets</p>
          </div>
        </PageHeader>
        <ProfileHeader user={user} />
        <Feed postIds={user.posts} />
      </main>
    </Layout>
  ) : (
    <p>This account doesn't exists</p>
  )
}

export default ProfilePage
