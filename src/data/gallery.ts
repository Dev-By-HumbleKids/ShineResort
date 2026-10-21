import type { ImageKey } from './images'

export type GalleryItem = { image: ImageKey; alt: string; category: string; shape: 'tall' | 'wide' | 'square' }

export const galleryCategories = ['All', 'Resort', 'Villas', 'Dining', 'Wellness', 'Adventures', 'Sunsets'] as const

export const gallery: GalleryItem[] = [
  { image: 'heroSunsetPool', alt: 'Infinity pool framed by palms at golden hour', category: 'Resort', shape: 'wide' },
  { image: 'modernPoolVilla', alt: 'Private pool villa with limestone terrace', category: 'Villas', shape: 'tall' },
  { image: 'horseBeach', alt: 'Horse standing on the sand near the shore', category: 'Adventures', shape: 'square' },
  { image: 'restaurantTerrace', alt: 'Open-air restaurant terrace overlooking the sea', category: 'Dining', shape: 'square' },
  { image: 'beachSunset', alt: 'Sun setting over a calm beach', category: 'Sunsets', shape: 'tall' },
  { image: 'spaMassage', alt: 'Massage treatment in a calm spa room', category: 'Wellness', shape: 'wide' },
  { image: 'longtailBoats', alt: 'Traditional longtail boats moored by an island', category: 'Adventures', shape: 'wide' },
  { image: 'roomOceanCurtains', alt: 'Bedroom with linen curtains opening to the ocean', category: 'Villas', shape: 'square' },
  { image: 'resortEvening', alt: 'Resort pool glowing at dusk', category: 'Resort', shape: 'tall' },
  { image: 'chefPlating', alt: 'Chef plating a dish', category: 'Dining', shape: 'square' },
  { image: 'overwaterBungalows', alt: 'Pavilions on stilts above a turquoise lagoon', category: 'Villas', shape: 'wide' },
  { image: 'sunsetBoat', alt: 'Boat silhouetted against a golden sunset', category: 'Sunsets', shape: 'square' },
  { image: 'yogaSunrise', alt: 'Yoga practice on a deck at sunrise', category: 'Wellness', shape: 'tall' },
  { image: 'diver', alt: 'Snorkeller exploring underwater', category: 'Adventures', shape: 'square' },
  { image: 'resortCourtyard', alt: 'Tropical courtyard garden with pool', category: 'Resort', shape: 'square' },
  { image: 'cocktailPour', alt: 'Bartender pouring a cocktail', category: 'Dining', shape: 'tall' },
  { image: 'yacht', alt: 'Private yacht cruising on blue water', category: 'Adventures', shape: 'wide' },
  { image: 'palmsPoolDusk', alt: 'Palm trees reflected in a pool at dusk', category: 'Sunsets', shape: 'square' },
  { image: 'spaStones', alt: 'Spa towels, oils and orchids', category: 'Wellness', shape: 'square' },
  { image: 'thatchVillas', alt: 'Thatched villas surrounded by palms', category: 'Villas', shape: 'tall' },
  { image: 'resortNight', alt: 'Resort architecture lit at night', category: 'Resort', shape: 'wide' },
]
