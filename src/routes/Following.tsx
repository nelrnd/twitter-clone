import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { User } from "../types"
import PageHeader from "../components/PageHeader/PageHeader"
import Tabs from "../components/Tabs/Tabs"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { CollectionReference, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import Loader from "../components/Loader/Loader"
import ProfileCard from "../components/Profile/ProfileCard"

const Following: React.FC = () => {
  const { username } = useParams<'username'>()
  const [user]: [user: User] = useOutletContext()
  const navigate = useNavigate()

  const [users, loading] = useCollectionData(user.following.length ? query(collection(db, 'users') as CollectionReference<User>, where('id', 'in', user.following)) : null)

  const tabs = [
    { text: 'Followers', link: `/${username}/followers`, active: false },
    { text: 'Following', link: `/${username}/following`, active: true },
  ]

  return user ? (
    <main>
      <PageHeader onClick={() => navigate('../')}>
        <h2 className="heading-2">{user.name}</h2>
        <div className="grey small">@{user.username}</div>
      </PageHeader>

      <Tabs tabs={tabs} />

      <div>
        {loading && <Loader />}

        {users?.map((user) => <ProfileCard key={user.id} user={user} showBio={true} showFollow={true} />)}
      </div>
    </main>
  ) : <Navigate to={'/' + username} />
}

export default Following