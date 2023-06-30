import LikeIcon from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import FollowIcon from '../../assets/profile-filled.svg'
import './Notification.sass'
import Avatar from '../Avatar/Avatar'
import { Notification as NotifType } from '../../types'
import { TweetCard } from '../Tweet/TweetCard'
import useTweetData from '../../hooks/useTweetData'
import Loader from '../Loader/Loader'
import { useUserDataWithId } from '../../hooks/useUserData'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { GlobalContext } from '../../contexts/GlobalContext'

type NotificationProps = {
  notification: NotifType
}

const Notification: React.FC<NotificationProps> = ({notification}) => {
  switch (notification.type) {
    case 'like':
      return <Notification_like notification={notification} />
    case 'retweet':
      return <Notification_retweet notification={notification} />
    case 'follow':
      return <Notification_follow notification={notification} />
    case 'reply':
      return <Notification_reply notification={notification} />
    default:
      return null
  }
}

const Notification_like: React.FC<NotificationProps> = ({notification}) => {
  const [user, userLoading] = useUserDataWithId(notification.from)
  const [tweet, tweetLoading] = useTweetData(notification.tweetId)
  const { authUser } = useContext(GlobalContext)
  const navigate = useNavigate()

  if (userLoading || tweetLoading) return <Loader />

  return user && tweet ? (
    <div className="Notification like" onClick={() => navigate(`/${authUser?.username}/status/${tweet.id}`)}>
      <div className="left-col">
        <LikeIcon />
      </div>
      <div className="right-col">
        <Link to={'/' + user.username}><Avatar src={user.profileURL} size={32} /></Link>
        <p><Link to={'/' + user.username} className='name'>{user.name}</Link> liked your tweet</p>
        <div className="grey">{tweet.content.map((line, id) => <p key={id}>{line}</p>)}</div>
      </div>
    </div>
  ) : null
}

const Notification_retweet: React.FC<NotificationProps> = ({notification}) => {
  const [user, userLoading] = useUserDataWithId(notification.from)
  const [tweet, tweetLoading] = useTweetData(notification.tweetId)
  const { authUser } = useContext(GlobalContext)
  const navigate = useNavigate()

  if (userLoading || tweetLoading) return <Loader />

  return user && tweet ? (
    <div className="Notification retweet" onClick={() => navigate(`/${authUser?.username}/status/${tweet.id}`)}>
      <div className="left-col">
        <RetweetIcon />
      </div>
      <div className="right-col">
        <Link to={'/' + user.username}><Avatar src={user.profileURL} size={32} /></Link>
        <p><Link to={'/' + user.username} className='name'>{user.name}</Link> retweeted your tweet</p>
        <div className="grey">{tweet.content.map((line, id) => <p key={id}>{line}</p>)}</div>
      </div>
    </div>
  ) : null
}

const Notification_follow: React.FC<NotificationProps> = ({notification}) => {
  const [user, loading] = useUserDataWithId(notification.from)
  const navigate = useNavigate()

  if (loading) return <Loader />
  
  return user ? (
    <div className="Notification follow" onClick={() => navigate('/' + user.username)}>
      <div className="left-col">
        <FollowIcon />
      </div>
      <div className="right-col">
        <Link to={'/' + user.username}><Avatar src={user.profileURL} size={32} /></Link>
        <p><Link to={'/' + user.username} className='name'>{user.name}</Link> followed you</p>
      </div>
    </div>
  ) : null
}

const Notification_reply: React.FC<NotificationProps> = ({notification}) => {
  const [tweet, loading] = useTweetData(notification.tweetId)

  if (loading) return <Loader />

  return tweet ? (
    <TweetCard tweet={tweet} />
  ) : null
}

export default Notification