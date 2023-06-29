import { Link, useParams } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { CollectionReference, collection, orderBy, query} from 'firebase/firestore'
import { auth, createChat, createMessage, db } from '../../firebase'
import { useUserDataWithId } from '../../hooks/useUserData'
import { Message as MessageType, User } from '../../types'
import { useState } from 'react'
import Message from '../Message/Message'
import SendIcon from '../../assets/send.svg'
import './ChatRoom.sass'

const ChatRoom: React.FC = () => {
  const { chatId } = useParams<'chatId'>()
  const members = chatId?.split('-')
  const authUserId = auth.currentUser?.uid
  const otherUserId = members?.find((m) => m !== authUserId)
  const [otherUserData] = useUserDataWithId(otherUserId)

  const messagesCollection = collection(db, 'chats', chatId || '_', 'messages') as CollectionReference<MessageType>
  const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'))
  const [messages] = useCollectionData(chatId ? messagesQuery : null)

  return chatId && otherUserData && authUserId ? (
    <div className='ChatRoom'>
      <ChatHeader user={otherUserData} />
      <ChatMessages messages={messages} />
      <ChatInput chatId={chatId} authUserId={authUserId} isFirstMessage={!messages || messages.length === 0} />
    </div>
  ) : null
}

type ChatHeaderProps = {
  user: User
}

const ChatHeader: React.FC<ChatHeaderProps> = ({user}) => {
  return (
    <header className='ChatHeader'>
      <Link to={`/${user.username}`}>
        <Avatar src={user.profileURL} size={32} />
      </Link>
      <h2 className="heading-2">{user.name}</h2>
    </header>
  )
}

type ChatMessagesProps = {
  messages: MessageType[] | undefined
}

const ChatMessages: React.FC<ChatMessagesProps> = ({messages}) => {
  const checkIfFollowUp = (msg: MessageType, id: number) => !!(messages && messages[id + 1] && messages[id + 1].timestamp - msg.timestamp < 60000 && msg.from === messages[id + 1].from)

  return (
    <div className="ChatMessages">
      {messages?.map((msg, id) => <Message key={id} msg={msg} isFollowUp={checkIfFollowUp(msg, id)} />)}
    </div>
  )
}

type ChatInputProps = {
  chatId: string
  authUserId: string
  isFirstMessage: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({chatId, authUserId, isFirstMessage}) => {
  const [msgText, setMsgText] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setMsgText(e.target.value)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!msgText) return
    const text = msgText
    setMsgText('')
    if (isFirstMessage) {
      await createChat(chatId.split('-'))
    }
    await createMessage(chatId, authUserId, text)
  }

  return (
    <form className='ChatInput' onSubmit={handleSubmit}>
      <div className="input_wrapper">
        <input type="text" value={msgText} onChange={handleChange} placeholder='Start a new message' />
        <button type="submit" disabled={!msgText}><SendIcon /></button>
      </div>
    </form>
  )
}

export default ChatRoom