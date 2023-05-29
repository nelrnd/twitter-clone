import { useState, useRef } from 'react'
import { User } from 'firebase/auth'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import './PostForm.sass'
import { createPost } from '../../firebase'

interface PostFormProps {
  user: User
}

function PostForm({ user }: PostFormProps) {
  const [text, setText] = useState('')
  const elem = useRef<HTMLDivElement>(null)

  const handleInput = () => setText((elem.current && elem.current.textContent) || '')
  const handlePost = () => {
    if (!text || !elem.current) return
    const postText = elem.current.innerHTML
      .toString()
      .replaceAll('<br>', '')
      .replaceAll('</div>', '')
      .split('<div>')
      .filter((line) => line !== '')
    setText('')
    elem.current.innerHTML = ''
    createPost(postText, user.uid)
  }

  return (
    <div className="PostForm">
      <Avatar profileURL={user.photoURL} />

      <div>
        <div className="input">
          <div className="placeholder">{text ? '' : 'What is happening?!'}</div>
          <div contentEditable="true" ref={elem} onInput={handleInput}></div>
        </div>
        <div className="bottom-bar">
          <Button handleClick={handlePost} type="primary" disabled={!text}>
            Tweet
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PostForm

/*

function PostForm({ userId }: { userId: string }) {
  const [text, setText] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text) return
    const textCopy = text
    setText('')
    createPost(textCopy, userId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={handleChange}></textarea>
      <button>Post</button>
    </form>
  )
}

*/
