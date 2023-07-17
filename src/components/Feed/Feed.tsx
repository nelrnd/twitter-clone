import { CollectionReference, collection, endBefore, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useEffect, useRef, useState } from 'react'
import { FeedItem } from '../../types'
import InfiniteScroll from 'react-infinite-scroll-component'
import TweetCard from '../Tweet/TweetCard'
import Loader from '../Loader/Loader'

type FeedProps = {
  userIds: string[]
}

const FETCH_NUMBER = 15

const Feed: React.FC<FeedProps> = ({ userIds }) => {
  const [refs, setRefs] = useState<FeedItem[]>([])
  const [newRefs, setNewRefs] = useState<FeedItem[]>([])
  const reachedLastRef = useRef<boolean>(false)
  const currentUserIds = useRef(userIds)

  const fetchInitialTweets = async (userIds: string[]) => {
    const refsCollection = collection(db, 'feed') as CollectionReference<FeedItem>
    const q = userIds.length ? 
      query(refsCollection, where('userId', 'in', userIds), orderBy('timestamp', 'desc'), limit(FETCH_NUMBER)) : 
      query(refsCollection, where('timestamp', '>', 0), orderBy('timestamp', 'desc'), limit(FETCH_NUMBER))
    const querySnapshot = await getDocs(q)
    const refs = querySnapshot.docs.map((doc) => doc.data())
    setRefs(refs)
    if (refs.length < FETCH_NUMBER) {
      reachedLastRef.current = true
    }
  }

  const fetchMoreTweets = async (lastRef: FeedItem, userIds: string[]) => {
    if (reachedLastRef.current === true || !lastRef) {
      return
    }
    const refsCollection = collection(db, 'feed') as CollectionReference<FeedItem>
    const q = userIds.length ? 
      query(refsCollection, where( 'userId', 'in', userIds), orderBy('timestamp', 'desc'), startAfter(lastRef && lastRef.timestamp || 0), limit(FETCH_NUMBER)) :
      query(refsCollection, where('timestamp', '>', 0), orderBy('timestamp', 'desc'), startAfter(lastRef.timestamp), limit(FETCH_NUMBER))
    const querySnapshot = await getDocs(q)
    const refs = querySnapshot.docs.map((doc) => doc.data())
    setRefs((prevRefs) => prevRefs.concat(refs))
    if (refs.length < FETCH_NUMBER) {
      reachedLastRef.current = true
    }
  }

  const fetchNewTweets = async (firstRef: FeedItem, userIds: string[]) => {
    const refsCollection = collection(db, 'feed') as CollectionReference<FeedItem>
    const q = userIds.length ?
     query(refsCollection, where('userId', 'in', userIds), orderBy('timestamp', 'desc'), endBefore(firstRef.timestamp)) :
     query(refsCollection, where('timestamp', '>', 0), orderBy('timestamp', 'desc'), endBefore(firstRef.timestamp))
    const querySnapshot = await getDocs(q)
    const refs = querySnapshot.docs.map((doc) => doc.data())
    setNewRefs(refs)
  }

  useEffect(() => {
    if (currentUserIds.current.toString() !== userIds.toString() || refs.length === 0) {
      fetchInitialTweets(userIds)
      setNewRefs([])
      currentUserIds.current = userIds
    } else {
      fetchNewTweets(refs[0], userIds)
    }
  }, [userIds, refs])

  return (
    <div>
      {newRefs.map((ref) => <TweetCard key={ref.id} tweetId={ref.tweetId} retweetedBy={ref.type === 'retweet' ? ref.userId : null} />)}
      <InfiniteScroll dataLength={refs.length} next={() => fetchMoreTweets(refs[refs.length -1], userIds)} hasMore={!reachedLastRef.current} loader={<Loader />}>
        {refs.map((ref) => <TweetCard key={ref.id} tweetId={ref.tweetId} retweetedBy={ref.type === 'retweet' ? ref.userId : null} />)}
      </InfiniteScroll>
    </div>
  )
}

export default Feed