import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import useAuthRedirect from '../hooks/useAuthRedirect'
import PageHeader from '../components/PageHeader/PageHeader'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import TweetComposer from '../components/TweetComposer/TweetComposer'
import Feed from '../components/Feed/Feed'
import useUserData from '../hooks/useUserData'
import Loader from '../components/Loader/Loader'

function HomePage() {
  const [user, loading] = useAuthState(auth)
  const [userData, dataLoading] = useUserData(user?.uid)
  useAuthRedirect()

  if (loading || dataLoading) return <Loader />

  return user && userData ? (
    <LayoutWithSidebar>
      <main className="home">
        <PageHeader>
          <div className="bar">
            <h2 className="heading">Home</h2>
          </div>
        </PageHeader>

        <TweetComposer />

        <Feed tweets={[...userData.tweets, ...userData.retweets]} userId={user.uid} />
      </main>
    </LayoutWithSidebar>
  ) : null
}

export default HomePage
