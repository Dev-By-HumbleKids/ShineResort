import type { ImageKey } from './images'

export type Facility = {
  id: string
  name: string
  kicker: string
  description: string
  details: string[]
  hours: string
  image: ImageKey
  cta: { label: string; to: string }
}

export const facilities: Facility[] = [
  {
    id: 'pool',
    name: 'The Long Pool',
    kicker: 'Infinity Pool',
    description: 'Forty-eight metres of water that seem to pour straight into the bay. Shaded cabanas, a swim-up ledge and poolside service from The Lantern Bar.',
    details: ['48 m infinity edge', 'Twelve shaded cabanas', 'Poolside lounge service', 'Separate family pool'],
    hours: '07:00 – 21:00',
    image: 'cliffPool',
    cta: { label: 'Reserve a cabana', to: '/book' },
  },
  {
    id: 'beach',
    name: 'Private Beach',
    kicker: 'The Shore',
    description: 'Six hundred metres of pale sand reserved for SHINE guests, with thatched cabanas, deep loungers and a beach butler who appears with chilled towels.',
    details: ['Lifeguard 08:00 – 18:00', 'Cabanas & daybeds', 'Beach butler service', 'Sunset fire pit'],
    hours: 'Sunrise – sunset',
    image: 'beachLoungers',
    cta: { label: 'Explore beach experiences', to: '/experiences?c=beach' },
  },
  {
    id: 'restaurant',
    name: 'Tidewater',
    kicker: 'Oceanfront Restaurant',
    description: 'Modern coastal cooking with Myanmar soul, served on a timber terrace above the dunes.',
    details: ['Daily catch menu', 'Myanmar-inspired tasting menu', 'Sommelier selection', 'Sunset seating'],
    hours: '06:30 – 22:30',
    image: 'restaurantTerrace',
    cta: { label: 'Explore the menu', to: '/dining' },
  },
  {
    id: 'bar',
    name: 'The Lantern Bar',
    kicker: 'Beach Bar',
    description: 'Signature cocktails built on tropical fruit and Myanmar botanicals, with the best sunset seats on the coast.',
    details: ['Signature cocktails', 'Zero-proof menu', 'Acoustic sets on weekends', 'Bar snacks till late'],
    hours: '15:00 – 00:00',
    image: 'cocktailPour',
    cta: { label: 'See cocktails', to: '/dining?menu=Cocktails#menu' },
  },
  {
    id: 'spa',
    name: 'Lumina Spa',
    kicker: 'Spa & Wellness',
    description: 'Six treatment pavilions in a garden of ginger and frangipani, with rituals rooted in Myanmar tradition.',
    details: ['Six treatment pavilions', 'Couples’ suite', 'Steam & cold plunge', 'Thanaka rituals'],
    hours: '09:00 – 20:00',
    image: 'spaStones',
    cta: { label: 'Book a treatment', to: '/wellness' },
  },
  {
    id: 'fitness',
    name: 'Fitness & Recreation',
    kicker: 'Move',
    description: 'An ocean-view fitness studio, a yoga deck at the water’s edge and a calendar of guided activities.',
    details: ['24-hour fitness studio', 'Sunrise yoga deck', 'Personal training', 'Beach volleyball & bikes'],
    hours: 'Studio 24 h',
    image: 'gym',
    cta: { label: 'View wellness', to: '/wellness' },
  },
  {
    id: 'private-dining',
    name: 'Private Dining',
    kicker: 'Moments for two',
    description: 'Lantern-lit pavilions and candlelit tables on the sand for proposals, anniversaries and simply because.',
    details: ['Beach tables for two', 'Garden pavilions', 'Bespoke menus', 'Live musicians'],
    hours: 'By reservation',
    image: 'celebrationTable',
    cta: { label: 'Plan a dinner', to: '/experiences/beach-dinner' },
  },
  {
    id: 'concierge',
    name: 'Concierge',
    kicker: 'At your service',
    description: 'From airport transfers to a surprise proposal on a sandbank, our concierge team plans every detail of your escape.',
    details: ['Trip & activity planning', 'Transfers from Yangon & Pathein', 'Celebration arrangements', 'Local guides'],
    hours: '24 hours',
    image: 'lobbyLounge',
    cta: { label: 'Design a custom escape', to: '/experiences/custom-escape' },
  },
]
