import './Buttons.sass'

type IconButtonProps = {
  children: JSX.Element
  onClick?: () => void
  style?: string
  type?: string
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, style, type }) => {
  return (
    <button className={`IconButton ${style || ''} ${type || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton
