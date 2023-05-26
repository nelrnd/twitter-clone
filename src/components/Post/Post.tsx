import { auth, toggleLikePost } from '../../firebase'
import useUserData from '../../hooks/useUserData'
import Avatar from '../Avatar/Avatar'
import './Post.sass'

import LikeIcon from '../../assets/heart.svg'
import LikeIconFilled from '../../assets/heart-filled.svg'
import RetweetIcon from '../../assets/retweet.svg'
import ReplyIcon from '../../assets/comment.svg'
import { Link } from 'react-router-dom'

interface Post {
  id: string
  text: string
  likes: string[]
  retweets: string[]
  replies: string[]
  createdBy: string
  createdAt: number
}

function Post({post}: {post: Post}) {
  const [user, loading] = useUserData(post.createdBy)
  const uid = auth.currentUser?.uid
  const liked = !!uid && post.likes.includes(uid)
  const retweeted = !!uid && post.retweets.includes(uid)

  const handleLike = () => toggleLikePost(post.id, uid, liked)

  if (loading || !user) return <p>Loading...</p>

  return (
    <article className='Post'>
      <Link to={`/${user.username}`}>
        <Avatar profileURL={user.profileURL} />
      </Link>

      <div>
        <header>
          <Link to={`/${user.username}`}>
            <div className='name'>{user.name}</div>
          </Link>
          <Link to={`/${user.username}`}>
            <div className='username'>@{user.username}</div>
          </Link>
        </header>

        <main>
          <p>{post.text}</p>
        </main>

        <footer>
          <div onClick={handleLike} className={`action like ${liked ? 'active' : ''}`}>
            {liked ? <LikeIconFilled /> : <LikeIcon />}
            {post.likes.length || ' '}
          </div>

          <div className={`action retweet ${retweeted ? 'active' : ''}`}>
            <RetweetIcon />
            {post.retweets.length || ' '}
          </div>

          <div className='action reply'>
            <ReplyIcon />
            {post.replies.length || ' '}
          </div>
        </footer>
      </div>
    </article>
  )
}

export default Post