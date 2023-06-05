import defaultProfile from '../../assets/default_profile.png'
import './Avatar.sass'

type AvatarProps = {
  src?: string
  size?: number
  onClick?: () => unknown
}

const Avatar: React.FC<AvatarProps> = ({ src, size = 48, onClick }) => (
  <div className={`Avatar ${size}`} onClick={onClick} style={{ width: size + 'px', height: size + 'px' }}>
    <img src={src || defaultProfile} referrerPolicy="no-referrer" alt="avatar" />
  </div>
)

export default Avatar
