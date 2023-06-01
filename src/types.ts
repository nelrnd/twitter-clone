export type TweetRef = {
  tweetId: string
} & ({ createdAt: number; retweetedAt?: never } | { createdAt?: never; retweetedAt: number })

export type User = {
  id: string
  username: string
  name: string
  email: string
  profileURL: string | null
  headerURL: string | null
  tweets: TweetRef[]
  retweets: TweetRef[]
  likes: string[]
  following: string[]
  followers: string[]
  createdAt: number
}

export type Tweet = {
  id: string
  text: string[]
  likes: string[]
  retweets: string[]
  replies: string[]
  createdBy: string
  createdAt: number
}
