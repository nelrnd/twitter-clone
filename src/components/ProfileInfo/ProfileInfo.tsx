import { Link } from 'react-router-dom'
import { User } from '../../types'
import Avatar from '../Avatar/Avatar'
import './ProfileInfo.sass'
import ProfilePopup from '../Profile/ProfilePopup'
import { useState } from 'react'

type ProfileInfoProps = {
  user: User
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({user}) => {
  const [popupPosition, setPopupPosition] = useState<{x: number, y: number}|null>(null)
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout>|null>(null)

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timer) clearTimeout(timer)
    const target = event.target
    if (target instanceof Element && target.className !== 'ProfilePopup') {
      const rect = target.getBoundingClientRect()
      const timer = setTimeout(() => setPopupPosition({ x: rect.left, y: rect.top + rect.height + 10 }), 500) 
      setTimer(timer)
    }
  }

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer)
    const newTimer = setTimeout(() => setPopupPosition(null), 500)
    setTimer(newTimer)
  }

  const link = '/' + user.username
  return (
    <div className="ProfileInfo">
      <Link to={link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Avatar src={user.profileURL} size={40} />
      </Link>
      <div className="names">
        <Link to={link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="name">{user.name}</div>
        </Link>
        <Link to={link} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="username">@{user.username}</div>
        </Link>
      </div>

      <ProfilePopup user={user} position={popupPosition} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
    </div>
  )
}

export default ProfileInfo