import PageHeader from "../components/PageHeader/PageHeader"
import SearchBar from "../components/Search/Search"
import useAuthRedirect from "../hooks/useAuthRedirect"
import Notification from "../components/Notification/Notification"
import { useContext, useEffect } from "react"
import { auth, readAllNotifications } from "../firebase"
import { GlobalContext } from "../contexts/GlobalContext"


const Notifications: React.FC = () => {
  const { notifications } = useContext(GlobalContext)
  useAuthRedirect()

  useEffect(() => {
    readAllNotifications(auth.currentUser?.uid)
  }, [])

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