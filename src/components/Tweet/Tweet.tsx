import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'
import { toggleLike, toggleRetweet } from '../../firebase'
import { Tweet as TweetType } from '../../types'
import { getTime } from '../../utils'
import useTweetData from '../../hooks/useTweetData'
import useUserData from '../../hooks/useUserData'
import Avatar from '../Avatar/Avatar'
import Loader from '../Loader/Loader'
import './Tweet.sass'

// Icons
import LikeIcon from '../../assets/heart.svg'
import LikeFilledIcon from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'

type PreTweetProps = {
  tweetId: string
  retweetedBy: string | null | undefined
}

type TweetProps = {
  tweet: TweetType
  retweetedBy: string | null | undefined
}

type RetweetBarProps = {
  retweetedBy: string
}

const PreTweet: React.FC<PreTweetProps> = ({ tweetId, retweetedBy }) => {
  const [tweet, loading] = useTweetData(tweetId)
  if (loading) return <Loader />
  return tweet ? <Tweet tweet={tweet} retweetedBy={retweetedBy} /> : null
}

const Tweet: React.FC<TweetProps> = ({ tweet, retweetedBy }) => {
  const [user, loading] = useUserData(tweet.createdBy)
  const currentUser = useContext(UserContext)

  const liked = tweet.likes.includes(currentUser?.id)
  const retweeted = tweet.retweets.includes(currentUser?.id)

  const like = () => toggleLike(tweet.id, currentUser?.id, liked)
  const retweet = () => toggleRetweet(tweet.id, currentUser?.id, retweeted)
  const reply = () => console.log('reply')

  if (loading) return <Loader />

  return user ? (
    <article className="Tweet">
      {retweetedBy ? <RetweetBar retweetedBy={retweetedBy} /> : null}
      <div>
        <Link to={`/${user.username}`}>
          <Avatar profileURL={user.profileURL} />
        </Link>
      </div>

      <div>
        <header>
          <Link to={`/${user.username}`}>
            <h3 className="name">{user.name}</h3>
          </Link>
          <Link to={`/${user.username}`}>
            <p className="grey">@{user.username}</p>
          </Link>
          <p className="grey">· {getTime(tweet.createdAt)}</p>
        </header>

        <main>
          {tweet.text.map((line, id) => (
            <p key={id}>{line}</p>
          ))}
        </main>

        <footer>
          <div onClick={like} className={`action like ${liked ? 'active' : ''}`}>
            {liked ? <LikeFilledIcon /> : <LikeIcon />}
            {tweet.likes.length || ''}
          </div>
          <div onClick={retweet} className={`action retweet ${retweeted ? 'active' : ''}`}>
            <RetweetIcon />
            {tweet.retweets.length || ''}
          </div>
          <div onClick={reply} className="action reply">
            <ReplyIcon />
            {tweet.replies.length || ''}
          </div>
        </footer>
      </div>
    </article>
  ) : null
}

const RetweetBar: React.FC<RetweetBarProps> = ({ retweetedBy }) => {
  const [user, loading] = useUserData(retweetedBy)
  const currentUser = useContext(UserContext)

  if (loading || !user) return null

  return (
    <div className="RetweetBar">
      <div>
        <RetweetIcon />
      </div>
      <p>{user.id === currentUser?.id ? 'You' : user.name} Retweeted</p>
    </div>
  )
}

export default PreTweet
