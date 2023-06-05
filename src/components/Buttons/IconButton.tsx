import './Buttons.sass'

type IconButtonProps = {
  children: JSX.Element
  onClick: () => void
}

const IconButton: React.FC<IconButtonProps> = ({ children, onClick }) => {
  return (
    <button className="IconButton" onClick={onClick}>
      {children}
    </button>
  )
}

export default IconButton
