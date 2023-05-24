export function createPostId(): string {
  const postId = Date.now().toString().slice(-10) + Math.random().toString().slice(-10)
  return postId.length === 20 ? postId : createPostId()
}
