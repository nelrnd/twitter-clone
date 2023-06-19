import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, User, getAuth, signInWithPopup, updateProfile } from 'firebase/auth'
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDocs, getFirestore, increment, limit, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { createId } from './utils'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

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
export const storage = getStorage()

export const joinWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result
  } catch (err) {
    console.error(err)
  }
}

export const createUser = async (user: User | null, username: string) => {
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
      tweetsCount: 0,
      likesCount: 0,
      joinedAt: Date.now(),
    })
  } catch (err) {
    console.error(err)
  }
}

export const updateUserInfo = async (updatedInfo: { name?: string; bio?: string; profileURL?: string }, userId: string) => {
  try {
    if (auth.currentUser) {
      const update: { displayName?: string; photoURL?: string } = {}
      if (updatedInfo.name) update.displayName = updatedInfo.name
      if (updatedInfo.profileURL) update.photoURL = updatedInfo.profileURL
      await updateProfile(auth.currentUser, update)
    }
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, updatedInfo)
  } catch (err) {
    console.error(err)
  }
}

export const createTweet = async (content: string[], media: File[], userId: string, inReplyTo?: {tweetId: string, userId: string} | null) => {
  try {
    if ((!content.length && !media.length) || !userId) return
    const tweetId = createId()
    const tweetRef = doc(db, 'tweets', tweetId)

    const mediaURLs = []
    if (media.length) {
      for (let i = 0; i < media.length; i++) {
        const url = await uploadImage(media[i], `/tweets/${tweetId}/photo_${i}`)
        mediaURLs.push(url)
      }
    }
    setDoc(tweetRef, {
      id: tweetId,
      content: content,
      media: mediaURLs,
      userId: userId,
      timestamp: Date.now(),
      likesCount: 0,
      retweetsCount: 0,
      repliesCount: 0,
      inReplyTo: inReplyTo || null
    })
    if (inReplyTo) {
      const originalTweetRef = doc(db, 'tweets', inReplyTo.tweetId)
      const replyRef = doc(db, 'tweets', inReplyTo.tweetId, 'replies', tweetId)
      updateDoc(originalTweetRef, {
        repliesCount: increment(1)
      })
      setDoc(replyRef, {
        id: tweetId,
        timestamp: Date.now()
      })
    }
    createRefInFeed(tweetId, userId, 'tweet')
    updateUserCount(userId, 'tweetsCount', 1)
  } catch (err) {
    console.error(err)
  }
}

const createRefInFeed = async (tweetId: string, userId: string, type: string) => {
  try {
    if (!tweetId || !userId || !type) return
    const id = createId()
    const ref = doc(db, 'feed', id)
    await setDoc(ref, {
      id: id,
      tweetId: tweetId,
      userId: userId,
      type: type,
      timestamp: Date.now(),
    })
  } catch (err) {
    console.error(err)
  }
}

const deleteRefInFeed = async (tweetId: string, userId: string, type: string) => {
  try {
    const refQuery = query(collection(db, 'feed'), where('tweetId', '==', tweetId), where('userId', '==', userId), where('type', '==', type))
    const snapshot = await getDocs(refQuery)
    snapshot.forEach((doc) => deleteDoc(doc.ref))
  } catch (err) {
    console.error(err)
  }
}

export const checkIfEmailExists = async (email: string) => {
  return await checkIfUserPropExists('email', email)
}

export const checkIfUsernameExists = async (username: string) => {
  return await checkIfUserPropExists('username', username)
}

const checkIfUserPropExists = async (prop: string, value: string) => {
  try {
    const usersCollection = collection(db, 'users')
    const userQuery = query(usersCollection, where(prop, '==', value), limit(1))
    const snapshot = await getDocs(userQuery)
    return !snapshot.empty
  } catch (err) {
    console.error(err)
  }
}

export const toggleFollowAccount = async (userId: string, currentUserId: string | undefined, followed: boolean) => {
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

const updateUserCount = async (userId: string, key: string, value: number) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
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
      setDoc(likeRef, { userId: userId, tweetId: tweetId, timestamp: Date.now() })
      updateTweetCount(tweetId, 'likesCount', 1)
      updateUserCount(userId, 'likesCount', 1)
    } else {
      deleteDoc(likeRef)
      updateTweetCount(tweetId, 'likesCount', -1)
      updateUserCount(userId, 'likesCount', -1)
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
      createRefInFeed(tweetId, userId, 'retweet')
      updateUserCount(userId, 'tweetsCount', 1)
    } else {
      deleteDoc(retweetRef)
      updateTweetCount(tweetId, 'retweetsCount', -1)
      deleteRefInFeed(tweetId, userId, 'retweet')
      updateUserCount(userId, 'tweetsCount', -1)
    }
  } catch (err) {
    console.error(err)
  }
}

export const uploadImage = async (file: File, path: string) => {
  try {
    if (!file || !path) return
    const completePath = `${path}.${file.name.split('.').pop()}`
    const imageRef = ref(storage, completePath)
    await uploadBytes(imageRef, file)
    const url = await getDownloadURL(imageRef)
    return url
  } catch (err) {
    console.error(err)
  }
}
