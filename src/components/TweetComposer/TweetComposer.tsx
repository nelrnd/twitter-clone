import { useContext, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'
import { createTweet } from '../../firebase'
import { getTextFromHTML } from '../../utils'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import './TweetComposer.sass'

const TweetComposer: React.FC = () => {
  const [text, setText] = useState('')
  const user = useContext(UserContext)
  const elem = useRef<HTMLDivElement>(null)

  const handleInput = () => setText(elem.current?.textContent || '')

  const tweet = () => {
    if (!text || !elem.current) return
    const tweetText = getTextFromHTML(elem.current.innerHTML)
    setText('')
    elem.current.innerHTML = ''
    createTweet(tweetText, user?.id)
  }

  return user ? (
    <div className="TweetComposer">
      <div>
        <Link to={`/${user.username}`}>
          <Avatar src={user.profileURL} />
        </Link>
      </div>

      <div>
        <div className="input">
          <div className="placeholder">{text ? '' : 'What is happening?!'}</div>
          <div contentEditable={true} ref={elem} onInput={handleInput}></div>
        </div>
        <div className="bottom-bar">
          <Button onClick={tweet} style="primary" disabled={!text}>
            Tweet
          </Button>
        </div>
      </div>
    </div>
  ) : null
}

export default TweetComposer
