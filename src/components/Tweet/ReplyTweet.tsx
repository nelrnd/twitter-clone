import { Link, useLocation } from "react-router-dom"
import { Tweet, User } from "../../types"
import { getTime } from "../../utils"
import Avatar from "../Avatar/Avatar"
import './ReplyTweet.sass'

const ReplyTweet: React.FC = () => {
  const location = useLocation()

  const tweet: Tweet = location.state.tweet
  const user: User = location.state.user

  if (!tweet || !user) return null

  return (
    <div className="ReplyTweet">
      <div className="left-col">
        <Avatar src={user.profileURL} size={40} />
      </div>
      <div className="right-col">
        <header>
          <h3 className="name">{user.name}</h3>
          <p className="grey">@{user.username}</p>
          <p className="grey">· {getTime(tweet.timestamp)}</p>
        </header>
        <main>
          {tweet.content.map((line, id) => <p key={id}>{line}</p>)}
        </main>
        <p className="grey">Replying to <Link className="link" to={'/' + user.username}>@{user.username}</Link></p>
      </div>
    </div>
  )
}

export default ReplyTweet