import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import './Layout.sass'
import { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext'
import SearchBar from '../Search/Search'

const Layout: React.FC = () => {
  const { authUser } = useContext(GlobalContext)
  const location = useLocation()

  if (location.pathname === '/') {
    return <Navigate to='/home' replace={true} />
  }
  
  return authUser ? (
    <div className='Layout'>
      <Sidebar />
      <Outlet />
    </div>
  ) : (
    <div className='JoinLayout'>
      <Outlet />
    </div>
  )
}

type SectionProps = {
  children: JSX.Element | (JSX.Element|null|boolean|undefined)[]
  className?: string
}

const Main: React.FC<SectionProps> = ({ children, className }) => <main className={`Main ${className || ''}`}>{children}</main>

const Side: React.FC = () => <aside className='Side'><SearchBar /></aside>

export default Layout
export { Main, Side }