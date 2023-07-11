import { User } from '../../types'
import './UserName.sass'

type UserNameProps = {
  user: User
  dir?: 'hor' | 'ver'
}

const UserName: React.FC<UserNameProps> = ({ user, dir = 'ver' }) => {
  return (
    <div className={`UserName ${dir}`}>
      <span className='name'>{user.name}</span>
      <span className='username'>@{user.username}</span>
    </div>
  )
}

export default UserName