import { useCollectionData } from "react-firebase-hooks/firestore"
import PageHeader from "../components/PageHeader/PageHeader"
import SearchBar from "../components/Search/Search"
import useAuthRedirect from "../hooks/useAuthRedirect"
import { CollectionReference, collection } from "firebase/firestore"
import { auth, db } from "../firebase"
import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { TweetCard } from "../components/Tweet/TweetCard"
import Notification from "../components/Notification/Notification"
import { Notification as NotifType } from "../types"

const Notifications: React.FC = () => {
  useAuthRedirect()
  const user = useContext(UserContext)
  const [notifications, loading] = useCollectionData(user ? collection(db, 'users', user.id, 'notifications') as CollectionReference<NotifType> : null)

  return (
    <>
      <main className="notifications">
        <PageHeader>
          <h2 className="heading">Notifications</h2>
        </PageHeader>

        <div>
          {notifications?.sort((a, b) => b.timestamp - a.timestamp).map((notif, id) => <Notification key={id} notification={notif} />)}
        </div>
      </main>

      <aside>
        <SearchBar />
      </aside>
    </>
  )
}

export default Notifications