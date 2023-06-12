import { useContext, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'
import { createTweet } from '../../firebase'
import { getTextFromHTML } from '../../utils'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './TweetComposer.sass'

const MAX_LENGTH = 280

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
    createTweet(tweetText, [], user?.id)
  }

  return user ? (
    <div className="TweetComposer">
      <div>
        <Link to={`/${user.username}`}>
          <Avatar src={user.profileURL} />
        </Link>
      </div>

      <div className="main">
        <div className="input">
          <div className="placeholder">{text ? '' : 'What is happening?!'}</div>
          <div contentEditable={true} ref={elem} onInput={handleInput}></div>
        </div>
        <div className="bottom-bar">
          <div>
            <p>Image</p>
          </div>
          <div>
            <div className="progressbar_wrapper">
              {!!text.length && (
                <div style={{ width: text.length < MAX_LENGTH - 20 ? '22px' : '32px', height: text.length < MAX_LENGTH - 20 ? '22px' : '32px' }}>
                  <CircularProgressbar
                    value={text.length}
                    maxValue={MAX_LENGTH}
                    text={text.length >= MAX_LENGTH - 20 ? (MAX_LENGTH - text.length).toString() : ''}
                    strokeWidth={text.length < MAX_LENGTH - 20 ? 9 : 6.25}
                    styles={buildStyles({ pathTransitionDuration: 0, pathColor: text.length < MAX_LENGTH - 20 ? '#1D9BF0' : text.length < MAX_LENGTH ? '#FDD71F' : '#F4212E', trailColor: '#EFF3F4', textColor: text.length < MAX_LENGTH ? '#536471' : '#F4212E', textSize: '40px' })}
                  />
                </div>
              )}
            </div>
            <Button onClick={tweet} style="primary" disabled={!text || text.length > MAX_LENGTH}>
              Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default TweetComposer
