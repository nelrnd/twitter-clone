import { useParams } from "react-router-dom"
import { CollectionReference, collection, limit, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import useAuthRedirect from "../hooks/useAuthRedirect"
import { User } from "../types"
import Layout from "../components/Layout/Layout"
import ProfileHeader from "../components/ProfileHeader/ProfileHeader"

function ProfilePage() {
  const params = useParams()
  const username = params.username
  // Get user data
  const ref = collection(db, 'users') as CollectionReference<User>
  const qry = query(ref, where('username', '==', username), limit(1))
  const [data, loading] = useCollectionData(qry) 
  const user = !!data && data[0]

  useAuthRedirect()

  if (loading) return <p>Loading...</p>

  return user ? (
    <Layout>
      <main>
        <ProfileHeader user={user} />
      </main>
    </Layout>
  ) : <p>This account doesn't exists</p>
}

export default ProfilePage