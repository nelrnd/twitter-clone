import './Buttons.sass'

type IconButtonProps = {
  children: JSX.Element
  onClick: () => void
  type?: string
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick, type }) => {
  return (
    <button className={`IconButton ${type || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton
