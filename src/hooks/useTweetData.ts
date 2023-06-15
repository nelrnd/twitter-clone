import { DocumentReference, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { Tweet } from '../types'

export default function useTweetData(tweetId: string | undefined): [Tweet | null | undefined, boolean] {
  const [tweet, loading] = useDocumentData(doc(db, 'tweets', tweetId || '_') as DocumentReference<Tweet | null>)
  return [tweet, loading]
}
