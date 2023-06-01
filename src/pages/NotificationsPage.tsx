import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import useAuthRedirect from '../hooks/useAuthRedirect'

function NotificationsPage() {
  useAuthRedirect()

  return (
    <LayoutWithSidebar>
      <main>
        <h1>Notifications</h1>
      </main>
    </LayoutWithSidebar>
  )
}

export default NotificationsPage
