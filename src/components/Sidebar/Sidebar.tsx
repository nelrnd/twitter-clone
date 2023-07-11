import { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'
import { GlobalContext } from '../../contexts/GlobalContext'
import { User } from '../../types'
import Button from '../Buttons/Button'
import Avatar from '../Avatar/Avatar'
import UserName from '../User/UserName'
import './Sidebar.sass'

// Icons
import TwitterIcon from '../../assets/twitter.svg'
import HomeIcon from '../../assets/home.svg'
import HomeIconActive from '../../assets/home-filled.svg'
import NotificationsIcon from '../../assets/notification.svg'
import NotificationsIconActive from '../../assets/notification-filled.svg'
import MessagesIcon from '../../assets/message.svg'
import MessagesIconActive from '../../assets/message-filled.svg'
import ProfileIcon from '../../assets/profile.svg'
import ProfileIconActive from '../../assets/profile-filled.svg'
import TweetIcon from '../../assets/tweet.svg'
import DotsIcon from '../../assets/dots.svg'

const Sidebar: React.FC = () => {
  const { authUser } = useContext(GlobalContext)
  const navigate = useNavigate()
  const location = useLocation()

  const { notifications, chats } = useContext(GlobalContext)
  const notificationsCount = notifications?.filter((n) => !n.read).length
  const chatsCount = authUser && chats?.filter((c) => c.unreadCount[authUser.id]).length || 0

  const handleTweet = () => navigate('/compose/tweet', {state: {backgroundLocation: location}})

  return authUser ? (
    <nav className='Sidebar'>
      <div className='tabs'>
        <SidebarTab href={'home'} icon={<TwitterIcon />} />
        <SidebarTab href={'home'} text={'Home'} icon={<HomeIcon />} activeIcon={<HomeIconActive />} />
        <SidebarTab href={'notifications'} text={'Notifications'} icon={<NotificationsIcon />} activeIcon={<NotificationsIconActive />} badgeCount={notificationsCount} />
        <SidebarTab href={'messages'} text={'Messages'} icon={<MessagesIcon />} activeIcon={<MessagesIconActive />} badgeCount={chatsCount} />
        <SidebarTab href={authUser?.username} text={'Profile'} icon={<ProfileIcon />} activeIcon={<ProfileIconActive />} />
        <Button style='primary' size='large' onClick={handleTweet}>
          <TweetIcon />
          <span className='text'>Tweet</span>
        </Button>
      </div>

      <ManageUser user={authUser} />
    </nav>
  ) : null
}

type SidebarTabProps = {
  href: string
  text?: string
  icon: JSX.Element
  activeIcon?: JSX.Element
  badgeCount?: number
}

const SidebarTab: React.FC<SidebarTabProps> = ({ href, text, icon, activeIcon, badgeCount }) => {
  const location = useLocation()
  const isActive = location.pathname.split('/')[1] === href

  return (
    <Link to={href} className={`SidebarTab ${isActive ? 'active' : ''} ${!text ? 'noText' : ''}`}>
      <div className={`content ${text ? 'hasText' : ''}`}>
        {!!badgeCount && <Badge count={badgeCount} />}
        {isActive ? activeIcon || icon : icon}
        {text && <span>{text}</span>}
      </div>
    </Link>
  )
}

type BadgeProps = {
  count: number
}

const Badge: React.FC<BadgeProps> = ({ count }) => {
  return (
    <div className='Badge'>
      {count < 10 ? count : '9+'}
    </div>
  )
}

type ManageUserProps = {
  user: User
}

const ManageUser: React.FC<ManageUserProps> = ({ user }) => {
  const [open, setOpen] = useState(false)

  const handleLogout = () => signOut(auth)

  return user ? (
    <div className='ManageUser_wrapper'>
      {open && (
        <>
          <div className='ManageUserPopup'>
            <ul>
              <li onClick={handleLogout}>Log out @{user.username}</li>
            </ul>
            <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M-0.000488281 0L7.41111 7.4116L14.8227 0H-0.000488281Z" fill="white" />
            </svg>
          </div>
          <div className='backdrop' onClick={() => setOpen(false)} />
        </>
      )}
      <div className='ManageUser' onClick={() => setOpen(true)}>
        <Avatar src={user.profileURL} size={40} />
        <UserName user={user} />
        <DotsIcon />
      </div>
    </div>
  ) : null
}

export default Sidebar
