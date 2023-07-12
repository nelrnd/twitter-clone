import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { CollectionReference, collection, query, where } from "firebase/firestore"
import { db } from "../firebase"
import { User } from "../types"
import { Main, Side } from "../components/Layout/Layout"
import PageHeader from "../components/PageHeader/PageHeader"
import Tabs from "../components/Tabs/Tabs"
import Loader from "../components/Loader/Loader"
import ProfileCard from "../components/Profile/ProfileCard"

const Followers: React.FC = () => {
  const { username } = useParams<'username'>()
  const {user}: {user: User} = useOutletContext()
  const navigate = useNavigate()

  const [users, loading] = useCollectionData(user.followers.length ? query(collection(db, 'users') as CollectionReference<User>, where('id', 'in', user.followers)) : null)

  const tabs = [
    { text: 'Followers', link: `/${username}/followers`, active: true },
    { text: 'Following', link: `/${username}/following`, active: false },
  ]

  return user ? (
    <>
      <Main>
        <PageHeader onClick={() => navigate('../')}>
          <h2 className="heading-2">{user.name}</h2>
          <div className="grey small">@{user.username}</div>
        </PageHeader>
        <Tabs tabs={tabs} />
        <div>
          {loading && <Loader />}
          {users?.map((user) => <ProfileCard key={user.id} user={user} showBio={true} showFollow={true} />)}
        </div>
      </Main>

      <Side />
    </>
  ) : <Navigate to={'/' + username} />
}

export default Followers