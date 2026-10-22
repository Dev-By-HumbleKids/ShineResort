import type { ImageKey } from './images'

export type AvailabilityStatus = 'available' | 'limited' | 'sold-out' | 'request'

export type VillaModel = {
  /** footprint in scene units */
  width: number
  depth: number
  storeys: 1 | 2
  roof: 'hip' | 'flat' | 'pavilion'
  pool: boolean
  stilts: boolean
  bedrooms: number
}

export type Room = {
  id: string
  name: string
  tagline: string
  description: string[]
  nightlyRate: number
  maxGuests: number
  maxAdults: number
  sizeSqm: number
  beds: string
  view: 'Ocean' | 'Garden' | 'Ocean & Pool' | 'Beachfront' | 'Sunrise Ocean'
  inventory: number
  requiresRequest?: boolean
  highlights: string[]
  amenities: string[]
  images: ImageKey[]
  model: VillaModel
  hotspots: { id: string; label: string; detail: string; image: ImageKey; position: [number, number, number] }[]
}

export type ExperienceCategory = 'ocean' | 'beach' | 'romance' | 'wellness' | 'charter'

export type ExperiencePackage = { id: string; name: string; price: number; per: 'person' | 'group'; note?: string }
export type AddOn = { id: string; name: string; price: number; per: 'person' | 'booking' }

export type Experience = {
  id: string
  title: string
  category: ExperienceCategory[]
  summary: string
  description: string
  duration: string
  minGuests: number
  maxGuests: number
  minAge?: number
  times: string[]
  packages: ExperiencePackage[]
  addOns: AddOn[]
  includes: string[]
  safety: string[]
  conditionNote: string
  confirmation: 'instant' | 'concierge'
  image: ImageKey
  gallery?: ImageKey[]
}

export type MenuCategory =
  | 'Starters'
  | 'Seafood'
  | 'Signature Mains'
  | 'Myanmar-Inspired'
  | 'International'
  | 'Desserts'
  | 'Cocktails'
  | 'Zero-Proof'

export type MenuItem = {
  name: string
  description: string
  price: number
  category: MenuCategory
  image: ImageKey
  tags?: ('V' | 'VG' | 'GF' | 'Spicy' | 'Signature')[]
  /** suggested drink or dish pairing */
  pairing?: string
  /** chef's note shown in the quick view */
  story?: string
}

export type Treatment = {
  id: string
  name: string
  kind: string
  duration: number
  price: number
  description: string
  forTwo?: boolean
}

export type Package = {
  id: string
  name: string
  forWho: string
  nights: number
  price: number
  roomId: string
  includes: string[]
  excludes: string[]
  conditions: string
  image: ImageKey
}
