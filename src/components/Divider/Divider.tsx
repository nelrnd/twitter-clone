import './Divider.sass'

type DividerProps = {
  text?: string
}

const Divider: React.FC<DividerProps> = ({ text = 'or' }) => {
  return (
    <div className="Divider">
      <div className="Divider_text">{text}</div>
    </div>
  )
}

export default Divider
