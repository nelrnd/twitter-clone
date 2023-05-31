import Sidebar from '../Sidebar/Sidebar'
import './LayoutWithSidebar.sass'

function LayoutWithSidebar({ children }: { children: string | JSX.Element | JSX.Element[] }) {
  return (
    <div className="LayoutWithSidebar">
      <Sidebar />

      <div className="right">{children}</div>
    </div>
  )
}

export default LayoutWithSidebar
