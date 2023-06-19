import { ChangeEvent, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Link, useLocation } from 'react-router-dom'
import { createTweet } from '../../firebase'
import { getTextFromHTML } from '../../utils'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import IconButton from '../Buttons/IconButton'
import Alert from '../Alert/Alert'
import MediaIcon from '../../assets/media.svg'
import CloseIcon from '../../assets/close.svg' 
import 'react-circular-progressbar/dist/styles.css'
import './TweetComposer.sass'
import PhotoPreview from '../PhotoPreview/PhotoPreview'

const MAX_LENGTH = 280

type TweetComposerProps = {
  onTweet?: () => void
}

const TweetComposer: React.FC<TweetComposerProps> = ({onTweet}) => {
  const user = useContext(UserContext)
  const location = useLocation()
  const state = location.state

  const inReplyTo = state?.tweet && state?.user ? {
    tweetId: state.tweet.id,
    userId: state.user.id
  } : null

  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const textInput = useRef<HTMLDivElement>(null)
  const mediaInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState({text: ''})

  useEffect(() => {
    let timeoutId: number | null = null
    if (error.text) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => setError({ text: '' }), 4000)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [error])

  const handleTextChange = (e: ChangeEvent<HTMLDivElement>) => setText(e.target.textContent || '')

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files
    if (newFiles && newFiles.length) {
      if ([...newFiles, ...files].length > 4) {
        setError({text: 'Please choose up to 4 photos.'})
      } else {
        setFiles([...files, ...newFiles])
      }
    }
    if (mediaInput.current) {
      mediaInput.current.files = null
    }
  }

  const removeMedia = (id: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(id, 1)
    setFiles(updatedFiles)
  }

  const tweet = () => {
    if ((!text || text.length > MAX_LENGTH) && !files.length) return
    const formattedText = getTextFromHTML(textInput.current?.innerHTML || '')
    setText('')
    const filesCopy = files
    setFiles([])
    if (textInput.current) textInput.current.innerHTML = ''
    if (mediaInput.current) mediaInput.current.value = ''
    createTweet(formattedText, filesCopy, user?.id, inReplyTo)
    if (onTweet) {
      onTweet()
    }
  }

  const probar_dim = text.length < MAX_LENGTH - 20 ? 22 : 32
  const probar_text = text.length >= MAX_LENGTH - 20 ? (MAX_LENGTH - text.length).toString() : ''
  const probar_style = text.length >= MAX_LENGTH ? 'error' : text.length >= MAX_LENGTH - 20 ? 'warning' : ''

  return user ? (
    <div className="TweetComposer">
      <div className="left-col">
        <Link to={'/' + user.username}>
          <Avatar src={user.profileURL} size={40} />
        </Link>
      </div>
      <div className="right-col">
        <div className="text-input-wrapper">
          {!text && <div className="text-input-placeholder">What is happening?!</div>}
          <div className="text-input" contentEditable={true} onInput={handleTextChange} ref={textInput} />
        </div>
        {files.length > 0 && (
          <div className={`photo-previews ${files.length > 1 ? `layout-${files.length}` : ''}`}>
            {files.map((file, id) => (
              <PhotoPreview key={'photo-preview-' + id} src={URL.createObjectURL(file)}>
                <IconButton onClick={() => removeMedia(id)} style='dark small'>
                  <CloseIcon />
                </IconButton>
              </PhotoPreview>
            ))}
          </div>
        )}
        <div className="bottom-bar">
          <div className="left-part">
            <MediaInput ref={mediaInput} onChange={handleMediaChange} disabled={files.length >= 4} multiple={files.length < 3} />
          </div>
          <div className="right-part">
            <div className="progress-bar-wrapper">
              <div style={{ width: probar_dim + 'px', height: probar_dim + 'px' }}>
                {text.length > 0 && (
                  <CircularProgressbar 
                    value={text.length} 
                    maxValue={MAX_LENGTH} 
                    text={probar_text} 
                    className={probar_style} 
                    strokeWidth={(2 * 100) / probar_dim} 
                    styles={buildStyles({ pathTransitionDuration: 0 })}
                  />
                )}
              </div>
            </div>
            <Button style="primary" onClick={tweet} disabled={(!text || text.length > MAX_LENGTH) && !files.length}>
              Tweet
            </Button>
          </div>
        </div>
      </div>

      <Alert text={error.text} />
    </div>
  ) : null
}

type MediaInputProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  multiple: boolean
}

const MediaInput = forwardRef<HTMLInputElement, MediaInputProps>(({onChange, disabled, multiple}, ref) => {
  return (
    <label htmlFor="media" className={`MediaInput ${disabled ? 'disabled' : ''}`}>
      <MediaIcon />
      <input type="file" id="media" accept="image/*" multiple={multiple} style={{ display: 'none' }} ref={ref} onChange={onChange} disabled={disabled} />
    </label>
  )
})

export default TweetComposer
