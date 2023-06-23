import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../Buttons/Button'
import './Sidebar.sass'

import Icon from '../../assets/icon.svg'
import HomeIcon from '../../assets/home.svg'
import HomeIconFilled from '../../assets/home-filled.svg'
import BellIcon from '../../assets/bell.svg'
import BellIconFilled from '../../assets/bell-filled.svg'
import MessageIcon from '../../assets/message.svg'
import MessageIconFilled from '../../assets/message-filled.svg'
import ProfileIcon from '../../assets/profile.svg'
import ProfileIconFilled from '../../assets/profile-filled.svg'
import DotsIcon from '../../assets/dots.svg'
import { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import Avatar from '../Avatar/Avatar'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { NotificationContext } from '../../contexts/NotificationsContext'

function Sidebar() {
  const [manageOpened, setManageOpened] = useState(false)
  const notifications = useContext(NotificationContext)
  const user = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname

  const openManage = () => setManageOpened(true)
  const closeManage = () => setManageOpened(false)

  const logout = () => signOut(auth)
  const tweet = () => navigate('/compose/tweet', {state: {backgroundLocation: location}})

  const sidebarTabs = [
    {
      text: 'Home',
      link: '/home',
      icon: HomeIcon,
      iconFilled: HomeIconFilled,
      active: pathname === '/home',
    },
    {
      text: 'Notifications',
      link: '/notifications',
      icon: BellIcon,
      iconFilled: BellIconFilled,
      active: pathname === '/notifications',
      label: notifications?.filter((n) => n.read === false).length
    },
    {
      text: 'Messages',
      link: '/messages',
      icon: MessageIcon,
      iconFilled: MessageIconFilled,
      active: pathname === '/messages',
    },
    {
      text: 'Profile',
      link: (user && `/${user.username}`) || '',
      icon: ProfileIcon,
      iconFilled: ProfileIconFilled,
      active: user && pathname.split('/')[1] === user.username && !pathname.includes('status'),
    },
  ]

  return (
    <div className="Sidebar_wrapper">
      <aside className="Sidebar">
        <div className="top">
          <Link to="/home" className="icon">
            <Icon />
          </Link>

          <nav className="tabs">
            {sidebarTabs.map((tab, id) => (
              <Link to={tab.link} key={id}>
                <div className={`tab ${tab.active ? 'active' : ''}`}>
                  {tab.active ? <tab.iconFilled /> : <tab.icon />}
                  {!!tab.label && <div className='label'>{tab.label}</div>}
                  <span>{tab.text}</span>
                </div>
              </Link>
            ))}
          </nav>

          <Button style="primary" size="large" onClick={tweet}>
            Tweet
          </Button>
        </div>

        {user ? (
          <>
            <div className="bottom">
              <div className={`popup  ${manageOpened ? 'open' : ''}`}>
                <ul>
                  <li onClick={logout}>Log out @{user.username}</li>
                </ul>
                <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M-0.000488281 0L7.41111 7.4116L14.8227 0H-0.000488281Z" fill="white" />
                </svg>
              </div>

              <div className="manage-user" onClick={openManage}>
                <Avatar src={user.profileURL} size={40} />
                <div>
                  <h3>{user.name}</h3>
                  <p className="grey">@{user.username}</p>
                </div>
                <DotsIcon />
              </div>
            </div>
          </>
        ) : null}
        <div className={`manage-user-backdrop ${manageOpened ? 'open' : ''}`} onClick={closeManage} />
      </aside>
    </div>
  )
}

export default Sidebar
