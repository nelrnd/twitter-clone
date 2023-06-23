export type User = {
  id: string
  username: string
  name: string
  email: string
  bio: string
  profileURL: string | null
  headerURL: string | null
  following: string[]
  followers: string[]
  tweetsCount: number,
  likesCount: number,
  joinedAt: number
}

export type Tweet = {
  id: string
  content: string[]
  media: string[]
  userId: string
  timestamp: number
  likesCount: number
  retweetsCount: number
  repliesCount: number
  inReplyTo: {tweetId: string, userId: string} | null
}

export type Notification = {
  from: string
  type: string
  tweetId: string | null
  timestamp: number
  read: boolean
}