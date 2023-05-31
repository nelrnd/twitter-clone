import { auth, toggleLikePost, toggleRetweetPost } from '../../firebase'
import { Link } from 'react-router-dom'
import { Post as PostInter } from '../../types'
import useUserData from '../../hooks/useUserData'
import Avatar from '../Avatar/Avatar'
import './Post.sass'

import LikeIcon from '../../assets/heart.svg'
import LikeIconFilled from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'
import { getPostTime } from '../../utils'

function Post({ post, inFeedFrom }: { post: PostInter; inFeedFrom?: string }) {
  const [user, loading] = useUserData(post.createdBy)
  const uid = auth.currentUser?.uid

  const liked = !!uid && post.likes.includes(uid)
  const retweeted = !!uid && post.retweets.includes(uid)

  const handleLike = () => toggleLikePost(post.id, uid, liked)
  const handleRetweet = () => toggleRetweetPost(post.id, uid, retweeted)

  if (loading || !user) return <p>Loading...</p>

  return (
    <article className="Post">
      {inFeedFrom && inFeedFrom !== post.createdBy ? <PostRetweetedBar userId={inFeedFrom} /> : null}

      <Link to={`/${user.username}`}>
        <Avatar profileURL={user.profileURL} />
      </Link>

      <div>
        <header>
          <Link to={`/${user.username}`}>
            <div className="name">{user.name}</div>
          </Link>
          <Link to={`/${user.username}`}>
            <div className="username">@{user.username}</div>
          </Link>
          <div className="grey"> · {getPostTime(post.createdAt)}</div>
        </header>

        <main>
          {post.text.map((line, id) => (
            <p key={id}>{line}</p>
          ))}
        </main>

        <footer>
          <div onClick={handleLike} className={`action like ${liked ? 'active' : ''}`}>
            {liked ? <LikeIconFilled /> : <LikeIcon />}
            {post.likes.length || ' '}
          </div>

          <div onClick={handleRetweet} className={`action retweet ${retweeted ? 'active' : ''}`}>
            <RetweetIcon />
            {post.retweets.length || ' '}
          </div>

          <div className="action reply">
            <ReplyIcon />
            {post.replies.length || ' '}
          </div>
        </footer>
      </div>
    </article>
  )
}

function PostRetweetedBar({ userId }: { userId: string }) {
  const [user, loading] = useUserData(userId)
  const uid = auth.currentUser?.uid

  if (loading || !user) return null

  return (
    <div className="PostRetweetedBar">
      <div className="icon">
        <RetweetIcon />
      </div>
      <div>
        <p>{userId === uid ? 'You' : user.name} Retweeted</p>
      </div>
    </div>
  )
}

export default Post
