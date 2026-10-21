import type { Treatment } from './types'

/** Lumina Spa — fictional treatment menu. */
export const treatments: Treatment[] = [
  {
    id: 'shine-signature',
    name: 'The SHINE Signature',
    kind: 'Signature massage',
    duration: 90,
    price: 165,
    description: 'Long, flowing strokes with warm coconut oil infused with lemongrass, finishing with a scalp ritual.',
  },
  {
    id: 'thanaka-ritual',
    name: 'Thanaka Glow Ritual',
    kind: 'Body treatment',
    duration: 75,
    price: 140,
    description: 'A cooling thanaka and rice-powder polish inspired by Myanmar tradition, followed by a jasmine body balm.',
  },
  {
    id: 'tide-for-two',
    name: 'Tide for Two',
    kind: 'Couples’ treatment',
    duration: 120,
    price: 380,
    forTwo: true,
    description: 'A floral bath, side-by-side massages and tea on a private terrace in our couples’ suite.',
  },
  {
    id: 'ocean-calm',
    name: 'Ocean Calm Ritual',
    kind: 'Relaxation ritual',
    duration: 60,
    price: 110,
    description: 'Warm stones, slow breathing and a gentle massage designed to quiet the mind.',
  },
  {
    id: 'pearl-facial',
    name: 'Pearl Radiance Facial',
    kind: 'Facial',
    duration: 60,
    price: 130,
    description: 'Marine botanicals and a lymphatic jade-roller massage for sun-tired skin.',
  },
  {
    id: 'three-day-reset',
    name: 'Three-Day Coastal Reset',
    kind: 'Wellness package',
    duration: 240,
    price: 520,
    description: 'Across three days: two massages, a facial, two private yoga sessions and a wellness consultation.',
  },
]

export const spaTimes = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']
