import type { EmergencyContact } from '../../types/flood'

interface EmergencyContactsProps {
  contacts: EmergencyContact[]
}

function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  return (
    <section className="panel contacts-panel" aria-labelledby="contacts-heading">
      <div className="panel-heading">
        <div>
          <h2 id="contacts-heading">Emergency contacts</h2>
          <p>Verified India emergency numbers</p>
        </div>
      </div>
      <div className="card-body contacts-list">
        {contacts.map((contact) => (
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
        <p className="briefing-note">Numbers are provided for quick reference. Service integration is not connected.</p>
      </div>
    </section>
  )
}

export default EmergencyContacts
