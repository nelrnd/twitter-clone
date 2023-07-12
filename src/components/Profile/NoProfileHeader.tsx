import { useParams } from "react-router-dom"
import Avatar from "../Avatar/Avatar"
import Banner from "./Banner"
import './ProfileHeader.sass'

const NoProfileHeader: React.FC = () => {
  const { username } = useParams<'username'>()

  return (
    <header className="ProfileHeader">
      <div className="avatar-header_wrapper">
        <Banner />
        <Avatar blank={true} size={132} />
      </div>
      <h2 className="heading-2" style={{marginTop: 80, marginLeft: 16}}>@{username}</h2>

      <div className="big-padding">
        <h1 className="heading-1">This account doesn't exists</h1>
        <p className="grey">Try searching for another.</p>
      </div>
    </header>
  )
}

export default NoProfileHeader