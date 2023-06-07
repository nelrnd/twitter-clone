import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, increment, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { createId } from './utils'

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

export async function createUser(user: User | null, username: string) {
  try {
    if (!user) return

    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
      id: user.uid,
      username: username,
      name: user.displayName,
      email: user.email,
      bio: '',
      profileURL: user.photoURL || null,
      headerURL: null,
      following: [],
      followers: [],
      joinedAt: Date.now(),
    })
  } catch (err) {
    console.error(err)
  }
}

export async function createTweet(content: string[], media: string[], userId: string) {
  try {
    if ((!content.length && !media.length) || !userId) return
    // create tweet doc and add it to database
    const tweetId = createId()
    const tweetRef = doc(db, 'tweets', tweetId)
    await setDoc(tweetRef, {
      id: tweetId,
      content: content,
      media: media,
      userId: userId,
      timestamp: Date.now(),
      likesCount: 0,
      retweetsCount: 0,
      repliesCount: 0,
    })
    // create tweet ref in feed
    const tweetRefId = createId()
    const tweetRefRef = doc(db, 'feed', tweetRefId)
    await setDoc(tweetRefRef, {
      id: tweetRefId,
      tweetId: tweetId,
      userId: userId,
      type: 'tweet',
      timestamp: Date.now(),
    })
  } catch (err) {
    console.error(err)
  }
}

export async function checkIfEmailExists(email: string) {
  return await checkIfUserPropExists('email', email)
}

export async function checkIfUsernameExists(username: string) {
  return await checkIfUserPropExists('username', username)
}

async function checkIfUserPropExists(prop: string, value: string) {
  try {
    const usersCollection = collection(db, 'users')
    const userQuery = query(usersCollection, where(prop, '==', value), limit(1))
    const snapshot = await getDocs(userQuery)
    return !snapshot.empty
  } catch (err) {
    console.error(err)
  }
}

export async function toggleFollowAccount(userId: string, currentUserId: string | undefined, followed: boolean) {
  try {
    if (!currentUserId) return
    const userRef = doc(db, 'users', userId)
    const currentUserRef = doc(db, 'users', currentUserId)
    if (followed) {
      await updateDoc(userRef, {
        followers: arrayRemove(currentUserId),
      })
      await updateDoc(currentUserRef, {
        following: arrayRemove(userId),
      })
    } else {
      await updateDoc(userRef, {
        followers: arrayUnion(currentUserId),
      })
      await updateDoc(currentUserRef, {
        following: arrayUnion(userId),
      })
    }
  } catch (err) {
    console.error(err)
  }
}

const updateTweetCount = async (tweetId: string, key: string, value: number) => {
  try {
    const tweetRef = doc(db, 'tweets', tweetId)
    await updateDoc(tweetRef, {
      [key]: increment(value),
    })
  } catch (err) {
    console.error(err)
  }
}

export const toggleLikeTweet = async (tweetId: string, userId: string, liked: boolean) => {
  try {
    if (!tweetId || !userId) return
    const likeRef = doc(db, 'tweets', tweetId, 'likes', userId)
    if (!liked) {
      setDoc(likeRef, { userId: userId, timestamp: Date.now() })
      updateTweetCount(tweetId, 'likesCount', 1)
    } else {
      deleteDoc(likeRef)
      updateTweetCount(tweetId, 'likesCount', -1)
    }
  } catch (err) {
    console.error(err)
  }
}

export const toggleRetweetTweet = async (tweetId: string, userId: string, retweeted: boolean) => {
  try {
    if (!tweetId || !userId) return
    const retweetRef = doc(db, 'tweets', tweetId, 'retweets', userId)
    if (!retweeted) {
      setDoc(retweetRef, { userId: userId, timestamp: Date.now() })
      updateTweetCount(tweetId, 'retweetsCount', 1)
    } else {
      deleteDoc(retweetRef)
      updateTweetCount(tweetId, 'retweetsCount', -1)
    }
  } catch (err) {
    console.error(err)
  }
}
