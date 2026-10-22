import type { ImageKey } from './images'

export type JourneyStep = { time: string; title: string; detail: string; image: ImageKey }

/* ------------------------------------------------------------------ */
/* Lumina Spa — what each treatment actually feels like, step by step  */
/* ------------------------------------------------------------------ */

export type SpaJourney = {
  cover: ImageKey
  gallery: ImageKey[]
  mood: string
  bestFor: string[]
  ingredients: string[]
  feel: string[]
  steps: JourneyStep[]
}

export const spaJourneys: Record<string, SpaJourney> = {
  'shine-signature': {
    cover: 'jBackMassage',
    gallery: ['jAroma', 'jOil', 'jCandle'],
    mood: 'Deeply restorative',
    bestFor: ['First visit to Lumina', 'Jet lag & travel tension', 'Light sleepers'],
    ingredients: ['Cold-pressed coconut oil', 'Lemongrass', 'Ginger', 'Jasmine'],
    feel: ['Shoulders that finally drop', 'A slow, heavy calm', 'Skin scented with lemongrass for hours'],
    steps: [
      { time: '10 min', title: 'Arrival foot ritual', detail: 'Warm water, river pebbles and lime — your therapist learns how you like your pressure.', image: 'jAroma' },
      { time: '5 min', title: 'Choose your oil', detail: 'Smell three blends and pick the one that feels right today.', image: 'jOil' },
      { time: '60 min', title: 'The SHINE massage', detail: 'Long, wave-like strokes from feet to shoulders, timed to your breathing.', image: 'jBackMassage' },
      { time: '10 min', title: 'Scalp & arm ritual', detail: 'Warm oil worked through the scalp, then the forearms and palms.', image: 'jArmMassage' },
      { time: '5 min', title: 'Ginger tea by candlelight', detail: 'Rest on the garden terrace for as long as you like.', image: 'jCandle' },
    ],
  },
  'thanaka-ritual': {
    cover: 'jScrubJars',
    gallery: ['jScrubJars', 'jSteam', 'jFlowers'],
    mood: 'Cooling & brightening',
    bestFor: ['After a day in the sun', 'Before a special evening', 'Dull or dry skin'],
    ingredients: ['Thanaka bark paste', 'Jasmine rice powder', 'Turmeric', 'Jasmine balm'],
    feel: ['A cool, tingling glow', 'Skin soft as silk', 'The scent of sandalwood-like thanaka'],
    steps: [
      { time: '10 min', title: 'Thanaka grinding', detail: 'Watch fresh thanaka ground on a kyauk pyin stone, just as in every Myanmar home.', image: 'jFlowers' },
      { time: '30 min', title: 'Rice & thanaka polish', detail: 'A gentle circular polish that lifts away sun-tired skin.', image: 'jScrubJars' },
      { time: '15 min', title: 'Warm rain shower', detail: 'Rinse under an open-air shower among the ginger flowers.', image: 'jSteam' },
      { time: '20 min', title: 'Jasmine body balm', detail: 'A slow application of whipped jasmine butter to seal in moisture.', image: 'jOil' },
    ],
  },
  'tide-for-two': {
    cover: 'jPetalBath',
    gallery: ['jPinkBath', 'jCandleBath', 'jSunsetChairs'],
    mood: 'Romantic & unhurried',
    bestFor: ['Honeymoons & anniversaries', 'Celebrating together', 'Couples who never get time to stop'],
    ingredients: ['Frangipani & rose petals', 'Coconut milk', 'Warm sesame oil', 'Champagne or hibiscus tea'],
    feel: ['Time that feels like it has stopped', 'Side-by-side calm', 'A shared memory to take home'],
    steps: [
      { time: '20 min', title: 'Floral milk bath', detail: 'A sunken tub filled with coconut milk and petals, lit only by candles.', image: 'jPinkBath' },
      { time: '60 min', title: 'Side-by-side massage', detail: 'Two therapists, one rhythm — in the couples’ suite open to the garden.', image: 'jBackMassage' },
      { time: '20 min', title: 'Private terrace', detail: 'Tea or a glass of champagne on your own terrace as the light turns gold.', image: 'jSunsetChairs' },
      { time: '20 min', title: 'Steam & rest', detail: 'An aromatic steam room reserved just for the two of you.', image: 'jCandleBath' },
    ],
  },
  'ocean-calm': {
    cover: 'jHotStoneFlowers',
    gallery: ['jHotStones', 'jCandle', 'jStones'],
    mood: 'Quiet & grounding',
    bestFor: ['Busy minds', 'Trouble switching off', 'Muscle stiffness'],
    ingredients: ['Warm basalt stones', 'Sea-salt compress', 'Vetiver', 'Lavender'],
    feel: ['Warmth sinking deep into the back', 'A slower heartbeat', 'Your thoughts finally going quiet'],
    steps: [
      { time: '5 min', title: 'Breathing by candlelight', detail: 'A guided breath to let the day fall away.', image: 'jCandle' },
      { time: '35 min', title: 'Warm stone massage', detail: 'Smooth heated stones glide along the spine and rest in the palms.', image: 'jHotStones' },
      { time: '15 min', title: 'Gentle release', detail: 'Soft, slow strokes for the neck, hands and feet.', image: 'jArmMassage' },
      { time: '5 min', title: 'Balance', detail: 'Wake slowly with chilled lemongrass water.', image: 'jStones' },
    ],
  },
  'pearl-facial': {
    cover: 'jFacial',
    gallery: ['jFacialMask', 'jFacialBrush', 'jFacialRoller'],
    mood: 'Fresh & luminous',
    bestFor: ['Sun-exposed skin', 'Before photos or a celebration', 'A quick, visible refresh'],
    ingredients: ['Seaweed & pearl powder', 'Aloe vera', 'Rice water toner', 'Jade roller'],
    feel: ['Cool and hydrated', 'Visibly brighter', 'Calm after the sun'],
    steps: [
      { time: '10 min', title: 'Double cleanse', detail: 'Coconut oil cleanse, then a gentle rice-water foam.', image: 'jFacialBrush' },
      { time: '20 min', title: 'Marine mask', detail: 'A cooling seaweed and pearl mask brushed on in layers.', image: 'jFacialMask' },
      { time: '20 min', title: 'Jade-roller massage', detail: 'Lymphatic massage to de-puff and lift.', image: 'jFacialRoller' },
      { time: '10 min', title: 'Glow finish', detail: 'Serum, SPF and a mirror moment.', image: 'jFacial' },
    ],
  },
  'three-day-reset': {
    cover: 'jYogaSilhouette',
    gallery: ['jYogaGroup', 'jBackMassage', 'jFacial'],
    mood: 'Transformative',
    bestFor: ['Burn-out & stress', 'A wellness-focused stay', 'Building a lasting routine'],
    ingredients: ['Wellness consultation', 'Two massages', 'One facial', 'Two private yoga sessions'],
    feel: ['Rested in a way one massage can’t give', 'A new morning routine', 'Lighter, clearer, calmer'],
    steps: [
      { time: 'Day 1', title: 'Consultation & SHINE massage', detail: 'Set your intentions with our wellness lead, then the signature massage.', image: 'jBackMassage' },
      { time: 'Day 2', title: 'Sunrise yoga & facial', detail: 'Private yoga on the deck, followed by the Pearl Radiance facial.', image: 'jYogaGroup' },
      { time: 'Day 3', title: 'Breath, stones & send-off', detail: 'Breathwork at dawn and a warm-stone massage — plus a routine to take home.', image: 'jHotStones' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Experiences — the day itself, plus imagery for each package         */
/* ------------------------------------------------------------------ */

export type ExperienceJourney = {
  highlights: { icon: 'swim' | 'camera' | 'sun' | 'food' | 'heart' | 'compass' | 'wave' | 'star'; text: string }[]
  steps: JourneyStep[]
  packages: Record<string, { image: ImageKey; perks: string[] }>
}

export const experienceJourneys: Record<string, ExperienceJourney> = {
  'island-excursion': {
    highlights: [
      { icon: 'swim', text: 'Swim in sheltered, clear coves' },
      { icon: 'food', text: 'Picnic lunch on a sandbar' },
      { icon: 'camera', text: 'Three islets in one day' },
      { icon: 'compass', text: 'Local captain & guide' },
    ],
    steps: [
      { time: '07:30', title: 'Board at the SHINE jetty', detail: 'Coffee, a safety briefing and the smell of the sea as the longtail starts up.', image: 'jLongtailBeach' },
      { time: '08:15', title: 'Pearl Cay', detail: 'Drop anchor in turquoise shallows for the first swim of the day.', image: 'jAerialBoat' },
      { time: '10:00', title: 'Moonstone Isle', detail: 'Masks on — explore the rocks and reef edges with your guide.', image: 'jAerialSnorkel' },
      { time: '12:00', title: 'Lunch on the Silver Sandbar', detail: 'A shaded picnic set up by the crew on a strip of white sand.', image: 'jPicnicTable' },
      { time: '13:30', title: 'Cruise home', detail: 'Feet up on the bow, salt in your hair.', image: 'jBoatBow' },
    ],
    packages: {
      shared: { image: 'jLongtailKarst', perks: ['Up to 8 guests', 'Meet fellow travellers', 'Best value'] },
      private: { image: 'jLongtailSilhouette', perks: ['Just your party', 'Flexible stops & timing', 'Champagne on request'] },
    },
  },
  'boat-charter': {
    highlights: [
      { icon: 'wave', text: 'Your own boat & crew' },
      { icon: 'swim', text: 'Swim stops where you choose' },
      { icon: 'food', text: 'Canapés & drinks on deck' },
      { icon: 'sun', text: 'Return at golden hour' },
    ],
    steps: [
      { time: 'Start', title: 'Welcome aboard', detail: 'Your captain plans the route around the weather and your wishes.', image: 'jBoatAshore' },
      { time: '+1 h', title: 'Swim stop', detail: 'Anchor in clear water — jump straight off the side.', image: 'jBoatBow' },
      { time: '+2 h', title: 'Drinks on deck', detail: 'Chilled drinks and canapés as the coastline slides past.', image: 'jToast' },
      { time: 'End', title: 'Golden-hour return', detail: 'Sail home with the sun low over the bay.', image: 'jSailDeck' },
    ],
    packages: {
      traditional: { image: 'jLongtailSilhouette', perks: ['Hand-built wooden boat', 'Cultural coastal ride', 'Up to 6 guests'] },
      leisure: { image: 'yacht', perks: ['Modern cruiser with shade', 'Swim ladder & snorkel gear', 'Up to 10 guests'] },
      celebration: { image: 'jChampagneBoat', perks: ['Music & decorations', 'Canapés included', 'Up to 12 guests'] },
    },
  },
  'horse-riding': {
    highlights: [
      { icon: 'sun', text: 'Sunrise or sunset light' },
      { icon: 'wave', text: 'Ride through the shallows' },
      { icon: 'heart', text: 'Gentle, well-cared-for horses' },
      { icon: 'camera', text: 'Unforgettable silhouettes' },
    ],
    steps: [
      { time: '0:00', title: 'Meet your horse', detail: 'Our guides match each rider to a calm, gentle horse.', image: 'jWhiteHorse' },
      { time: '0:10', title: 'Helmet & briefing', detail: 'Fitting, a short lesson and a walk along the dunes.', image: 'jRidersWhite' },
      { time: '0:25', title: 'Along the tide line', detail: 'Walk or trot along firm sand where the waves come in.', image: 'jRidersRainbow' },
      { time: '0:60', title: 'Golden-hour finale', detail: 'Pause for photos as the sun sinks behind you.', image: 'jRiderSilhouette' },
    ],
    packages: {
      guided: { image: 'jRidersWhite', perks: ['Perfect for beginners', 'Walk & gentle trot', '60 minutes'] },
      sunset: { image: 'jRiderSunset', perks: ['Timed to the sunset', 'Longer beach route', '90 minutes'] },
      couple: { image: 'jRidersRainbow', perks: ['Just the two of you', 'Private guide', 'Photo stop included'] },
    },
  },
  'sunset-cruise': {
    highlights: [
      { icon: 'sun', text: 'The best sunset seat on the coast' },
      { icon: 'food', text: 'Welcome drink & canapés' },
      { icon: 'camera', text: 'Golden-hour photos' },
      { icon: 'heart', text: 'Unhurried & romantic' },
    ],
    steps: [
      { time: '16:45', title: 'Set sail', detail: 'Leave the jetty as the heat of the day softens.', image: 'jSailGolden' },
      { time: '17:15', title: 'A toast on deck', detail: 'Chilled drinks and light bites as the sky starts to glow.', image: 'jToast' },
      { time: '17:45', title: 'Golden hour', detail: 'The whole bay turns copper — cameras out.', image: 'jSailDeck' },
      { time: '18:15', title: 'Sunset & return', detail: 'Watch the sun disappear, then glide home under the first stars.', image: 'jSailSunset' },
    ],
    packages: {
      shared: { image: 'jSailGolden', perks: ['Small group', 'Welcome drink', 'Great value'] },
      private: { image: 'jChampagneBoat', perks: ['Just the two of you', 'Front-of-boat seating', 'Add champagne'] },
    },
  },
  snorkeling: {
    highlights: [
      { icon: 'swim', text: 'Sheltered, guided snorkel spots' },
      { icon: 'compass', text: 'Marine guide in the water' },
      { icon: 'wave', text: 'Equipment & flotation provided' },
      { icon: 'star', text: 'Learn the reef’s story' },
    ],
    steps: [
      { time: '08:30', title: 'Briefing & fitting', detail: 'Masks, fins and a quick lesson on the beach.', image: 'jSnorkelMask' },
      { time: '09:00', title: 'Boat to the spot', detail: 'Your guide chooses the clearest, calmest location of the day.', image: 'jAerialSnorkel' },
      { time: '09:30', title: 'In the water', detail: 'Float above rocks and reef edges with your guide alongside.', image: 'jSnorkeler' },
      { time: '11:00', title: 'Refresh & return', detail: 'Fresh fruit and cold drinks on the ride home.', image: 'jBoatBow' },
    ],
    packages: {
      guided: { image: 'jSnorkeler', perks: ['Small group', 'All equipment', 'Beginner-friendly'] },
      private: { image: 'jFreedive', perks: ['Your own guide & boat', 'Choose the pace', 'Up to 4 guests'] },
    },
  },
  fishing: {
    highlights: [
      { icon: 'sun', text: 'Out on the water at dawn' },
      { icon: 'heart', text: 'Fish with local fishermen' },
      { icon: 'food', text: 'Your catch cooked for lunch' },
      { icon: 'compass', text: 'Traditional hand-line skills' },
    ],
    steps: [
      { time: '05:45', title: 'Leave before sunrise', detail: 'Coffee in hand as the village boats head out.', image: 'jBoatDawn' },
      { time: '06:30', title: 'Hand-line fishing', detail: 'Learn the technique from fishermen who’ve done it all their lives.', image: 'jFishingBoat' },
      { time: '07:30', title: 'Sunrise over the bay', detail: 'Seabirds, fishing boats and the sky turning orange.', image: 'jFishingDawn' },
      { time: '12:00', title: 'Catch & cook', detail: 'Tidewater’s chefs grill your catch for lunch.', image: 'grillPlatter' },
    ],
    packages: {
      dawn: { image: 'jFishingDawn', perks: ['Local fishing guide', 'Breakfast box', 'Optional catch & cook'] },
    },
  },
  'kayak-sup': {
    highlights: [
      { icon: 'wave', text: 'Calm, sheltered lagoon' },
      { icon: 'compass', text: 'Lesson for first-timers' },
      { icon: 'swim', text: 'Stop for a swim anytime' },
      { icon: 'heart', text: 'Lifeguard on the beach' },
    ],
    steps: [
      { time: '0:00', title: 'Choose your craft', detail: 'Single or double kayak, or a stand-up paddleboard.', image: 'jKayaks' },
      { time: '0:10', title: 'Quick lesson', detail: 'Balance and paddle tips on the sand.', image: 'jKayakWoman' },
      { time: '0:20', title: 'Glide the lagoon', detail: 'Clear, calm water and the palms on the shore.', image: 'jKayakAerial' },
    ],
    packages: {
      kayak: { image: 'jKayakAerial', perks: ['Single or double kayak', '1 hour', 'Life vest included'] },
      sup: { image: 'jKayakWoman', perks: ['Stand-up paddleboard', '90 minutes', 'Lesson included'] },
    },
  },
  'photo-session': {
    highlights: [
      { icon: 'camera', text: 'Professional photographer' },
      { icon: 'sun', text: 'Golden-hour light' },
      { icon: 'heart', text: 'Relaxed, unposed moments' },
      { icon: 'star', text: 'Gallery within 48 hours' },
    ],
    steps: [
      { time: 'Before', title: 'A quick chat', detail: 'Share your style and the moments you want to remember.', image: 'jCoupleHug' },
      { time: '0:00', title: 'Into the light', detail: 'Wander the beach at golden hour — no stiff poses.', image: 'jCoupleSilhouette' },
      { time: '0:45', title: 'In the water', detail: 'Splashes, laughter and the sea as your backdrop.', image: 'jCoupleWater' },
    ],
    packages: {
      mini: { image: 'jCoupleSilhouette', perks: ['30 minutes', '30 edited images', 'Online gallery'] },
      signature: { image: 'jCoupleWater', perks: ['75 minutes', '80 edited images', 'Two locations'] },
    },
  },
  'beach-dinner': {
    highlights: [
      { icon: 'heart', text: 'Your own table on the sand' },
      { icon: 'food', text: 'Five courses by Chef Thida' },
      { icon: 'star', text: 'Lanterns, candles & stars' },
      { icon: 'compass', text: 'Dedicated server' },
    ],
    steps: [
      { time: '18:30', title: 'Welcome cocktail', detail: 'Arrive to a lantern-lit path and a drink in hand.', image: 'jToast' },
      { time: '18:45', title: 'Your table at the water’s edge', detail: 'Candles, flowers and the sound of the surf.', image: 'jCandleTable' },
      { time: '19:00', title: 'Five courses', detail: 'From tuna crudo to lobster, paced to the evening.', image: 'mLobster' },
      { time: '21:00', title: 'Dessert under the stars', detail: 'Linger as long as you like.', image: 'jLongTable' },
    ],
    packages: {
      classic: { image: 'jCandleTable', perks: ['Five-course menu', 'Welcome cocktail', 'Lantern canopy'] },
      lobster: { image: 'mLobster', perks: ['Lobster main course', 'Bottle of champagne', 'Floral styling'] },
    },
  },
  celebrations: {
    highlights: [
      { icon: 'heart', text: 'Designed around your story' },
      { icon: 'star', text: 'Florals, styling & cake' },
      { icon: 'camera', text: 'Hidden photographer option' },
      { icon: 'compass', text: 'Dedicated planner' },
    ],
    steps: [
      { time: 'Before', title: 'Planning call', detail: 'Tell us who, what and the surprise you have in mind.', image: 'lobbyLounge' },
      { time: 'On the day', title: 'We set the scene', detail: 'Candles, flowers and the table — all ready when you arrive.', image: 'jCandleTable' },
      { time: 'The moment', title: 'Just the two of you', detail: 'We disappear and let the moment happen.', image: 'proposal' },
      { time: 'After', title: 'Celebrate', detail: 'Cake, bubbles and a toast to remember.', image: 'celebrationTable' },
    ],
    packages: {
      honeymoon: { image: 'jPetalBath', perks: ['Petal turndown', 'Cake & bubbles', 'Couples’ keepsake'] },
      proposal: { image: 'proposal', perks: ['Private location', 'Floral design', 'Hidden photographer'] },
      birthday: { image: 'celebrationTable', perks: ['Styled table', 'Bespoke cake', 'Up to 20 guests'] },
    },
  },
  'coastal-picnic': {
    highlights: [
      { icon: 'food', text: 'Basket from our kitchen' },
      { icon: 'sun', text: 'Shade, cushions & a view' },
      { icon: 'heart', text: 'Styled & set up for you' },
      { icon: 'camera', text: 'Optional photographer' },
    ],
    steps: [
      { time: 'Arrive', title: 'Your spot is ready', detail: 'Woven mats, cushions and a parasol under the palms.', image: 'jPicnicTable' },
      { time: '+10 min', title: 'Open the basket', detail: 'Tea-leaf rolls, prawn skewers, fruit and lime soda.', image: 'jPicnicSpread' },
      { time: '+1 h', title: 'Slow afternoon', detail: 'Read, nap, swim — we’ll clear up when you leave.', image: 'jPicnicBlanket' },
    ],
    packages: {
      picnic: { image: 'jPicnicSpread', perks: ['For two', 'Styled set-up', 'Add guests anytime'] },
    },
  },
  'sunrise-yoga': {
    highlights: [
      { icon: 'sun', text: 'Practice as the sun rises' },
      { icon: 'heart', text: 'All levels welcome' },
      { icon: 'wave', text: 'Sound of the waves' },
      { icon: 'food', text: 'Fresh juice after' },
    ],
    steps: [
      { time: '06:15', title: 'Arrive & settle', detail: 'Mats and props ready on the open-air deck.', image: 'jStones' },
      { time: '06:30', title: 'Gentle hatha flow', detail: 'Stretch and breathe as the light changes.', image: 'jYogaGroup' },
      { time: '07:15', title: 'Breathwork', detail: 'Ten quiet minutes with the sound of the sea.', image: 'jYogaSilhouette' },
      { time: '07:30', title: 'Juice & breakfast', detail: 'A cold-pressed juice before breakfast at Tidewater.', image: 'mCooler' },
    ],
    packages: {
      group: { image: 'jYogaGroup', perks: ['Small group class', 'Mats & props', 'Fresh juice'] },
      private: { image: 'jYogaSilhouette', perks: ['One-to-one or for two', 'Tailored to you', 'Flexible time'] },
    },
  },
  'custom-escape': {
    highlights: [
      { icon: 'compass', text: 'Designed with our concierge' },
      { icon: 'wave', text: 'Private boat all day' },
      { icon: 'food', text: 'Sandbar lunch' },
      { icon: 'sun', text: 'Sunset return' },
    ],
    steps: [
      { time: 'Before', title: 'Plan with the concierge', detail: 'A call to shape the day around you.', image: 'lobbyLounge' },
      { time: '08:00', title: 'Private boat & crew', detail: 'Island stops, snorkelling and swims at your pace.', image: 'jBoatBow' },
      { time: '12:30', title: 'Sandbar lunch', detail: 'A table set on the sand by our team.', image: 'jPicnicTable' },
      { time: '17:30', title: 'Sunset return', detail: 'Glide home with the sky on fire.', image: 'jSailSunset' },
    ],
    packages: {
      bespoke: { image: 'jLongtailKarst', perks: ['Fully tailored itinerary', 'Private boat & crew', 'Lunch & refreshments'] },
    },
  },
}
