export interface User {
  id: string
  username: string
  name: string
  email: string
  profileURL: string | null
  headerURL: string | null
  posts: string[]
  likedPosts: string[]
  retweetedPosts: string[]
  following: string[]
  followers: string[]
  createdAt: number
}