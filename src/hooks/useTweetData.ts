import { DocumentReference, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { Tweet } from '../types'

export default function useTweetData(tweetId: string | undefined | null): [Tweet | null | undefined, boolean] {
  const [tweet, loading] = useDocumentData(tweetId ? doc(db, 'tweets', tweetId || '_') as DocumentReference<Tweet | null> : null)
  return [tweet, loading]
}
