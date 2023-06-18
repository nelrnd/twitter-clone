import { useNavigate, useOutletContext } from "react-router-dom"
import { Tweet, User } from "../types"
import Modal from "../components/Modals/Modal"
import ModalHeader from "../components/Modals/ModalHeader"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { CollectionReference, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import Loader from "../components/Loader/Loader"
import ProfileCard from "../components/Profile/ProfileCard"

const Likes: React.FC = () => {
  const [tweet]: [tweet: Tweet] = useOutletContext()
  const [likes, likesLoading] = useCollectionData(query(collection(db, 'tweets', tweet.id, 'likes')))
  const [users, usersLoading] = useCollectionData(likes?.length ? query(collection(db, 'users') as CollectionReference<User>, where('id', 'in', likes.map((i) => i.userId))) : null)
  const navigate = useNavigate()

  const goBack = () => navigate('../')

  return (
    <Modal onClick={goBack} width={600} height={650}>
      <ModalHeader onClick={goBack}>
        <h2>Likes</h2>
      </ModalHeader>

      {(likesLoading || usersLoading) && <Loader />}

      <div>
        {users?.map((user) => <ProfileCard key={user.id} user={user} showBio={true} showFollow={true} /> )}
      </div>
    </Modal>
  )
}

export default Likes