import { useNavigate, useOutletContext } from "react-router-dom"
import { Tweet, User } from "../types"
import PageHeader from "../components/PageHeader/PageHeader"
import TweetMain from "../components/Tweet/TweetMain"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { collection, orderBy, query } from "firebase/firestore"
import { db } from "../firebase"
import Loader from "../components/Loader/Loader"
import TweetCard, { TweetCard as LoadedTweetCard } from "../components/Tweet/TweetCard"
import { useEffect, useRef } from "react"
import useTweetData from "../hooks/useTweetData"
import SearchBar from "../components/Search/Search"

const TweetIndex: React.FC = () => {
  const {tweet, user}: {tweet: Tweet, user: User} = useOutletContext()
  const navigate = useNavigate()
  const start = useRef<HTMLDivElement>(null)

  const [inReplyToTweet, loading] = useTweetData(tweet.inReplyTo?.tweetId)
  const [replies, repliesLoading] = useCollectionData(query(collection(db, 'tweets', tweet.id, 'replies'), orderBy('timestamp')))

  const goBack = () => {
    if (window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/home')
    }
  }

  useEffect(() => {
    scrollAtTop()
  }, [start])

  const scrollAtTop = () => {
    if (start.current) {
      start.current.scrollIntoView()
    }
  }

  return (
    <>
      <main className="TweetIndex">
        <PageHeader onClick={goBack}>
          <h2 className="heading-2">Tweet</h2>
        </PageHeader>

        {tweet.inReplyTo && loading && <Loader />}
        {inReplyToTweet && <LoadedTweetCard tweet={inReplyToTweet} isReply={true} onLoad={scrollAtTop} />}

        <div style={{minHeight: 'calc(100vh - 52px)'}} ref={start}>
          <TweetMain tweet={tweet} user={user} />

          {repliesLoading && <Loader />}
          {replies && <div>{replies.map((reply) => <TweetCard key={reply.id} tweetId={reply.id} />)}</div>}
        </div>
      </main>

      <aside>
        <SearchBar />
      </aside>
    </>
  )
}

export default TweetIndex