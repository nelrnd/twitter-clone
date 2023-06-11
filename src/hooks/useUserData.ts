import { CollectionReference, DocumentReference, collection, doc, limit, query, where } from 'firebase/firestore'
import { useCollectionData, useDocumentData } from 'react-firebase-hooks/firestore'
import { db } from '../firebase'
import { User } from '../types'

type HookReturn = [User | null | undefined, boolean]

const useUserDataWithId = (userId: string | undefined): HookReturn => {
  const [user, loading] = useDocumentData(doc(db, 'users', userId || '_') as DocumentReference<User | null>)
  return [user, loading]
}

const useUserDataWithUsername = (username: string | undefined): HookReturn => {
  const q = query(collection(db, 'users') as CollectionReference<User | null>, where('username', '==', username), limit(1))
  const [data, loading] = useCollectionData(q)
  const user = data && data[0]
  return [user, loading]
}

export { useUserDataWithId, useUserDataWithUsername }
