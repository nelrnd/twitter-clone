import { CollectionReference, collection, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Loader from '../Loader/Loader'
import './Feed.sass'
import TweetCard from '../Tweet/TweetCard'
import { Tweet } from '../../types'

type FeedProps = {
  userIds: string[]
}

const Feed: React.FC<FeedProps> = ({userIds}) => {
  const [feed, feedLoading] = useCollectionData(query(collection(db, 'feed'), where('userId', 'in', userIds), orderBy('timestamp', 'desc')))
  const [tweets, tweetsLoading] = useCollectionData(feed?.length ? query(collection(db, 'tweets') as CollectionReference<Tweet>, where('id', 'in', feed?.map((i) => i.tweetId))) : null)

  if (feedLoading || tweetsLoading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((i) => (
        <TweetCard key={i.id} tweet={tweets?.find((t) => t.id === i.tweetId)} retweetedBy={i.type == 'retweet' && i.userId || null} />
      ))}
    </div>
  )
}

export default Feed