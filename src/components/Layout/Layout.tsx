import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import './Layout.sass'
import { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext'

const Layout: React.FC = () => {
  const { authUser } = useContext(GlobalContext)
  const location = useLocation()

  if (location.pathname === '/') return <Navigate to="/home" replace={true} />

  return authUser ? (
    <div className="Layout">
      <Sidebar />
      <div className="right-part">
        <Outlet />
      </div>
    </div>
  ) : <Outlet />
}

export default Layout