import type { ImageKey } from './images'
import type { MenuCategory, MenuItem } from './types'

export const venues: { id: string; name: string; kind: string; hours: string; description: string; image: ImageKey }[] = [
  {
    id: 'tidewater',
    name: 'Tidewater',
    kind: 'Oceanfront Fine Dining',
    hours: 'Breakfast 06:30 – 10:30 · Dinner 18:30 – 22:30',
    description:
      'Our signature restaurant sits on a timber terrace above the dunes. Chef Thida Win’s menu follows the boats in the morning and the markets of Pathein in the afternoon — modern coastal cooking with Myanmar soul.',
    image: 'restaurantTerrace',
  },
  {
    id: 'ember',
    name: 'Ember Beach Grill',
    kind: 'Barefoot Grill',
    hours: 'Lunch 12:00 – 16:00 · Dinner 18:00 – 22:00',
    description: 'Charcoal-grilled seafood, wood-fired flatbreads and cold drinks with your toes in the sand.',
    image: 'grillPlatter',
  },
  {
    id: 'lantern',
    name: 'The Lantern Bar',
    kind: 'Sunset Beach Bar',
    hours: 'Daily 15:00 – 00:00',
    description:
      'Signature cocktails built on tropical fruit, palm sugar and Myanmar botanicals. Arrive early: the best seats face due west.',
    image: 'cocktailPour',
  },
  {
    id: 'pavilions',
    name: 'Private Pavilions',
    kind: 'Private Dining',
    hours: 'By reservation',
    description: 'Lantern-lit pavilions in the garden and on the sand for tables of two to twelve.',
    image: 'celebrationTable',
  },
]

export const menuCategories: MenuCategory[] = [
  'Starters',
  'Seafood',
  'Signature Mains',
  'Myanmar-Inspired',
  'International',
  'Desserts',
  'Cocktails',
  'Zero-Proof',
]

