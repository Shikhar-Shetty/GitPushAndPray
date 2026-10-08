import EmergencyContacts from '../emergency/EmergencyContacts'
import type { EmergencyContact } from '../../types/flood'

interface HeaderProps {
  lastUpdated: string
  contacts: EmergencyContact[]
}

function Header({ lastUpdated, contacts }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">FI</span>
        <div>
          <p className="brand-name">Flood Intelligence</p>
          <p className="brand-context">Coastal response dashboard</p>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-status">
          <span className="status-dot" aria-hidden="true" />
          <span>Live monitoring</span>
          <span className="header-divider" aria-hidden="true" />
          <span>Updated {lastUpdated}</span>
        </div>
        <EmergencyContacts contacts={contacts} />
      </div>
    </header>
  )
}

export default Header