import './App.css'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, createPost, db } from './firebase'
import { signInWithPopup, signOut, GoogleAuthProvider, User } from 'firebase/auth'
import { useState } from 'react'
import { CollectionReference, DocumentData, collection, orderBy, query } from 'firebase/firestore'

function App() {
  const [user, loading] = useAuthState(auth)

  if (loading) return <p>Loading...</p>

  return user ? <Home user={user} /> : <Login />
}

function Login() {
  function signInWithGoogle(): void {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
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
  return (
    <div>
      <p>{post.text}</p>
    </div>
  )
}

export default App
