import { useParams } from "react-router-dom"
import { collection, limit, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import useAuthRedirect from "../hooks/useAuthRedirect"

function ProfilePage() {
  const params = useParams()
  const username = params.username
  // Get user data
  const ref = collection(db, 'users')
  const qry = query(ref, where('username', '==', username), limit(1))
  const [data, loading] = useCollectionData(qry)
  const user = data && data[0]

  useAuthRedirect()

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>@{username}</h1>
      {user ? (<>
        {user.profileURL ? <img src={user.profileURL} alt="" /> : null}
        <h2>{user.name}</h2>
        <p>{user.username}</p>
      </>) : <p>This account doesn't exists</p>}
    </div>
  )
}

export default ProfilePage