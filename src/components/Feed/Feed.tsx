import { TweetRef } from '../../types'
import Tweet from '../Tweet/Tweet'
import './Feed.sass'

type FeedProps = {
  tweets: TweetRef[]
  userId?: string
}

const Feed: React.FC<FeedProps> = ({ tweets, userId }) => {
  return (
    <div className="Feed">
      {tweets.map((tweet) => (
        <Tweet key={tweet.tweetId} tweetId={tweet.tweetId} retweetedBy={tweet.retweetedAt ? userId : null} />
      ))}
    </div>
  )
}

export default Feed
