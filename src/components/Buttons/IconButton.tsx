import './Buttons.sass'

interface IconButtonProps {
  children: JSX.Element
  handleClick: () => unknown
}

function IconButton({ children, handleClick }: IconButtonProps) {
  return (
    <button className="IconButton" onClick={handleClick}>
      {children}
    </button>
  )
}

export default IconButton
