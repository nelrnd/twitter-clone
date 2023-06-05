import TwitterIconSVG from '../../assets/icon.svg'
import './JoinLayout.sass'

type JoinLayoutProps = {
  children: boolean | string | JSX.Element | (boolean | string | JSX.Element)[]
  paddingSize: string
}

const JoinLayout: React.FC<JoinLayoutProps> = ({ children, paddingSize }) => {
  return (
    <div className="JoinLayout_wrapper">
      <div className={`JoinLayout padding-${paddingSize}`}>{children}</div>
    </div>
  )
}

const TwitterIcon: React.FC = () => {
  return (
    <div className="TwitterIcon">
      <TwitterIconSVG />
    </div>
  )
}

export default JoinLayout
export { TwitterIcon }
