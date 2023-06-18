import { CollectionReference, collection, collectionGroup, orderBy, query, where } from "firebase/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { db } from "../../firebase"
import { Tweet } from "../../types"
import Loader from "../Loader/Loader"
import TweetCard from "../Tweet/TweetCard"

type LikeFeedProps = {
  userId: string
}

const LikeFeed: React.FC<LikeFeedProps> = ({userId}) => {
  const [feed, feedLoading] = useCollectionData(query(collectionGroup(db, 'likes'), where('userId', '==', userId), orderBy('timestamp', 'desc')))
  const [tweets, tweetsLoading] = useCollectionData(feed?.length ? query(collection(db, 'tweets') as CollectionReference<Tweet>, where('id', 'in', feed?.map((i) => i.tweetId))) : null)
  
  if (feedLoading || tweetsLoading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((i) => (
        <TweetCard key={i.tweetId} tweet={tweets?.find((t) => t.id === i.tweetId)} />
      ))}
    </div>
  )
}

export default LikeFeed