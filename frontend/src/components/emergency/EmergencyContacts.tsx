import { useState } from 'react'
import { indiaEmergencyContacts } from '../../data/emergencyContacts'

function EmergencyContacts() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`contacts-widget${isOpen ? ' contacts-widget--open' : ''}`}>
      <button
        className="contacts-trigger"
        type="button"
        aria-expanded={isOpen}
        aria-controls="emergency-contacts-popover"
        aria-label="Show emergency contacts"
        title="Emergency contacts"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">☎</span>
      </button>
      <section className="contacts-popover" id="emergency-contacts-popover" aria-labelledby="contacts-heading">
        <div className="contacts-popover-heading">
          <div>
            <h2 id="contacts-heading">Emergency contacts</h2>
            <p>Verified India emergency numbers</p>
          </div>
          <span aria-hidden="true">☎</span>
        </div>
        <div className="contacts-list">
          {indiaEmergencyContacts.map((contact) => (
            <div className="contact-item" key={contact.id}>
              <div>
                <strong>{contact.name}</strong>
                <span>{contact.description}</span>
              </div>
              <a className="contact-phone" href={`tel:${contact.phone}`} aria-label={`Call ${contact.name} at ${contact.phone}`}>
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
        <p className="briefing-note">Tap a number to call from a supported device.</p>
      </section>
    </div>
  )
}

export default EmergencyContacts
