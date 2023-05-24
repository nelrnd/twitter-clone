import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, createPost, db, toggleLikePost } from '../firebase'
import { Navigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import useUserData from '../hooks/useUserData'
import { CollectionReference, collection, orderBy, query } from 'firebase/firestore'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function HomePage() {
  const [user, loading] = useAuthState(auth)

  function logout(): void {
    signOut(auth)
  }

  if (loading) return <p>Loading...</p>

  return !user ? (
    <Navigate to="/login" replace />
  ) : (
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

function Post({ post }: { post: Post }) {
  const [user] = useUserData(post.created_by)
  const uid = auth.currentUser?.uid
  if (!uid) return null
  const liked = post.liked_by.includes(uid)

  const handleClick = () => toggleLikePost(post.id, uid, liked)

  return (
    <div className="Post">
      {user && (
        <>
          <img src={user.photoURL} referrerPolicy="no-referrer" />
          <h3>{user.name}</h3>
        </>
      )}

      <p>{post.text}</p>

      <button onClick={handleClick}>
        {!liked ? 'Like' : 'Unlike'} {post.liked_by.length}
      </button>
    </div>
  )
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

export default HomePage
