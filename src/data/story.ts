import type { ImageKey } from './images'

/** The SHINE origin story is entirely fictional. */
export const timeline: { year: string; title: string; text: string; image: ImageKey }[] = [
  {
    year: '1968',
    title: 'A lamp on the shore',
    text: 'Daw Khin Shwe, a fisherman’s daughter, keeps a kerosene lamp burning on the dunes each night so the village boats can find their way home. The fishermen call it “the shine”.',
    image: 'beachDawn',
  },
  {
    year: '1996',
    title: 'Twelve bamboo bungalows',
    text: 'Her son, U Aung Min, opens twelve simple bungalows on the same stretch of sand. Guests come for the quiet and stay for his mother’s fish curry.',
    image: 'thatchVillas',
  },
  {
    year: '2014',
    title: 'A new vision',
    text: 'Granddaughter Mya Shwe, an architect trained in Singapore, returns home with a plan: a resort that feels like it grew from the coast rather than landed on it.',
    image: 'resortCourtyard',
  },
  {
    year: '2019',
    title: 'SHINE opens',
    text: 'Fifty-one villas, suites and pavilions open among the palms, built from reclaimed teak, local laterite stone and lime plaster. The original lamp hangs in the reception pavilion.',
    image: 'resortEvening',
  },
  {
    year: 'Today',
    title: 'Still guiding guests home',
    text: 'Three generations on, the family still welcomes every guest — and a lantern is still lit on the dunes at dusk.',
    image: 'palmsPoolDusk',
  },
]

export const values: { title: string; text: string }[] = [
  { title: 'Rooted in place', text: 'Local stone, reclaimed teak, village craftspeople and a menu that follows the tide.' },
  { title: 'Quiet luxury', text: 'Space, privacy and time — the true luxuries — over anything that glitters.' },
  { title: 'Gentle on the coast', text: 'Solar-heated water, refill stations instead of plastic bottles, and dune planting each monsoon.' },
  { title: 'Warmth before ceremony', text: 'Service that remembers your name and how you take your tea.' },
]

export const architecture: { title: string; caption: string; image: ImageKey }[] = [
  { title: 'The Lamp Pavilion', caption: 'A sculptural reception roof of layered teak shingles, open on all sides to the sea breeze.', image: 'resortLodge' },
  { title: 'The Long Pool', caption: 'A 48-metre infinity edge aligned precisely with the western horizon.', image: 'cliffPool' },
  { title: 'Courtyard Villas', caption: 'Walled gardens and deep overhangs bring daylight in and keep heat out.', image: 'resortCourtyard' },
  { title: 'Shaded Walkways', caption: 'Raised boardwalks thread through frangipani, allowing the dunes to breathe beneath.', image: 'resortPoolPalms' },
  { title: 'Night Lantern Lighting', caption: 'Warm, low lighting protects the night sky and the nesting shoreline.', image: 'resortNight' },
  { title: 'Material Palette', caption: 'Laterite stone, lime plaster, teak and woven rattan — all sourced within Myanmar.', image: 'resortDeck' },
]

export const reviews: { quote: string; name: string; from: string }[] = [
  { quote: 'The quietest, most beautiful week of our lives. The sunrise from the pavilion deck is something we still talk about.', name: 'Sample guest review', from: 'Honeymoon · Singapore' },
  { quote: 'Our kids rode horses on the beach at dawn and swam off a boat at an empty island. The staff made everything effortless.', name: 'Sample guest review', from: 'Family stay · Yangon' },
  { quote: 'Tidewater’s mohinga at breakfast is worth the trip on its own.', name: 'Sample guest review', from: 'Couple · London' },
]
