import { CollectionReference, collection, collectionGroup, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Loader from '../Loader/Loader'
import './Feed.sass'
import TweetCard from '../Tweet/TweetCard'
import { Tweet as TweetType } from '../../types'

type FeedProps = {
  userIds: string[]
}

/*
const Feed: React.FC<FeedProps> = ({ userIds }) => {
  const feedCollection = collection(db, 'feed')
  const feedQuery = query(feedCollection, where('userId', 'in', userIds), orderBy('timestamp', 'desc'))
  const [feed, loading] = useCollectionData(feedQuery)

  if (loading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((item) => (
        <Tweet key={item.id} tweetId={item.tweetId} retweetedBy={item.type === 'retweet' ? item.userId : null} />
      ))}
    </div>
  )
}
*/
const Feed: React.FC<FeedProps> = ({userIds}) => {
  const [feed, feedLoading] = useCollectionData(query(collection(db, 'feed'), where('userId', 'in', userIds), orderBy('timestamp', 'desc')))
  const [tweets, tweetsLoading] = useCollectionData(query(collection(db, 'tweets') as CollectionReference<TweetType>, where('id', 'in', feed?.map((i) => i.tweetId) || ['_'])))

  if (feedLoading || tweetsLoading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((i) => (
        <TweetCard key={i.id} tweet={tweets?.find((t) => t.id === i.tweetId)} retweetedBy={i.type == 'retweet' && i.userId || null} />
      ))}
    </div>
  )
}

type LikeFeedProps = {
  userId: string
}

// feed of liked tweet from user
const LikeFeed: React.FC<LikeFeedProps> = ({userId}) => {
  const feedQuery = query(collectionGroup(db, 'likes'), where('userId', '==', userId), orderBy('timestamp', 'desc'))
  const [feed, loading] = useCollectionData(feedQuery)

  if (loading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((item) => (
        <Tweet key={item.tweetId} tweetId={item.tweetId} retweetedBy={null} />
      ))}
    </div>
  )
}

export default Feed
export { LikeFeed }