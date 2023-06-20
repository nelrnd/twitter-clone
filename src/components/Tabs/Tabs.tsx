import { Link } from 'react-router-dom'
import './Tabs.sass'

type Tab = {
  text: string
  link?: string
  onClick?: () => void
  active: boolean
}

type TabsProps = {
  tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = ({tabs}) => (
  <div className="Tabs">
    {tabs.map((tab) => tab.link ? (
      <Link key={tab.text} to={tab.link} className={`tab ${tab.active ? 'active' : ''}`}>
        <div className="text">{tab.text}</div>
      </Link>
    ) : (
      <div key={tab.text} onClick={tab.onClick} className={`tab ${tab.active ? 'active' : ''}`}>
        <div className="text">{tab.text}</div>
      </div>
    ))}
  </div>
)

export default Tabs