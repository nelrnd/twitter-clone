export type User = {
  id: string
  username: string
  name: string
  email: string
  bio: string
  profileURL: string | null
  headerURL: string | null
  following: string[]
  followers: []
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
}
