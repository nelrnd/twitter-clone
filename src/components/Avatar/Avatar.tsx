import defaultProfile from '../../assets/default_profile.png'
import './Avatar.sass'

type AvatarProps = {
  src?: string | null
  size: number
  onClick?: () => unknown
  blank?: boolean
}

const Avatar: React.FC<AvatarProps> = ({ src, size, onClick, blank }) => (
  <div className={`Avatar ${size}`} onClick={onClick} style={{ width: size + 'px', height: size + 'px' }}>
    {!blank && <img src={src || defaultProfile} referrerPolicy="no-referrer" alt="avatar" />}
  </div>
)

export default Avatar
