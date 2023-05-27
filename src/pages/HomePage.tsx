import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, createPost, db } from '../firebase'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import { CollectionReference, collection, orderBy, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import useAuthRedirect from '../hooks/useAuthRedirect'
import Post from '../components/Post/Post'
import Layout from '../components/Layout/Layout'

function HomePage() {
  const [user, loading] = useAuthState(auth)
  useAuthRedirect()

  function logout(): void {
    signOut(auth)
  }

  if (loading) return <p>Loading...</p>
  
  return user ? (
    <Layout>
      <div>
        <h1>Home</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <main>
        <PostForm userId={user.uid} />
        <Feed />
      </main>

      <div></div>
    </Layout>
  ) : null
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

function Feed() {
  const postsRef = collection(db, 'posts') as CollectionReference<Post>
  const postsQuery = query(postsRef, orderBy('createdAt', 'desc'))
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

export default HomePage
