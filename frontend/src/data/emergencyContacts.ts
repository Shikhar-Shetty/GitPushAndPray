import type { EmergencyContact } from '../types/flood'

export const indiaEmergencyContacts = [
  {
    id: 'national-emergency',
    name: 'National emergency',
    phone: '112',
    description: 'Police, fire, ambulance, and disaster response',
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    phone: '108',
    description: 'Emergency medical services',
  },
  {
    id: 'police',
    name: 'Police',
    phone: '100',
    description: 'Police emergency assistance',
  },
  {
    id: 'fire-rescue',
    name: 'Fire and rescue',
    phone: '101',
    description: 'Fire and rescue services',
  },
  {
    id: 'disaster-management',
    name: 'Disaster management',
    phone: '1078',
    description: 'National disaster management helpline',
  },
] satisfies EmergencyContact[]