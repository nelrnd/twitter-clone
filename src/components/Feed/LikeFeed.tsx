import { CollectionReference, collectionGroup, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore"
import { db } from "../../firebase"
import { useEffect, useRef, useState } from "react"
import { FeedItem } from "../../types"
import InfiniteScroll from "react-infinite-scroll-component"
import TweetCard from "../Tweet/TweetCard"
import Loader from "../Loader/Loader"

type LikeFeedProps = {
  userId: string
}

const FETCH_NUMBER = 10

const LikeFeed: React.FC<LikeFeedProps> = ({ userId }) => {
  const [likes, setLikes] = useState<FeedItem[]>([])
  const reachedLastLike = useRef(false)

  const fetchInitialLikes = async (userId: string) => {
    const likesCollection = collectionGroup(db, 'likes') as CollectionReference<FeedItem>
    const q = query(likesCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'), limit(FETCH_NUMBER))
    const querySnapshot = await getDocs(q)
    const likes = querySnapshot.docs.map((doc) => doc.data())
    setLikes(likes)
  }

  const fetchMoreLikes = async (lastLike: FeedItem, userId: string) => {
    if (reachedLastLike.current === true) {
      return
    }
    const likesCollection = collectionGroup(db, 'likes') as CollectionReference<FeedItem>
    const q = query(likesCollection, where('userId', '==', userId), orderBy('timestamp', 'desc'), startAfter(lastLike && lastLike.timestamp || 0), limit(FETCH_NUMBER))
    const querySnapshot = await getDocs(q)
    const likes = querySnapshot.docs.map((doc) => doc.data())
    setLikes((prevLikes) => prevLikes.concat(likes))
    if (likes.length < FETCH_NUMBER) {
      reachedLastLike.current = true
    }
  }

  useEffect(() => {
    fetchInitialLikes(userId)
  }, [userId])

  return (
    <div className='Feed'> 
      <InfiniteScroll dataLength={likes.length} next={() => fetchMoreLikes(likes[likes.length - 1], userId)} hasMore={!reachedLastLike.current} loader={<Loader />}>
        {likes.map((like) => <TweetCard key={like.tweetId} tweetId={like.tweetId} />)}
      </InfiniteScroll>
    </div>
  )
}

export default LikeFeed