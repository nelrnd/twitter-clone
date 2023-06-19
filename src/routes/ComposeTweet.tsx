import { useLocation, useNavigate } from "react-router-dom"
import Modal from "../components/Modals/Modal"
import TweetComposer from "../components/TweetComposer/TweetComposer"
import ModalHeader from "../components/Modals/ModalHeader"
import ReplyTweet from "../components/Tweet/ReplyTweet"

const ComposeTweet: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation.pathname)
    } else {
      navigate('/home')
    }
  }

  return (
    <Modal width={600} onClick={goBack} className="ComposeTweet">
      <ModalHeader onClick={goBack} />
      <ReplyTweet />
      <TweetComposer onTweet={goBack} />
    </Modal>
  )
}

export default ComposeTweet