/** Fictional demonstration menu. Prices in USD. */
export const menu: MenuItem[] = [
  { category: 'Starters', name: 'Tea-Leaf Salad, Reimagined', image: 'mTeaLeafSalad', description: 'Fermented laphet, crisp beans, toasted sesame, heirloom tomato, lime.', price: 16, tags: ['VG', 'Signature'], pairing: 'Thanaka Cooler', story: 'Laphet is Myanmar’s beloved fermented tea leaf. We dress it at the table so the beans stay crunchy.' },
  { category: 'Starters', name: 'Tuna Crudo', image: 'mCrudo', description: 'Line-caught tuna, green mango, chilli oil, puffed rice.', price: 22, tags: ['GF'], pairing: 'Silver Shore', story: 'Cut minutes before serving from fish landed at the village jetty that morning.' },
  { category: 'Starters', name: 'Pomelo & Prawn', image: 'mPomeloPrawn', description: 'Charred prawns, pomelo, mint, roasted peanut dressing.', price: 19, tags: ['GF'], pairing: 'Bay of Bengal Spritz' },
  { category: 'Starters', name: 'Garden Rolls', image: 'mRolls', description: 'Rice paper, herbs from our garden, tamarind dip.', price: 14, tags: ['VG'], pairing: 'Hibiscus Iced Tea' },

  { category: 'Seafood', name: 'Ngwe Saung Lobster', image: 'mLobster', description: 'Half lobster, smoked butter, lemongrass, sea herbs.', price: 68, tags: ['GF', 'Signature'], pairing: 'A glass of Chablis', story: 'Our most requested dish — finished over coconut-husk embers for a gentle smokiness.' },
  { category: 'Seafood', name: 'Salt-Baked Sea Bass', image: 'mSeaBass', description: 'Whole fish baked in sea salt and banana leaf, carved tableside.', price: 54, tags: ['GF'], pairing: 'Bay of Bengal Spritz', story: 'The salt crust is cracked open at your table, releasing the aroma of banana leaf and lime.' },
  { category: 'Seafood', name: 'Tiger Prawns on Coals', image: 'mTigerPrawns', description: 'Garlic, chilli and turmeric glaze, grilled lime.', price: 42, tags: ['Spicy'], pairing: 'Golden Hour' },
  { category: 'Seafood', name: 'Crab Curry', image: 'mCrabCurry', description: 'Mud crab, coconut, curry leaf, steamed jasmine rice.', price: 46, tags: ['Spicy'], pairing: 'Lemongrass Lime Soda' },

  { category: 'Signature Mains', name: 'Wagyu Striploin', image: 'mWagyu', description: 'Smoked over coconut husk, shallot jam, pepper jus.', price: 72, pairing: 'Lantern Old Fashioned' },
  { category: 'Signature Mains', name: 'Duck & Tamarind', image: 'mDuck', description: 'Slow-roasted duck breast, tamarind glaze, sticky rice cake.', price: 44, pairing: 'A glass of Pinot Noir' },
  { category: 'Signature Mains', name: 'Jackfruit Rendang', image: 'mRendang', description: 'Young jackfruit, coconut, kaffir lime, roti.', price: 28, tags: ['VG'], pairing: 'Hibiscus Iced Tea' },

  { category: 'Myanmar-Inspired', name: 'Mohinga at Dawn', image: 'mMohinga', description: 'The nation’s breakfast: fish broth, rice noodles, banana stem, crisp fritters.', price: 18, tags: ['Signature'], pairing: 'Myanmar hill tea', story: 'Daw Khin Shwe’s 1968 recipe, served every morning at Tidewater from 06:30.' },
  { category: 'Myanmar-Inspired', name: 'Ayeyarwady Fish Curry', image: 'mFishCurry', description: 'River fish, tomato, turmeric, fried shallot, balachaung.', price: 32, tags: ['Spicy', 'GF'], pairing: 'Lemongrass Lime Soda' },
  { category: 'Myanmar-Inspired', name: 'Shan Noodles', image: 'mShanNoodles', description: 'Sticky rice noodles, tomato-chicken sauce, pickled mustard greens.', price: 22, pairing: 'Thanaka Cooler' },
  { category: 'Myanmar-Inspired', name: 'Pathein Halawa Plate', image: 'mHalawa', description: 'Our version of the regional sweet, with coconut cream.', price: 12, tags: ['V'], pairing: 'Myanmar hill tea', story: 'A nod to nearby Pathein, famous for its rich, buttery halawa.' },

  { category: 'International', name: 'Lobster Linguine', image: 'mLinguine', description: 'Bisque, cherry tomato, basil, chilli.', price: 48, pairing: 'A glass of Vermentino' },
  { category: 'International', name: 'Wood-Fired Margherita', image: 'mPizza', description: 'San Marzano tomato, buffalo mozzarella, basil.', price: 24, tags: ['V'], pairing: 'Bay of Bengal Spritz' },
  { category: 'International', name: 'Grilled Salmon', image: 'mSalmon', description: 'Herb crust, crushed potatoes, beurre blanc.', price: 38, tags: ['GF'], pairing: 'A glass of Sauvignon Blanc' },

  { category: 'Desserts', name: 'Coconut & Palm Sugar Parfait', image: 'mParfait', description: 'Toasted coconut, palm sugar caramel, lime.', price: 14, tags: ['V', 'Signature'], pairing: 'Golden Hour', story: 'Palm sugar from Ayeyarwady toddy palms, caramelised slowly for a smoky sweetness.' },
  { category: 'Desserts', name: 'Dark Chocolate Sphere', image: 'mChocolate', description: 'Single-origin chocolate, passion fruit, warm sauce poured at the table.', price: 16, tags: ['V'], pairing: 'Lantern Old Fashioned' },
  { category: 'Desserts', name: 'Tropical Fruit Plate', image: 'mFruit', description: 'The morning’s best from the market.', price: 11, tags: ['VG', 'GF'], pairing: 'Lemongrass Lime Soda' },

  { category: 'Cocktails', name: 'Silver Shore', image: 'mSilverShore', description: 'Gin, lemongrass, cucumber, tonic, edible silver.', price: 18, tags: ['Signature'], pairing: 'Tuna Crudo', story: 'Our house signature — named for the silver sand that gives Ngwe Saung its name.' },
  { category: 'Cocktails', name: 'Golden Hour', image: 'mGoldenHour', description: 'Aged rum, palm sugar, passion fruit, smoked salt.', price: 19, pairing: 'Tiger Prawns on Coals' },
  { category: 'Cocktails', name: 'Bay of Bengal Spritz', image: 'mSpritz', description: 'Aperitivo, pomelo, sparkling wine.', price: 17, pairing: 'Pomelo & Prawn' },
  { category: 'Cocktails', name: 'Lantern Old Fashioned', image: 'mOldFashioned', description: 'Bourbon, jaggery, cacao bitters.', price: 20, pairing: 'Dark Chocolate Sphere' },

  { category: 'Zero-Proof', name: 'Thanaka Cooler', image: 'mCooler', description: 'Cucumber, lime, mint, sparkling water.', price: 9, tags: ['VG'], pairing: 'Tea-Leaf Salad, Reimagined' },
  { category: 'Zero-Proof', name: 'Lemongrass Lime Soda', image: 'mLimeSoda', description: 'Fresh lemongrass, lime, palm-sugar syrup, soda.', price: 8, tags: ['VG'], pairing: 'Crab Curry' },
  { category: 'Zero-Proof', name: 'Hibiscus Iced Tea', image: 'mHibiscus', description: 'Roselle, ginger, honey.', price: 8, pairing: 'Garden Rolls' },
]

export const diningImages: ImageKey[] = ['chefPlating', 'freshSeafood', 'salmon', 'saladBowl', 'noodleBowl', 'steak', 'dishPlatter']
