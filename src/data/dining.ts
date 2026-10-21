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
  { category: 'Starters', name: 'Tea-Leaf Salad, Reimagined', description: 'Fermented laphet, crisp beans, toasted sesame, heirloom tomato, lime.', price: 16, tags: ['VG', 'Signature'] },
  { category: 'Starters', name: 'Tuna Crudo', description: 'Line-caught tuna, green mango, chilli oil, puffed rice.', price: 22, tags: ['GF'] },
  { category: 'Starters', name: 'Pomelo & Prawn', description: 'Charred prawns, pomelo, mint, roasted peanut dressing.', price: 19, tags: ['GF'] },
  { category: 'Starters', name: 'Garden Rolls', description: 'Rice paper, herbs from our garden, tamarind dip.', price: 14, tags: ['VG'] },

  { category: 'Seafood', name: 'Ngwe Saung Lobster', description: 'Half lobster, smoked butter, lemongrass, sea herbs.', price: 68, tags: ['GF', 'Signature'] },
  { category: 'Seafood', name: 'Salt-Baked Sea Bass', description: 'Whole fish baked in sea salt and banana leaf, carved tableside.', price: 54, tags: ['GF'] },
  { category: 'Seafood', name: 'Tiger Prawns on Coals', description: 'Garlic, chilli and turmeric glaze, grilled lime.', price: 42, tags: ['Spicy'] },
  { category: 'Seafood', name: 'Crab Curry', description: 'Mud crab, coconut, curry leaf, steamed jasmine rice.', price: 46, tags: ['Spicy'] },

  { category: 'Signature Mains', name: 'Wagyu Striploin', description: 'Smoked over coconut husk, shallot jam, pepper jus.', price: 72 },
  { category: 'Signature Mains', name: 'Duck & Tamarind', description: 'Slow-roasted duck breast, tamarind glaze, sticky rice cake.', price: 44 },
  { category: 'Signature Mains', name: 'Jackfruit Rendang', description: 'Young jackfruit, coconut, kaffir lime, roti.', price: 28, tags: ['VG'] },

  { category: 'Myanmar-Inspired', name: 'Mohinga at Dawn', description: 'The nation’s breakfast: fish broth, rice noodles, banana stem, crisp fritters.', price: 18, tags: ['Signature'] },
  { category: 'Myanmar-Inspired', name: 'Ayeyarwady Fish Curry', description: 'River fish, tomato, turmeric, fried shallot, balachaung.', price: 32, tags: ['Spicy', 'GF'] },
  { category: 'Myanmar-Inspired', name: 'Shan Noodles', description: 'Sticky rice noodles, tomato-chicken sauce, pickled mustard greens.', price: 22 },
  { category: 'Myanmar-Inspired', name: 'Pathein Halawa Plate', description: 'Our version of the regional sweet, with coconut cream.', price: 12, tags: ['V'] },

  { category: 'International', name: 'Lobster Linguine', description: 'Bisque, cherry tomato, basil, chilli.', price: 48 },
  { category: 'International', name: 'Wood-Fired Margherita', description: 'San Marzano tomato, buffalo mozzarella, basil.', price: 24, tags: ['V'] },
  { category: 'International', name: 'Grilled Salmon', description: 'Herb crust, crushed potatoes, beurre blanc.', price: 38, tags: ['GF'] },

  { category: 'Desserts', name: 'Coconut & Palm Sugar Parfait', description: 'Toasted coconut, palm sugar caramel, lime.', price: 14, tags: ['V', 'Signature'] },
  { category: 'Desserts', name: 'Dark Chocolate Sphere', description: 'Single-origin chocolate, passion fruit, warm sauce poured at the table.', price: 16, tags: ['V'] },
  { category: 'Desserts', name: 'Tropical Fruit Plate', description: 'The morning’s best from the market.', price: 11, tags: ['VG', 'GF'] },

  { category: 'Cocktails', name: 'Silver Shore', description: 'Gin, lemongrass, cucumber, tonic, edible silver.', price: 18, tags: ['Signature'] },
  { category: 'Cocktails', name: 'Golden Hour', description: 'Aged rum, palm sugar, passion fruit, smoked salt.', price: 19 },
  { category: 'Cocktails', name: 'Bay of Bengal Spritz', description: 'Aperitivo, pomelo, sparkling wine.', price: 17 },
  { category: 'Cocktails', name: 'Lantern Old Fashioned', description: 'Bourbon, jaggery, cacao bitters.', price: 20 },

  { category: 'Zero-Proof', name: 'Thanaka Cooler', description: 'Cucumber, lime, mint, sparkling water.', price: 9, tags: ['VG'] },
  { category: 'Zero-Proof', name: 'Young Coconut', description: 'Served in the shell, straight from the palm.', price: 7, tags: ['VG'] },
  { category: 'Zero-Proof', name: 'Hibiscus Iced Tea', description: 'Roselle, ginger, honey.', price: 8 },
]

export const diningImages: ImageKey[] = ['chefPlating', 'freshSeafood', 'salmon', 'saladBowl', 'noodleBowl', 'steak', 'dishPlatter']
