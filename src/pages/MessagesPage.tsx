import LayoutWithSidebar from '../components/LayoutWithSidebar/LayoutWithSidebar'
import useAuthRedirect from '../hooks/useAuthRedirect'

function MessagesPage() {
  useAuthRedirect()

  return (
    <LayoutWithSidebar>
      <main>
        <h1>Messages</h1>
      </main>
    </LayoutWithSidebar>
  )
}

export default MessagesPage
