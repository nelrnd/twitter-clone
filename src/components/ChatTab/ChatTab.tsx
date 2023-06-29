import { useNavigate } from 'react-router-dom'
import { useUserDataWithId } from '../../hooks/useUserData'
import { auth } from '../../firebase'
import { Chat } from '../../types'
import { getChatId, getTime } from '../../utils'
import Avatar from '../Avatar/Avatar'
import Loader from '../Loader/Loader'
import './ChatTab.sass'

type ChatTabProps = {
  chat: Chat
  isActive: boolean
}

const ChatTab: React.FC<ChatTabProps> = ({chat, isActive}) => {
  const authUserId = auth.currentUser?.uid
  const [user] = useUserDataWithId(chat.members.find((m) => m !== authUserId))
  const unread = authUserId && chat.unreadCount[authUserId] > 0
  const navigate = useNavigate()

  const handleClick = () => navigate(`/messages/${getChatId([user?.id, authUserId])}`)

  return user && authUserId ? (
    <div className={`ChatTab ${isActive ? 'active' : ''} ${unread ? 'unread' : ''}`} onClick={handleClick}>
      <div className="left-col">
        <Avatar src={user.profileURL} size={48} />
      </div>
      <div className="right-col">
        <div className='msg-header'>
          <div>
            <strong>{user.name}</strong> 
            <span className='grey'> @{user.username}</span>
            {chat.lastMessage.timestamp && <span className='grey'> · {getTime(chat.lastMessage.timestamp)}</span>}
          </div>
          {unread && <div className='unread-dot' />}
        </div>
        <div className='msg-text'>{chat.lastMessage.text || <pre> </pre>}</div>
      </div>
    </div>
  ) : <Loader />
}

export default ChatTab