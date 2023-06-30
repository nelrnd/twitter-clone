import { useContext, useState } from "react"
import PageHeader from "../components/PageHeader/PageHeader"
import TweetComposer from "../components/TweetComposer/TweetComposer"
import Feed from "../components/Feed/Feed"
import useAuthRedirect from "../hooks/useAuthRedirect"
import Tabs from "../components/Tabs/Tabs"
import SearchBar from "../components/Search/Search"
import { GlobalContext } from "../contexts/GlobalContext"

type HomeProps = {
  children?: string | JSX.Element | JSX.Element[]
}

const Home: React.FC<HomeProps> = ({children}) => {
  const { authUser } = useContext(GlobalContext)
  const [currentTab, setCurrentTab] = useState('For you')

  useAuthRedirect()

  const tabs = [
    {
      text: 'For you',
      onClick: () => setCurrentTab('For you'),
      active: currentTab === 'For you'
    },
    {
      text: 'Following',
      onClick: () => setCurrentTab('Following'),
      active: currentTab === 'Following'
    }
  ]

  return authUser ? (
    <>
      <main>
        <PageHeader>
          <h2 className="heading">Home</h2>
        </PageHeader>

        <Tabs tabs={tabs} />

        <TweetComposer />

        <Feed userIds={currentTab === 'Following' ? [authUser.id, ...authUser.following] : null} />
      </main>

      <aside>
        <SearchBar />
      </aside>

      {children}
    </>
  ) : null
}

export default Home