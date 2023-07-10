import { Link, useLocation, useNavigate } from "react-router-dom"
import { useUserDataWithId } from "../../hooks/useUserData"
import Loader from "../Loader/Loader"
import Avatar from "../Avatar/Avatar"
import { getTime } from "../../utils"
import { Tweet, User } from "../../types"
import PhotoPreview from "../PhotoPreview/PhotoPreview"
import { useContext, useState } from "react"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { doc } from "firebase/firestore"
import { db, toggleLikeTweet, toggleRetweetTweet } from "../../firebase"
import './TweetCard.sass'

// Icons
import LikeIcon from '../../assets/heart.svg'
import LikeFilledIcon from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'
import useTweetData from "../../hooks/useTweetData"
import { GlobalContext } from "../../contexts/GlobalContext"
import ProfilePopup from "../Profile/ProfilePopup"

type PreTweetCardProps = {
  tweetId: string
  retweetedBy?: string | null 
  isReply?: boolean
}

const PreTweetCard: React.FC<PreTweetCardProps> = ({tweetId, retweetedBy, isReply}) => {
  const [tweet, loading] = useTweetData(tweetId)

  if (loading) return <Loader />

  return tweet ? <TweetCard tweet={tweet} retweetedBy={retweetedBy} isReply={isReply} /> : null
}

type TweetCardProps = {
  tweet: Tweet | undefined
  retweetedBy: string | null | undefined
  isReply?: boolean
  onLoad?: () => void
}

const TweetCard: React.FC<TweetCardProps> = ({tweet, retweetedBy, isReply, onLoad}) => {
  const [user, loading] = useUserDataWithId(tweet?.userId)
  const navigate = useNavigate()
  const location = useLocation()
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

  if (loading) return <Loader />

  return tweet && user ? (
    <>
      <article className={`TweetCard ${isReply ? 'isReply' : ''}`} onLoad={onLoad}>
        {retweetedBy && <RetweetBar retweetedBy={retweetedBy} />}
        <div className="left-col">
          <Link to={'/' + user.username} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Avatar src={user.profileURL} size={40} />
          </Link>
        </div>
        <div className="right-col">
          <header>
            <Link to={'/' + user.username} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <h3 className="name">{user.name}</h3>
            </Link>
            <Link to={'/' + user.username} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <p className="grey">@{user.username}</p>
            </Link>
            <p className="grey">· {getTime(tweet.timestamp)}</p>
          </header>
          {tweet.inReplyTo && <ReplyingTo tweet={tweet} />}
          <main>
            {tweet.content.map((line, id) => <p key={id}>{line}</p>)}
            {tweet.media.length > 0 && (
              <div className={`photo-previews layout-${tweet.media.length}`}>
                {tweet.media.map((photo, id) => (
                  <Link key={'photo_' + id} to={`/${user.username}/status/${tweet.id}/photo/${id + 1}`} state={{backgroundLocation: location, photo: photo}}>
                    <PhotoPreview src={photo} />
                  </Link>
                ))}
              </div>
            )}
          </main>
          <StatsActionsBar tweet={tweet} user={user} />
          <div className="background" onClick={() => navigate(`/${user.username}/status/${tweet.id}`, { state: { previousLocation: location }})} />
        </div>
      </article>
      <ProfilePopup user={user} position={popupPosition} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
    </>
  ) : null
}

type StatsActionsBarProps = {
  tweet: Tweet
  user: User
}

const StatsActionsBar: React.FC<StatsActionsBarProps> = ({tweet, user}) => {
  const { authUser } = useContext(GlobalContext)
  const navigate = useNavigate()
  const location = useLocation()

  const [liked] = useDocumentData(doc(db, 'tweets', tweet.id, 'likes', authUser?.id || '_'))
  const [retweeted] = useDocumentData(doc(db, 'tweets', tweet.id, 'retweets', authUser?.id || '_'))

  const like = () => toggleLikeTweet(tweet.id, user.id, !!liked)
  const retweet = () => toggleRetweetTweet(tweet.id, user.id, !!retweeted)
  const reply = () => navigate('/compose/tweet', {state: {backgroundLocation: location, tweet: tweet, user: user}})
  
  return (
    <ul className="StatsActionsBar">
      <li onClick={like} className={`like ${liked ? 'active' : ''}`}>
        {liked ? <LikeFilledIcon /> : <LikeIcon />}
        {tweet.likesCount || ''}
      </li>
      <li onClick={retweet} className={`retweet ${retweeted ? 'active' : ''}`}>
        <RetweetIcon />
        {tweet.retweetsCount || ''}
      </li>
      <li onClick={reply} className="reply">
        <ReplyIcon />
        {tweet.repliesCount || ''}
      </li>
    </ul>
  )
}

const RetweetBar: React.FC<{retweetedBy: string}> = ({retweetedBy}) => {
  const [user, loading] = useUserDataWithId(retweetedBy)
  const { authUser } = useContext(GlobalContext)

  if (loading || !user) return null

  return (
    <div className="RetweetBar">
      <RetweetIcon />
      <p>{user.id === authUser?.id ? 'You' : user.name} Retweeted</p>
    </div>
  )
}

type ReplyingToProps = {
  tweet: Tweet
}

const ReplyingTo: React.FC<ReplyingToProps> = ({tweet}) => {
  const [user] = useUserDataWithId(tweet.inReplyTo?.userId)
  return user ? <p className="ReplyingTo grey">Replying to <Link to={'/' + user.username} className="link">@{user.username}</Link></p> : null
}

export default PreTweetCard
export { TweetCard }