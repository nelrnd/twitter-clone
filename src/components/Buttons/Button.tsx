import './Buttons.sass'

interface ButtonProps {
  children: string | JSX.Element | JSX.Element[]
  type?: string
  size?: string
  disabled?: boolean
  handleClick: () => unknown | void
}

function Button({ children, type = 'dark', size = 'medium', handleClick, disabled }: ButtonProps) {
  return (
    <button className={`Button ${type} ${size}`} onClick={handleClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
