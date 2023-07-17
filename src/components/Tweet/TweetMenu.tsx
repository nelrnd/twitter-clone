import DotsIcon from '../../assets/dots.svg'
import DeleteIcon from '../../assets/delete.svg'
import IconButton from '../Buttons/IconButton'
import { useState } from 'react'
import './TweetMenu.sass'
import { deleteTweet } from '../../firebase'

type TweetMenuProps = {
  tweetId: string
}

const TweetMenu: React.FC<TweetMenuProps> = ({ tweetId }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='TweetMenu'>
      <IconButton onClick={() => setOpen(true)}>
        <DotsIcon />
      </IconButton>
      {open ? <Popup tweetId={tweetId} setOpen={setOpen} /> : null}
    </div>
  )
}

type PopupProps = {
  tweetId: string
  setOpen: (open: boolean) => void
}

const Popup: React.FC<PopupProps> = ({ tweetId, setOpen }) => {
  const handleDelete = (tweetId: string) => {
    deleteTweet(tweetId)
    setOpen(false)
  }

  return (
    <div className='Popup'>
      <ul>
        <li className='danger' onClick={() => handleDelete(tweetId)}>
          <DeleteIcon />
          <span className='text'>Delete</span>
        </li>
      </ul>
      <Backdrop handleClick={() => setOpen(false)} />
    </div>
  )
}

type BackdropProps = {
  handleClick: () => void
}

const Backdrop: React.FC<BackdropProps> = ({ handleClick }) => (
  <div className='Backdrop' onClick={handleClick} />
)

export default TweetMenu