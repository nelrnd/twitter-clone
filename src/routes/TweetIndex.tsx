import { useNavigate, useOutletContext } from "react-router-dom"
import { Tweet, User } from "../types"
import PageHeader from "../components/PageHeader/PageHeader"
import TweetMain from "../components/Tweet/TweetMain"

const TweetIndex: React.FC = () => {
  const [tweet, user]: [tweet: Tweet, user: User] = useOutletContext()
  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/home')
    }
  }

  return (
    <main>
      <PageHeader onClick={goBack}>
        <h2 className="heading-2">Tweet</h2>
      </PageHeader>

      <TweetMain tweet={tweet} user={user} />
    </main>
  )
}

export default TweetIndex