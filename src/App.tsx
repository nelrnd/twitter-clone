import './App.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, createPost, createUserInFirestore, db, toggleLikePost } from './firebase'
import { signInWithPopup, signOut, GoogleAuthProvider, User } from 'firebase/auth'
import { useState } from 'react'
import { CollectionReference, collection, orderBy, query } from 'firebase/firestore'
import useUserData from './hooks/useUserData'

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) return <p>Loading...</p>

  return user ? <Home user={user} /> : <Login />
}

function Login() {
  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    await createUserInFirestore(auth.currentUser)
  }

  return (
    <div>
      <h1>Sign in</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

function Home({ user }: { user: User }) {
  function logout(): void {
    signOut(auth)
  }

  return (
    <div>
      <h1>Home</h1>
      <button onClick={logout}>Logout</button>

      <PostForm userId={user.uid} />
      <Feed />
    </div>
  )
}

function PostForm({ userId }: { userId: string }) {
  const [text, setText] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text) return
    const textCopy = text
    setText('')
    createPost(textCopy, userId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={handleChange}></textarea>
      <button>Post</button>
    </form>
  )
}

interface Post {
  id: string
  text: string
  liked_by: string[]
  created_by: string
  created_at: number
}

function Feed() {
  const postsRef = collection(db, 'posts') as CollectionReference<Post>
  const postsQuery = query(postsRef, orderBy('created_at', 'desc'))
  const [posts, loading] = useCollectionData(postsQuery)

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

function Post({ post }: { post: Post }) {
  const [user] = useUserData(post.created_by)
  const uid = auth.currentUser?.uid
  if (!uid) return null
  const liked = post.liked_by.includes(uid)

  const handleClick = () => toggleLikePost(post.id, uid, post.liked_by.includes(uid))

  return (
    <div className="Post">
      {user && (
        <>
          <img src={user.photoURL} />
          <h3>{user.name}</h3>
        </>
      )}

      <p>{post.text}</p>

      <button onClick={handleClick}>{!liked ? 'Like' : 'Unlike'}</button>
      <p>{post.liked_by.length}</p>
    </div>
  )
}

export default App
