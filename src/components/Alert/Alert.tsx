import './Alert.sass'

type AlertProps = {
  text: string
}

const Alert: React.FC<AlertProps> = ({ text }) => {
  return text ? <div className="Alert">{text}</div> : null
}

export default Alert
