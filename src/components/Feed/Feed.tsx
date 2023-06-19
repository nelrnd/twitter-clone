import { collection, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Loader from '../Loader/Loader'
import './Feed.sass'
import TweetCard from '../Tweet/TweetCard'

type FeedProps = {
  userIds: string[]
}

const Feed: React.FC<FeedProps> = ({userIds}) => {
  const [feed, feedLoading] = useCollectionData(query(collection(db, 'feed'), where('userId', 'in', userIds), orderBy('timestamp', 'desc')))

  if (feedLoading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((i) => (
        <TweetCard key={i.id} tweetId={i.tweetId} retweetedBy={i.type == 'retweet' && i.userId || null} />
      ))}
    </div>
  )
}

export default Feed