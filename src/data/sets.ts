import type { ImageKey } from './images'

export type SetItem = { name: string; my?: string; note: string; image?: ImageKey }

export type MenuSet = {
  id: string
  name: string
  /** name in Myanmar script */
  my?: string
  tagline: string
  badge: string
  venue: 'tidewater' | 'ember' | 'lantern' | 'pavilions'
  served: string
  serves: string
  /** default party size when reserving */
  party: number
  price: number
  per: 'set' | 'person'
  image: ImageKey
  courses: SetItem[]
  extra?: string
}

/** The Myanmar Mont tea stand — three tiers plus tea. Fictional demo menu. */
export const teaStand: { tier: string; label: string; items: SetItem[] }[] = [
  {
    tier: 'Top tier',
    label: 'Sweet & delicate',
    items: [
      { name: 'Mont Lone Yay Paw', my: 'မုန့်လုံးရေပေါ်', note: 'Glutinous rice balls hiding molten jaggery, rolled in fresh coconut. Traditionally shared at Thingyan.', image: 'sMontLoneYayPaw' },
      { name: 'Sanwin Makin', my: 'ဆနွင်းမကင်း', note: 'Baked semolina cake with coconut cream and butter, crowned with toasted poppy seeds.', image: 'sSanwinMakin' },
      { name: 'Shwe Yin Aye', my: 'ရွှေရင်အေး', note: 'Chilled coconut milk with agar jelly, sago and sticky rice — the “golden heart cooler”.', image: 'sShweYinAye' },
    ],
  },
  {
    tier: 'Middle tier',
    label: 'Warm from the griddle',
    items: [
      { name: 'Mont Lin Ma Yar', my: 'မုန့်လင်မယား', note: '“Husband-and-wife” rice-flour cups, pressed together in pairs, with quail egg and spring onion.', image: 'sMontLinMaYar' },
      { name: 'Mont Phat Htoke', my: 'မုန့်ဖက်ထုပ်', note: 'Sticky rice parcels steamed in banana leaf with coconut and palm sugar.', image: 'sMontPhatHtoke' },
    ],
  },
  {
    tier: 'Bottom tier',
    label: 'Savoury bites',
    items: [
      { name: 'Lahpet Thoke', my: 'လက်ဖက်သုပ်', note: 'A tasting spoon of fermented tea-leaf salad with crunchy beans and garlic.', image: 'mTeaLeafSalad' },
      { name: 'Nan Gyi Thoke', my: 'နန်းကြီးသုပ်', note: 'Thick rice noodles tossed with chicken curry, chickpea flour and lime — Mandalay style.', image: 'sNanGyiThoke' },
    ],
  },
  {
    tier: 'Served with',
    label: 'To drink',
    items: [{ name: 'Laphet Yay', my: 'လက်ဖက်ရည်', note: 'Strong Burmese milk tea, sweetened with condensed milk — choose “cho seint” or “kyauk padaung”.', image: 'sLaphetYay' }],
  },
]

