import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import useAuthRedirect from '../hooks/useAuthRedirect'
import Feed from '../components/Feed/Feed'
import PageHeader from '../components/PageHeader/PageHeader'
import PostForm from '../components/PostForm/PostForm'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'

function HomePage() {
  const [user, loading] = useAuthState(auth)
  useAuthRedirect()

  if (loading) return <p>Loading...</p>

  return user ? (
    <LayoutWithSidebar>
      <main>
        <PageHeader>
          <div className="bar">
            <h2 className="heading">Home</h2>
          </div>
        </PageHeader>
        <PostForm user={user} />
        <Feed general={true} />
      </main>
    </LayoutWithSidebar>
  ) : null
}

export default HomePage
