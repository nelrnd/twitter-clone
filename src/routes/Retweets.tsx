import { useNavigate, useOutletContext } from "react-router-dom"
import { Tweet, User } from "../types"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { CollectionReference, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import Modal from "../components/Modals/Modal"
import ModalHeader from "../components/Modals/ModalHeader"
import Loader from "../components/Loader/Loader"
import ProfileCard from "../components/Profile/ProfileCard"

const Retweets: React.FC = () => {
  const [tweet]: [tweet: Tweet] = useOutletContext()
  const [retweets, retweetsLoading] = useCollectionData(query(collection(db, 'tweets', tweet.id, 'retweets')))
  const [users, usersLoading] = useCollectionData(retweets?.length ? query(collection(db, 'users') as CollectionReference<User>, where('id', 'in', retweets.map((i) => i.userId))) : null)
  const navigate = useNavigate()

  const goBack = () => navigate('../')

  return (
    <Modal onClick={goBack} width={600} height={650}>
      <ModalHeader onClick={goBack}>
        <h2>Retweets</h2>
      </ModalHeader>

      {(retweetsLoading || usersLoading) && <Loader />}

      <div>
        {users?.map((user) => <ProfileCard key={user.id} user={user} showBio={true} showFollow={true} /> )}
      </div>
    </Modal>
  )
}

export default Retweets