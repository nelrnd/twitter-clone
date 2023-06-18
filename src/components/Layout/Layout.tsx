import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import './Layout.sass'
import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'

const Layout: React.FC = () => {
  const user = useContext(UserContext)
  const location = useLocation()

  if (location.pathname === '/') return <Navigate to="/home" replace={true} />

  return user ? (
    <div className="Layout">
      <Sidebar />
      <div className="right-part">
        <Outlet />
      </div>
    </div>
  ) : <Outlet />
}

export default Layout