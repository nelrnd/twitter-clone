import { CollectionReference, collection, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { Post as PostInter } from '../../types'
import Post from '../Post/Post'

interface FeedProps {
  general?: boolean
  postIds?: string[]
}

function Feed({ general, postIds }: FeedProps) {
  const postsRef = collection(db, 'posts') as CollectionReference<PostInter>

  const ordering = orderBy('createdAt', 'desc')

  const postsQuery = general ? query(postsRef, ordering) : postIds?.length ? query(postsRef, where('id', 'in', postIds), ordering) : null
  const [posts, loading] = useCollectionData(postsQuery)

  if (loading) return <p>Loading...</p>

  return (
    <div>
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}

export default Feed
