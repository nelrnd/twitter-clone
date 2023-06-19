/*
interface PageHeaderProps {
  children: string | JSX.Element | JSX.Element[]
}

function PageHeader({ children }: PageHeaderProps) {
  return <header className="PageHeader">{children}</header>
}

export default PageHeader


*/
import IconButton from '../Buttons/IconButton'
import GoBackIcon from '../../assets/back.svg'
import './PageHeader.sass'

type PageHeaderProps = {
  children?: string | JSX.Element | JSX.Element[]
  onClick?: () => void
}

const PageHeader: React.FC<PageHeaderProps> = ({children, onClick}) => {
  return (
    <header className="PageHeader">
      {onClick && (
        <IconButton onClick={onClick}>
          <GoBackIcon />
        </IconButton>
      )}
      <div className="content">
        {children}
      </div>
    </header>
  )
}

export default PageHeader