export const menuSets: MenuSet[] = [
  {
    id: 'mont-tea',
    name: 'Myanmar Mont Tea Set',
    my: 'မြန်မာမုန့် သရေစာ Set',
    tagline: 'An afternoon tea stand of Myanmar’s beloved mont — sweet, warm and savoury — with strong laphet yay.',
    badge: 'Afternoon',
    venue: 'pavilions',
    served: 'Daily 14:30 – 17:30',
    serves: 'For two',
    party: 2,
    price: 48,
    per: 'set',
    image: 'sTeaStand',
    courses: teaStand.flatMap((t) => t.items),
    extra: 'Refillable laphet yay · add a glass of sparkling wine for $14',
  },
  {
    id: 'mohinga-sunrise',
    name: 'Mohinga Sunrise Breakfast',
    my: 'မုန့်ဟင်းခါး မနက်စာ',
    tagline: 'The nation’s breakfast, the way Ngwe Saung’s fishermen start the day.',
    badge: 'Breakfast',
    venue: 'tidewater',
    served: 'Daily 06:30 – 10:30',
    serves: 'Per person',
    party: 2,
    price: 26,
    per: 'person',
    image: 'mMohinga',
    courses: [
      { name: 'Mohinga', my: 'မုန့်ဟင်းခါး', note: 'Fish and lemongrass broth, rice noodles, banana stem, boiled egg.' },
      { name: 'E Kya Kway & Bayar Kyaw', my: 'အီကြာကွေး၊ ပဲကြော်', note: 'Crisp fritters for dipping.' },
      { name: 'Tropical fruit plate', note: 'Mango, papaya and dragon fruit from Pathein market.' },
      { name: 'Laphet Yay', my: 'လက်ဖက်ရည်', note: 'Burmese milk tea or fresh coffee.' },
    ],
  },
  {
    id: 'royal-feast',
    name: 'Royal Myanmar Feast',
    my: 'မြန်မာ ထမင်းဝိုင်း',
    tagline: 'A table crowded with curries, salads and condiments, shared the traditional way.',
    badge: 'Sharing',
    venue: 'tidewater',
    served: 'Dinner 18:30 – 22:00',
    serves: 'For two to four',
    party: 4,
    price: 92,
    per: 'set',
    image: 'sRoyalFeast',
    courses: [
      { name: 'Chicken & potato curry', my: 'ကြက်သားဟင်း', note: 'Slow-cooked with turmeric, paprika and shallot oil.' },
      { name: 'Ayeyarwady fish curry', my: 'ငါးဟင်း', note: 'River fish, tomato and lemongrass.' },
      { name: 'Pennywort salad', my: 'မြင်းခွာရွက်သုပ်', note: 'Fresh, bitter-bright and crunchy.' },
      { name: 'Gourd soup & balachaung', my: 'ဗူးသီးဟင်းချို၊ ဘာလချောင်', note: 'Clear soup and the famous crispy shrimp relish.' },
      { name: 'Steamed jasmine rice & halawa', note: 'Finished with Pathein halawa and green tea.' },
    ],
  },
  {
    id: 'seafood-tower',
    name: 'Ngwe Saung Seafood Tower',
    tagline: 'Two tiers of the morning’s catch on crushed ice, with three house sauces.',
    badge: 'For two',
    venue: 'ember',
    served: 'Lunch & dinner',
    serves: 'For two',
    party: 2,
    price: 148,
    per: 'set',
    image: 'sSeafoodTower',
    courses: [
      { name: 'Half lobster', note: 'Grilled over coconut husk with smoked butter.' },
      { name: 'Tiger prawns', note: 'Turmeric and garlic glaze.' },
      { name: 'Oysters & crab claws', note: 'Seasonal — lime, chilli and shallot mignonette.' },
      { name: 'Tuna crudo', note: 'Green mango and chilli oil.' },
    ],
    extra: 'Subject to the day’s catch',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour Sunset Set',
    tagline: 'Two signature cocktails and six canapés in the best seats for sunset.',
    badge: 'Sunset',
    venue: 'lantern',
    served: 'Daily 17:00 – 19:00',
    serves: 'For two',
    party: 2,
    price: 64,
    per: 'set',
    image: 'sCanapes',
    courses: [
      { name: 'Two signature cocktails', note: 'Silver Shore, Golden Hour or zero-proof alternatives.' },
      { name: 'Six chef’s canapés', note: 'Crab tartlets, tea-leaf crisps, prawn toasts and more.' },
      { name: 'Reserved sunset seats', note: 'Front-row on The Lantern Bar deck.' },
    ],
  },
  {
    id: 'tasting-journey',
    name: 'Chef’s Tasting Journey',
    tagline: 'Six courses tracing the coast from the dunes to the Ayeyarwady delta.',
    badge: 'Tasting',
    venue: 'tidewater',
    served: 'Dinner from 19:00',
    serves: 'Per person',
    party: 2,
    price: 120,
    per: 'person',
    image: 'sTasting',
    courses: [
      { name: 'Amuse-bouche', note: 'Tea-leaf and peanut crisp.' },
      { name: 'Tuna crudo', note: 'Green mango, chilli oil.' },
      { name: 'Mohinga consommé', note: 'Clarified broth, river fish.' },
      { name: 'Ngwe Saung lobster', note: 'Smoked butter, sea herbs.' },
      { name: 'Duck & tamarind', note: 'Sticky rice cake.' },
      { name: 'Coconut & palm sugar', note: 'Parfait, lime.' },
    ],
    extra: 'Wine pairing +$65 per person',
  },
  {
    id: 'garden-set',
    name: 'Garden Plant-Based Set',
    tagline: 'Three vegan courses from our kitchen garden — light, bright and generous.',
    badge: 'Vegan',
    venue: 'tidewater',
    served: 'Lunch & dinner',
    serves: 'Per person',
    party: 2,
    price: 42,
    per: 'person',
    image: 'sGardenBowl',
    courses: [
      { name: 'Garden rolls', note: 'Herbs, tamarind dip.' },
      { name: 'Jackfruit rendang', note: 'Coconut, kaffir lime, roti.' },
      { name: 'Tropical fruit & coconut sorbet', note: 'From the morning market.' },
    ],
  },
  {
    id: 'little-explorers',
    name: 'Little Explorers Set',
    tagline: 'A three-part adventure plate for guests aged 3 – 11, with a juice and a scoop.',
    badge: 'Kids',
    venue: 'ember',
    served: 'All day',
    serves: 'Per child',
    party: 3,
    price: 18,
    per: 'person',
    image: 'sKidsPlate',
    courses: [
      { name: 'Mini Shan noodles or fish fingers', note: 'Mild and kid-sized.' },
      { name: 'Veggie sticks & fruit', note: 'With a yoghurt dip.' },
      { name: 'Fresh juice & ice cream', note: 'Coconut, mango or chocolate.' },
    ],
  },
]

export const getSet = (id: string) => menuSets.find((s) => s.id === id)
