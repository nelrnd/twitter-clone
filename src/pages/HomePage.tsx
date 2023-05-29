import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, createPost } from '../firebase'
import { signOut } from 'firebase/auth'
import { useState } from 'react'
import useAuthRedirect from '../hooks/useAuthRedirect'
import Layout from '../components/Layout/Layout'
import Feed from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'

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
        <PageHeader>
          <h2 className="heading">Home</h2>
        </PageHeader>
        <PostForm userId={user.uid} />
        <Feed general={true} />
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

export default HomePage
