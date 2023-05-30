import { Link } from 'react-router-dom'
import './Tabs.sass'

interface Tab {
  text: string
  link: string
  active: boolean
}

function Tabs({ tabs }: { tabs: Tab[] }) {
  return (
    <div className="Tabs" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
      {tabs.map((tab, id) => (
        <Tab key={id} tab={tab} />
      ))}
    </div>
  )
}

function Tab({ tab }: { tab: Tab }) {
  return (
    <Link to={tab.link} className={`Tab ${tab.active ? 'active' : ''}`}>
      <div className="text">{tab.text}</div>
    </Link>
  )
}

export default Tabs
