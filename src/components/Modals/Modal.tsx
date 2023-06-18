import './Modal.sass'

type ModalProps = {
  children: string | JSX.Element | (JSX.Element|boolean)[]
  onClick: () => void
  width: number
  height: number
  className?: string
}

const Modal: React.FC<ModalProps> = ({children, onClick, width, height, className}) => {
  return (
    <div className="Modal_wrapper">
      <div className={`Modal ${className || ''}`} style={{width: width + 'px', height: height + 'px'}}>
        {children}
      </div>
      <div className="Modal_backdrop" onClick={onClick}/>
    </div>
  )
}

export default Modal
