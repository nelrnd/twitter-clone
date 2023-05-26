import defaultProfile from '../../assets/default_profile.png'
import './Avatar.sass'

function Avatar({profileURL, size = 'm', handleClick}: {profileURL?: string | null, size?: string, handleClick?: () => void}) {
  return (
    <div className={`Avatar ${size}`} onClick={handleClick} style={{backgroundImage: `url(${profileURL || defaultProfile})`}}></div>
  )
}

export default Avatar