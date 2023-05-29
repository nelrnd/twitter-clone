import './Buttons.sass'

interface ButtonProps {
  children: string | JSX.Element | JSX.Element[]
  type?: string
  size?: string
  handleClick: () => unknown | void
}

function Button({ children, type = 'dark', size = 'medium', handleClick }: ButtonProps) {
  return (
    <button className={`Button ${type} ${size}`} onClick={handleClick}>
      {children}
    </button>
  )
}

export default Button
