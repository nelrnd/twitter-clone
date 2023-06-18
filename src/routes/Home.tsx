import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import PageHeader from "../components/PageHeader/PageHeader"
import TweetComposer from "../components/TweetComposer/TweetComposer"
import Feed from "../components/Feed/Feed"
import useAuthRedirect from "../hooks/useAuthRedirect"

type HomeProps = {
  children?: string | JSX.Element | JSX.Element[]
}

const Home: React.FC<HomeProps> = ({children}) => {
  const user = useContext(UserContext)
  useAuthRedirect()

  return user ? (
    <>
      <main>
        <PageHeader>
          <h2 className="heading">Home</h2>
        </PageHeader>

        <TweetComposer />

        <Feed userIds={[user.id, ...user.following]} />
      </main>

      {children}
    </>
  ) : null
}

export default Home