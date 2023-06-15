import { Link } from 'react-router-dom'
import './Tabs.sass'

type Tab = {
  text: string
  link: string
  active: boolean
}

type TabsProps = {
  tabs: Tab[]
}

const Tabs: React.FC<TabsProps> = ({tabs}) => (
  <div className="Tabs">
    {tabs.map((tab) => (
      <Link to={tab.link} className={`tab ${tab.active ? 'active' : ''}`}>
        <div className="text">{tab.text}</div>
      </Link>
    ))}
  </div>
)

export default Tabs