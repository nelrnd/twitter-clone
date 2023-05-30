import { DocumentReference, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { User } from '../types'

type DocumentData = [User | null | undefined, boolean]

export default function useUserData(userId: string | undefined): DocumentData {
  const [user, loading] = useDocumentData(doc(db, 'users', userId || '_') as DocumentReference<User | null>)
  return [user, loading]
}
