import useAuthRedirect from '../hooks/useAuthRedirect'
import PageHeader from '../components/PageHeader/PageHeader'
import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import TweetComposer from '../components/TweetComposer/TweetComposer'
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'
import Feed from '../components/Feed/Feed'

type HomePageProps = {
  children?: string | JSX.Element | JSX.Element[]
}

const HomePage: React.FC<HomePageProps> = ({ children }) => {
  const user = useContext(UserContext)
  useAuthRedirect()

  return user ? (
    <>
      <LayoutWithSidebar>
        <main className="home">
          <PageHeader>
            <div className="bar">
              <h2 className="heading">Home</h2>
            </div>
          </PageHeader>

          <TweetComposer />

          <Feed userIds={[user.id, ...user.following]} />
        </main>
      </LayoutWithSidebar>
      {children}
    </>
  ) : null
}

export default HomePage
