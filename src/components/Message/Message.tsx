import { auth } from '../../firebase'
import { Message as MessageType } from '../../types'
import { getMsgTime } from '../../utils'
import './Message.sass'

type MessageProps = {
  msg: MessageType
  isFollowUp: boolean
}

const Message: React.FC<MessageProps> = ({msg, isFollowUp}) => {
  return (
    <div className={`Message_wrapper ${msg.from === auth.currentUser?.uid ? 'sent' : 'received'} ${isFollowUp ? 'followUp' : ''}`}>
      <div className="Message">{msg.text}</div>
      {!isFollowUp && <p className='date grey small'>{getMsgTime(msg.timestamp)}</p>}
    </div>
  )
}

export default Message