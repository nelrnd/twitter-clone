import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, User, getAuth, signInWithPopup } from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { createTweetId } from './utils'

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
        tweets: [],
        retweets: [],
        likes: [],
        following: [],
        followers: [],
        createdAt: Date.now(),
      })
    }
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

// Tweet related functions

export async function createTweet(text: string[], userId: string) {
  try {
    const tweetId = createTweetId()
    const tweetRef = doc(db, 'tweets', tweetId)
    const userRef = doc(db, 'users', userId)
    const createdAt = Date.now()
    await setDoc(tweetRef, {
      id: tweetId,
      text: text,
      likes: [],
      retweets: [],
      replies: [],
      createdBy: userId,
      createdAt: createdAt,
    })
    await updateDoc(userRef, {
      tweets: arrayUnion({ tweetId: tweetId, createdAt: createdAt }),
    })
  } catch (err) {
    console.error(err)
  }
}

export async function toggleLike(tweetId: string, userId: string, liked: boolean) {
  try {
    if (!tweetId || !userId) return
    const tweetRef = doc(db, 'tweets', tweetId)
    const userRef = doc(db, 'users', userId)
    if (!liked) {
      await updateDoc(tweetRef, {
        likes: arrayUnion(userId),
      })
      await updateDoc(userRef, {
        likes: arrayUnion(tweetId),
      })
    } else {
      await updateDoc(tweetRef, {
        likes: arrayRemove(userId),
      })
      await updateDoc(userRef, {
        likes: arrayRemove(tweetId),
      })
    }
  } catch (err) {
    console.error(err)
  }
}

export async function toggleRetweet(tweetId: string, userId: string, retweeted: boolean) {
  try {
    if (!tweetId || !userId) return
    const tweetRef = doc(db, 'tweets', tweetId)
    const userRef = doc(db, 'users', userId)
    if (!retweeted) {
      await updateDoc(tweetRef, {
        retweets: arrayUnion(userId),
      })
      await updateDoc(userRef, {
        retweets: arrayUnion({ tweetId: tweetId, retweetedAt: Date.now() }),
      })
    } else {
      await updateDoc(tweetRef, {
        retweets: arrayRemove(userId),
      })
      const userSnapshot = await getDoc(userRef)
      const userData = userSnapshot.data()
      if (!userData) return
      const index = userData.retweets.findIndex((tweet: { tweetId: string }) => tweet.tweetId === tweetId)
      if (index !== -1) {
        await updateDoc(userRef, {
          retweets: arrayRemove(userData.retweets[index]),
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}
