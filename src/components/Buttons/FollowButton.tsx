import { useEffect, useState } from 'react'
import { toggleFollowAccount } from '../../firebase'
import './Buttons.sass'

interface FollowButtonProps {
  userId: string
  currentUserId: string | undefined
  followed: boolean
  size?: string
}

function FollowButton({ userId, currentUserId, followed, size = 'medium' }: FollowButtonProps) {
  const [text, setText] = useState(followed ? 'Following' : 'Follow')

  const handleClick = () => toggleFollowAccount(userId, currentUserId, followed)

  useEffect(() => {
    setText(followed ? 'Following' : 'Follow')
  }, [followed])

  return (
    <button className={`Button FollowButton ${followed ? 'outline' : 'dark'} ${size}`} onClick={handleClick} onMouseEnter={() => followed && setText('Unfollow')} onMouseLeave={() => followed && setText('Following')}>
      {text}
    </button>
  )
}

export default FollowButton
