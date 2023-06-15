import { useNavigate, useParams } from "react-router-dom"
import Layout from "../components/Layout/Layout"
import PageHeader from "../components/PageHeader/PageHeader"
import useTweetData from "../hooks/useTweetData"
import TweetMain from "../components/Tweet/TweetMain"
import Loader from "../components/Loader/Loader"

const TweetPage: React.FC = () => {
  const { tweetId } = useParams()
  const [tweet, loading] = useTweetData(tweetId)

  const navigate = useNavigate()

  const goBack = () => {
    if (window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/home')
    }
  }

  if (loading) return <Loader />

  return (
    <Layout>
      <main>
        <PageHeader goBack={true} onClick={goBack}>
          <h2 className="heading">Tweet</h2>
        </PageHeader>

        {tweet ? <TweetMain tweet={tweet} /> : null}
      </main>
    </Layout>
  )
}

export default TweetPage