import './Buttons.sass'

type ButtonProps = {
  children: string | JSX.Element | (string | JSX.Element)[]
  style?: string
  size?: string
  disabled?: boolean
  onClick?: () => unknown
}

const Button: React.FC<ButtonProps> = ({ children, style = 'dark', size = 'medium', onClick, disabled = false }) => {
  const className = `Button ${style} ${size}`

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
