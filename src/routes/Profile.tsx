import { Outlet, useParams } from "react-router-dom"
import { useUserDataWithUsername } from "../hooks/useUserData"
import useAuthRedirect from "../hooks/useAuthRedirect"
import Loader from "../components/Loader/Loader"

const Profile: React.FC = () => {
  const { username } = useParams<'username'>()
  const [user, loading] = useUserDataWithUsername(username)

  useAuthRedirect()

  if (loading) return <Loader />

  return <Outlet context={{user}} />
}

export default Profile