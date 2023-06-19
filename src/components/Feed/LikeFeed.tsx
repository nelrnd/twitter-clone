import { collectionGroup, orderBy, query, where } from "firebase/firestore"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { db } from "../../firebase"
import Loader from "../Loader/Loader"
import TweetCard from "../Tweet/TweetCard"

type LikeFeedProps = {
  userId: string
}

const LikeFeed: React.FC<LikeFeedProps> = ({userId}) => {
  const [feed, feedLoading] = useCollectionData(query(collectionGroup(db, 'likes'), where('userId', '==', userId), orderBy('timestamp', 'desc')))
  
  if (feedLoading) return <Loader />

  return (
    <div className="Feed">
      {feed?.map((i) => (
        <TweetCard key={i.tweetId} tweetId={i.tweetId} />
      ))}
    </div>
  )
}

export default LikeFeed