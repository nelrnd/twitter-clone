import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth'
import { arrayRemove, arrayUnion, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
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

export async function joinWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
  } catch (err) {
    console.error(err)
  }
}

export async function createUserInFirestore(user: User | null, username: string) {
  try {
    if (user) {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        id: user.uid,
        username: username,
        name: user.displayName,
        email: user.email,
        profileURL: user.photoURL || null,
        headerURL: null,
        posts: [],
        likedPosts: [],
        following: [],
        followers: [],
        createdAt: Date.now(),
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export async function createPost(text: string, userId: string): Promise<void> {
  try {
    const postId = createPostId()
    const postRef = doc(db, 'posts', postId)
    await setDoc(postRef, {
      id: postId,
      text: text,
      likes: [],
      retweets: [],
      replies: [],
      createdAt: Date.now(),
      createdBy: userId,
    })
  } catch (err) {
    console.error(err)
  }
}

export async function toggleLikePost(postId: string, userId: string | undefined, liked: boolean) {
  try {
    if (!userId) return
    const postRef = doc(db, 'posts', postId)
    const userRef = doc(db, 'users', userId)
    if (liked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      })
      await updateDoc(userRef, {
        likedPosts: arrayRemove(postId),
      })
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      })
      await updateDoc(userRef, {
        likedPosts: arrayUnion(postId),
      })
    }
  } catch (err) {
    console.error(err)
  }
}
