import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import useAuthRedirect from '../hooks/useAuthRedirect'
import Layout from '../components/Layout/Layout'
import Feed from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'
import PostForm from '../components/PostForm/PostForm'

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
          <div className="bar">
            <h2 className="heading">Home</h2>
          </div>
        </PageHeader>
        <PostForm user={user} />
        <Feed general={true} />
      </main>

      <div></div>
    </Layout>
  ) : null
}

export default HomePage
