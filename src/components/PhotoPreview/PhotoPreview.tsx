import './PhotoPreview.sass'

type PhotoPreviewProps = {
  src: string
  children?: string | JSX.Element | JSX.Element[]
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({src, children}) => {
  return (
    <div className="PhotoPreview">
      {children}
      <img src={src} />
    </div>
  )
}

export default PhotoPreview