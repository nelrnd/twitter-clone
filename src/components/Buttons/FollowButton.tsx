import { useEffect, useState } from 'react'
import { toggleFollowAccount } from '../../firebase'
import './Buttons.sass'

interface FollowButtonProps {
  userId: string
  authUserId: string | undefined
  followed: boolean
  size?: string
}

function FollowButton({ userId, authUserId, followed, size = 'medium' }: FollowButtonProps) {
  const [text, setText] = useState(followed ? 'Following' : 'Follow')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    toggleFollowAccount(userId, authUserId, followed)
  }

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
