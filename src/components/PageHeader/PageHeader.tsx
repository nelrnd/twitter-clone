import './PageHeader.sass'

interface PageHeaderProps {
  children: string | JSX.Element | JSX.Element[]
}

function PageHeader({ children }: PageHeaderProps) {
  return <header className="PageHeader">{children}</header>
}

export default PageHeader
