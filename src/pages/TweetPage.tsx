import { useParams } from "react-router-dom"
import Layout from "../components/Layout/Layout"
import PageHeader from "../components/PageHeader/PageHeader"
import useTweetData from "../hooks/useTweetData"
import TweetMain from "../components/Tweet/TweetMain"
import Loader from "../components/Loader/Loader"

const TweetPage: React.FC = () => {
  const { tweetId } = useParams()
  const [tweet, loading] = useTweetData(tweetId)

  if (loading) return <Loader />

  return (
    <Layout>
      <main>
        <PageHeader goBack={true} onClick={() => {console.log('go back')}}>
          <h2>Tweet</h2>
        </PageHeader>

        {tweet ? <TweetMain tweet={tweet} /> : null}
      </main>
    </Layout>
  )
}

export default TweetPage