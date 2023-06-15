import { useContext } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc } from 'firebase/firestore'
import { db, toggleLikeTweet, toggleRetweetTweet } from '../../firebase'
import { Link } from 'react-router-dom'
import { UserContext } from '../../contexts/UserContext'
import { Tweet as TweetType } from '../../types'
import { getTime } from '../../utils'
import useTweetData from '../../hooks/useTweetData'
import { useUserDataWithId } from '../../hooks/useUserData'
import Avatar from '../Avatar/Avatar'
import Loader from '../Loader/Loader'
import './Tweet.sass'

// Icons
import LikeIcon from '../../assets/heart.svg'
import LikeFilledIcon from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'
import PhotoPreview from '../PhotoPreview/PhotoPreview'

type PreTweetProps = {
  tweetId: string
  retweetedBy: string | null | undefined
}

type TweetProps = {
  tweet: TweetType
  retweetedBy: string | null | undefined
}

type TweetBottomBarProps = {
  tweet: TweetType
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
  const [user, loading] = useUserDataWithId(tweet.userId)

  if (loading) return <Loader />

  return user ? (
    <article className="Tweet">
      {retweetedBy ? <RetweetBar retweetedBy={retweetedBy} /> : null}
      <div>
        <Link to={`/${user.username}`}>
          <Avatar src={user.profileURL} />
        </Link>
      </div>

      <div className="content">
        <header>
          <Link to={`/${user.username}`}>
            <h3 className="name">{user.name}</h3>
          </Link>
          <Link to={`/${user.username}`}>
            <p className="grey">@{user.username}</p>
          </Link>
          <p className="grey">· {getTime(tweet.timestamp)}</p>
        </header>

        <main>
          {tweet.content.map((line, id) => (
            <p key={id}>{line}</p>
          ))}

          {tweet.media.length > 0 && (
            <div className={`photo-previews layout-${tweet.media.length}`}>
              {tweet.media.map((photo, id) => (
                <PhotoPreview key={'photo_' + id} src={photo} />
              ))}
            </div>
          )}
        </main>

        <TweetBottomBar tweet={tweet} />
      </div>
    </article>
  ) : null
}

const TweetBottomBar: React.FC<TweetBottomBarProps> = ({ tweet }) => {
  const user = useContext(UserContext)

  const [liked] = useDocumentData(doc(db, 'tweets', tweet.id, 'likes', user?.id || '_'))
  const [retweeted] = useDocumentData(doc(db, 'tweets', tweet.id, 'retweets', user?.id || '_'))

  const like = () => toggleLikeTweet(tweet.id, user?.id, !!liked)
  const retweet = () => toggleRetweetTweet(tweet.id, user?.id, !!retweeted)
  const reply = () => console.log('reply')

  return (
    <footer>
      <div onClick={like} className={`action like ${liked ? 'active' : ''}`}>
        {liked ? <LikeFilledIcon /> : <LikeIcon />}
        {tweet.likesCount || ''}
      </div>
      <div onClick={retweet} className={`action retweet ${retweeted ? 'active' : ''}`}>
        <RetweetIcon />
        {tweet.retweetsCount || ''}
      </div>
      <div onClick={reply} className="action reply">
        <ReplyIcon />
        {tweet.repliesCount || ''}
      </div>
    </footer>
  )
}

const RetweetBar: React.FC<RetweetBarProps> = ({ retweetedBy }) => {
  const [user, loading] = useUserDataWithId(retweetedBy)
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
