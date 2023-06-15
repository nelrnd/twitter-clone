import Sidebar from '../Sidebar/Sidebar'
import './Layout.sass'

type LayoutProps = {
  children: string | JSX.Element | JSX.Element[]
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className="Layout">
      <Sidebar />
      <div className="right-part">
        {children}
      </div>
    </div>
  )
}

export default Layout