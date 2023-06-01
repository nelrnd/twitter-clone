import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import useAuthRedirect from '../hooks/useAuthRedirect'
import PageHeader from '../components/PageHeader/PageHeader'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import TweetComposer from '../components/TweetComposer/TweetComposer'

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

        <TweetComposer />
      </main>
    </LayoutWithSidebar>
  ) : null
}

export default HomePage
