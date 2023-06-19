import CloseIcon from '../../assets/close.svg'
import IconButton from '../Buttons/IconButton'
import './ModalHeader.sass'

type ModalHeaderProps = {
  children?: string | JSX.Element | JSX.Element[]
  onClick?: () => void
}

const ModalHeader: React.FC<ModalHeaderProps> = ({children, onClick}) => (
  <header className="ModalHeader">
    {onClick && (
      <IconButton onClick={onClick}>
        <CloseIcon />
      </IconButton>
    )}
    {children && (
      <div className="content">
        {children}
      </div>
    )}
  </header>
)

export default ModalHeader