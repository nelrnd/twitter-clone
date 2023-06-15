import { ChangeEvent, forwardRef, useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Link } from 'react-router-dom'
import { createTweet } from '../../firebase'
import { getTextFromHTML } from '../../utils'
import Avatar from '../Avatar/Avatar'
import Button from '../Buttons/Button'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import './TweetComposer.sass'

import MediaIcon from '../../assets/media.svg'
import IconButton from '../Buttons/IconButton'
import CloseIcon from '../../assets/close.svg' 
import Alert from '../Alert/Alert'
/*
const MAX_LENGTH = 280

const TweetComposer: React.FC = () => {
  const user = useContext(UserContext)
  const [text, setText] = useState('')
  const elem = useRef<HTMLDivElement>(null)
  const html = useRef('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    html.current = e.target.value
    const text = elem.current?.textContent || ''
    setText(text)
  }

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files.length)
  }

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
          <ContentEditable innerRef={elem} html={html.current} onChange={handleChange} />
        </div>
        <div className="bottom-bar">
          <div>
            <label htmlFor="upload-media">IMAGE</label>
            <input type="file" id="upload-media" accept="image/*" multiple={true} onChange={handleMediaChange} />
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
*/
const MAX_LENGTH = 280

const TweetComposer: React.FC = () => {
  const user = useContext(UserContext)

  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const textInput = useRef<HTMLDivElement>(null)
  const mediaInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState({text: ''})

  useEffect(() => {
    let timeoutId: number | null = null
    if (error) {
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
    if (!text || text.length > MAX_LENGTH) return
    const formattedText = getTextFromHTML(textInput.current?.innerHTML || '')
    setText('')
    if (textInput.current) textInput.current.innerHTML = ''
    if (mediaInput.current) mediaInput.current.value = ''
    createTweet(formattedText, files, user?.id)
  }

  const probar_dim = text.length < MAX_LENGTH - 20 ? 22 : 32
  const probar_text = text.length >= MAX_LENGTH - 20 ? (MAX_LENGTH - text.length).toString() : ''
  const probar_style = text.length >= MAX_LENGTH ? 'error' : text.length >= MAX_LENGTH - 20 ? 'warning' : ''

  return user ? (
    <div className="TweetComposer">
      <div className="left-col">
        <Link to={'/' + user.username}>
          <Avatar src={user.profileURL} />
        </Link>
      </div>
      <div className="right-col">
        <div className="text-input-wrapper">
          {!text && <div className="text-input-placeholder">What is happening?!</div>}
          <div className="text-input" contentEditable={true} onInput={handleTextChange} />
        </div>
        {files.length > 0 && (
          <div className={`photo-previews ${files.length > 1 ? `layout-${files.length}` : ''}`}>
            {files.map((file, id) => (
              <PhotoPreview key={'photo-preview-' + id} src={URL.createObjectURL(file)} onClick={() => removeMedia(id)} />
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
            <Button style="primary" onClick={tweet} disabled={!text || text.length > MAX_LENGTH}>
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

type PhotoPreviewProps = {
  src: string
  onClick: () => void
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({src, onClick}) => {
  return (
    <div className="PhotoPreview">
      <IconButton onClick={onClick} style='dark small'>
        <CloseIcon />
      </IconButton>
      <img src={src} />
    </div>
  )
}

export default TweetComposer
