import { Link } from "react-router-dom"
import './Banner.sass'

type BannerProps = {
  src?: string | null
  href?: string
}

const Banner: React.FC<BannerProps> = ({src, href}) => {
  const elem = <div className="Banner">{src && <img src={src} />}</div>
  return href ? <Link to={href}>{elem}</Link> : elem
}

export default Banner