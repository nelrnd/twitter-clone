import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import useTweetData from "../hooks/useTweetData"
import Loader from "../components/Loader/Loader"
import { User } from "../types"

const Tweet: React.FC = () => {
  const {user}: {user: User} = useOutletContext()
  const { tweetId } = useParams<'tweetId'>()
  const [tweet, loading] = useTweetData(tweetId)

  if (loading) return <main><Loader /></main>

  if (!tweet) return <Navigate to={'/home'} />

  return <Outlet context={{tweet, user}} />
}

export default Tweet