import { DocumentReference, doc } from 'firebase/firestore'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'

interface User {
  id: string
  username: string
  name: string
  email: string
  profileURL: string | null
  headerURL: string | null
  posts: string[]
  likedPosts: string[]
  following: string[]
  followers: string[]
  createdAt: number
}

type DocumentData = [User | null | undefined, boolean]

export default function useUserData(userId: string): DocumentData {
  const [user, loading] = useDocumentData(doc(db, 'users', userId) as DocumentReference<User | null>)
  return [user, loading]
}
