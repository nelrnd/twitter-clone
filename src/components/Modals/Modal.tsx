import IconButton from '../Buttons/IconButton'
import CloseIcon from '../../assets/close.svg'
import './Modal.sass'

type ModalProps = {
  children: JSX.Element | JSX.Element[]
  show: boolean
  setShow: (show: boolean) => void
  showCloseBtn: boolean
  width: number
}

const Modal: React.FC<ModalProps> = ({ children, show, setShow, showCloseBtn, width }) => {
  const close = () => setShow(false)

  if (!show) return null

  return (
    <div className="Modal_wrapper">
      <div className="Modal" style={{ width: width + 'px' }}>
        {showCloseBtn && (
          <IconButton onClick={close} type="close">
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </div>
      <div className="Modal_backdrop" onClick={close} />
    </div>
  )
}

export default Modal
