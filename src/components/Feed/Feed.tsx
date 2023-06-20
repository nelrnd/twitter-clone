import { collection, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Loader from '../Loader/Loader'
import './Feed.sass'
import TweetCard from '../Tweet/TweetCard'

type FeedProps = {
  userIds: string[] | null
}

const Feed: React.FC<FeedProps> = ({userIds}) => {
  const feedQuery = query(collection(db, 'feed'), userIds?.length ? where('userId', 'in', userIds) : where('timestamp', '>', 0), orderBy('timestamp', 'desc'))

  const [feed, feedLoading] = useCollectionData(feedQuery)

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