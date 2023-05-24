import { DocumentReference, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'

interface User {
  id: string
  name: string
  photoURL: string
  liked_posts: string[]
  created_at: number
}

export default function useUserData(id: string) {
  const [user] = useDocumentData(doc(db, 'users', id) as DocumentReference<User>)
  return [user]
}
