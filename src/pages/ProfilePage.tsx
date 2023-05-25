import { useParams } from "react-router-dom"
import useUserData from "../hooks/useUserData"

function ProfilePage() {
  const params = useParams()
  const username = params.username
  const [user, loading] = useUserData(username || '')

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