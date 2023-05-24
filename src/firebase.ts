import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { doc, getFirestore, setDoc } from 'firebase/firestore'
import { createPostId } from './utils'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(config)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function createPost(text: string, userId: string): Promise<void> {
  try {
    const postId = createPostId()
    const postRef = doc(db, 'posts', postId)
    await setDoc(postRef, {
      id: postId,
      text: text,
      created_at: Date.now(),
      created_by: userId,
    })
  } catch (err) {
    console.error(err)
  }
}
