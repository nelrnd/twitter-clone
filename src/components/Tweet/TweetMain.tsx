import { useContext } from 'react'
import { Tweet, User } from '../../types'
import PhotoPreview from '../PhotoPreview/PhotoPreview'
import ProfileInfo from '../ProfileInfo/ProfileInfo'
import { UserContext } from '../../contexts/UserContext'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { doc } from 'firebase/firestore'
import { db, toggleLikeTweet, toggleRetweetTweet } from '../../firebase'
import { getLongTime } from '../../utils'
import { Link, useLocation } from 'react-router-dom'
import './TweetMain.sass'

// Icons
import LikeIcon from '../../assets/heart.svg'
import LikeFilledIcon from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'

type TweetProps = {
  tweet: Tweet
  user: User
}

type BarProps = {
  tweet: Tweet
}

const TweetMain: React.FC<TweetProps> = ({ tweet, user }) => {
  return (
    <article className="TweetMain">
      <ProfileInfo user={user} />

      <main>
        {tweet.content.map((line, id) => (
          <p key={id}>{line}</p>
        ))}
        {tweet.media.length > 0 && (
          <div className={`photo-previews layout-${tweet.media.length}`}>
            {tweet.media.map((photo, id) => (
              <PhotoPreview src={photo} key={'photo_' + id} />
            ))}
          </div>
        )}
      </main>

      <DateBar tweet={tweet} />

      {tweet.likesCount || tweet.retweetsCount || tweet.repliesCount ? (
        <StatsBar tweet={tweet} />
      ) : null}

      <ActionsBar tweet={tweet} />
    </article>
  )
}

const DateBar: React.FC<BarProps> = ({tweet}) => (
  <div className="DateBar small grey">{getLongTime(tweet.timestamp)}</div>
)

const StatsBar: React.FC<BarProps> = ({ tweet }) => {
  const { likesCount, retweetsCount, repliesCount } = tweet
  const location = useLocation()

  return (
    <ul className="StatsBar small">
      {likesCount > 0 && (
        <li>
          <Link to="likes" state={{backgroundLocation: location}}>
            <strong>{likesCount}</strong>
            {' '}
            <span className="grey">{likesCount > 1 ? 'Likes' : 'Like'}</span>
          </Link>
        </li>
      )}
      {retweetsCount > 0 && (
        <li>
          <Link to="retweets" state={{backgroundLocation: location}}>
            <strong>{retweetsCount}</strong>
            {' '}
            <span className="grey">{retweetsCount > 1 ? 'Retweets' : 'Retweet'}</span>
          </Link>
        </li>
      )}
      {repliesCount > 0 && (
        <li>
          <strong>{repliesCount}</strong>
          {' '}
          <span className="grey">{repliesCount > 1 ? 'Replies' : 'Reply'}</span>
        </li>
      )}
    </ul>
  )
}

const ActionsBar: React.FC<BarProps> = ({ tweet }) => {
  const user = useContext(UserContext)

  const [liked] = useDocumentData(doc(db, 'tweets', tweet.id, 'likes', user?.id || '_'))
  const [retweeted] = useDocumentData(doc(db, 'tweets', tweet.id, 'retweets', user?.id || '_'))

  const like = () => toggleLikeTweet(tweet.id, user?.id, !!liked)
  const retweet = () => toggleRetweetTweet(tweet.id, user?.id, !!retweeted)
  const reply = () => console.log('reply')

  return (
    <ul className="ActionsBar">
      <li onClick={like} className={`like ${liked ? 'active' : ''}`}>
        {liked ? <LikeFilledIcon /> : <LikeIcon />}
      </li>
      <li onClick={retweet} className={`retweet ${retweeted ? 'active' : ''}`}>
        <RetweetIcon />
      </li>
      <li onClick={reply} className='reply'>
        <ReplyIcon />
      </li>
    </ul>
  )
}

export default TweetMain
