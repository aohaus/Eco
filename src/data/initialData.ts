import { EcoHabit, EcoBadge, EcoGuideItem, FootprintAnswers, FootprintScore } from '../types';

export const defaultFootprintAnswers: FootprintAnswers = {
  commuteMode: 'car_hybrid',
  weeklyCommuteKm: 120,
  shortFlightsPerYear: 2,
  longFlightsPerYear: 1,

  homeType: 'apartment',
  householdSize: 2,
  heatingType: 'electric',
  greenEnergyPlan: true,

  dietType: 'omnivore_low_meat',
  localSeasonalRatio: 50,
  foodWasteLevel: 'minimal',

  shoppingHabit: 'conscious',
  recyclingLevel: 'thorough',
  composting: true,
};

export function calculateFootprint(answers: FootprintAnswers): FootprintScore {
  // 1. Transport CO2
  let commuteFactor = 0.19; // kg CO2 per km for petrol
  if (answers.commuteMode === 'car_hybrid') commuteFactor = 0.11;
  else if (answers.commuteMode === 'car_ev') commuteFactor = 0.05;
  else if (answers.commuteMode === 'public_transit') commuteFactor = 0.04;
  else if (answers.commuteMode === 'bike_walk') commuteFactor = 0.0;

  const annualCommuteTonnes = (answers.weeklyCommuteKm * 52 * commuteFactor) / 1000;
  const shortFlightTonnes = answers.shortFlightsPerYear * 0.25; // ~250kg per short flight
  const longFlightTonnes = answers.longFlightsPerYear * 1.6; // ~1600kg per roundtrip longhaul
  const transportTonnes = annualCommuteTonnes + shortFlightTonnes + longFlightTonnes;

  // 2. Home Energy CO2
  let baseHomeTonnes = 3.2;
  if (answers.homeType === 'apartment') baseHomeTonnes = 1.8;
  else if (answers.homeType === 'house_large') baseHomeTonnes = 4.8;

  // Per person allocation
  let energyTonnes = baseHomeTonnes / Math.max(1, answers.householdSize);

  if (answers.heatingType === 'heat_pump') energyTonnes *= 0.6;
  else if (answers.heatingType === 'electric') energyTonnes *= 0.85;
  else if (answers.heatingType === 'oil_wood') energyTonnes *= 1.35;

  if (answers.greenEnergyPlan) {
    energyTonnes *= 0.45; // 55% reduction from renewable electricity
  }

  // 3. Food CO2
  let foodTonnes = 2.5; // average omnivore
  if (answers.dietType === 'vegan') foodTonnes = 1.1;
  else if (answers.dietType === 'vegetarian') foodTonnes = 1.5;
  else if (answers.dietType === 'pescatarian') foodTonnes = 1.8;
  else if (answers.dietType === 'omnivore_low_meat') foodTonnes = 2.1;
  else if (answers.dietType === 'omnivore_heavy_meat') foodTonnes = 3.3;

  // seasonal factor
  foodTonnes -= (answers.localSeasonalRatio / 100) * 0.3;

  // food waste factor
  if (answers.foodWasteLevel === 'minimal') foodTonnes *= 0.9;
  else if (answers.foodWasteLevel === 'frequent') foodTonnes *= 1.25;

  // 4. Consumption & Waste CO2
  let consumptionTonnes = 2.0;
  if (answers.shoppingHabit === 'minimalist') consumptionTonnes = 0.9;
  else if (answers.shoppingHabit === 'conscious') consumptionTonnes = 1.4;
  else if (answers.shoppingHabit === 'frequent') consumptionTonnes = 3.2;

  if (answers.recyclingLevel === 'thorough') consumptionTonnes *= 0.85;
  else if (answers.recyclingLevel === 'none') consumptionTonnes *= 1.2;

  if (answers.composting) consumptionTonnes -= 0.15;

  const totalTonnes = Math.max(0.5, +(transportTonnes + energyTonnes + foodTonnes + consumptionTonnes).toFixed(2));
  const treeOffsetNeeded = Math.round(totalTonnes * 45); // ~45 trees absorb 1 metric ton of CO2 per year

  // Benchmark average: 7.5 tonnes per capita in developed countries
  const averageBenchmark = 7.5;
  const comparisonToAverage = Math.round(((totalTonnes - averageBenchmark) / averageBenchmark) * 100);

  let tier: FootprintScore['tier'] = 'Low Impact';
  if (totalTonnes < 3.5) tier = 'Eco Champion';
  else if (totalTonnes < 6.0) tier = 'Low Impact';
  else if (totalTonnes < 10.0) tier = 'Moderate Impact';
  else tier = 'High Impact';

  return {
    totalTonnes,
    transportTonnes: +transportTonnes.toFixed(2),
    energyTonnes: +energyTonnes.toFixed(2),
    foodTonnes: +foodTonnes.toFixed(2),
    consumptionTonnes: +consumptionTonnes.toFixed(2),
    treeOffsetNeeded,
    comparisonToAverage,
    tier,
  };
}

export const initialHabits: EcoHabit[] = [
  {
    id: 'habit-1',
    title: 'Commuted by Bike or Foot',
    category: 'transport',
    description: 'Replaced a motorized vehicle trip with active green mobility.',
    co2SavingsKg: 2.4,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 0,
    points: 25,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-2',
    title: 'Ate Plant-Based All Day',
    category: 'food',
    description: 'Chose 100% vegetarian or vegan meals for breakfast, lunch, and dinner.',
    co2SavingsKg: 3.8,
    waterSavingsLiters: 1200,
    wasteSavedKg: 0.2,
    energySavedKwh: 0,
    points: 30,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-3',
    title: 'Reusable Coffee Cup / Bottle',
    category: 'consumption',
    description: 'Avoided single-use plastics and disposable cups.',
    co2SavingsKg: 0.3,
    waterSavingsLiters: 15,
    wasteSavedKg: 0.1,
    energySavedKwh: 0,
    points: 10,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-4',
    title: 'Line-Dried Clothes',
    category: 'energy',
    description: 'Skipped the high-energy electric tumble dryer and air-dried laundry.',
    co2SavingsKg: 1.8,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 3.2,
    points: 20,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-5',
    title: 'Short 5-Minute Shower',
    category: 'water',
    description: 'Cut shower time to conserve heated water and energy.',
    co2SavingsKg: 0.7,
    waterSavingsLiters: 45,
    wasteSavedKg: 0,
    energySavedKwh: 1.5,
    points: 15,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-6',
    title: 'Zero Food Waste Day',
    category: 'food',
    description: 'Used leftovers and planned portions to create zero edible waste.',
    co2SavingsKg: 1.5,
    waterSavingsLiters: 180,
    wasteSavedKg: 0.6,
    energySavedKwh: 0,
    points: 20,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-7',
    title: 'Composted Organic Scraps',
    category: 'consumption',
    description: 'Diverted kitchen peels and coffee grounds from landfill methane production.',
    co2SavingsKg: 0.8,
    waterSavingsLiters: 0,
    wasteSavedKg: 0.5,
    energySavedKwh: 0,
    points: 15,
    completedDates: [],
    streak: 0,
  },
  {
    id: 'habit-8',
    title: 'Standby Power Shutdown',
    category: 'energy',
    description: 'Turned off power strips and electronics that draw phantom vampire load.',
    co2SavingsKg: 0.6,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 1.2,
    points: 15,
    completedDates: [],
    streak: 0,
  },
];

export const initialBadges: EcoBadge[] = [
  {
    id: 'b-1',
    title: 'Seedling Starter',
    description: 'Completed your first eco-friendly action.',
    iconName: 'Sprout',
    unlockedAt: '2026-08-25',
    requirement: 'Log 1 habit',
  },
  {
    id: 'b-2',
    title: 'Carbon Cutter',
    description: 'Saved over 25 kg of CO2 equivalent emissions.',
    iconName: 'Leaf',
    unlockedAt: null,
    requirement: 'Save 25kg CO2',
  },
  {
    id: 'b-3',
    title: 'Water Guardian',
    description: 'Conserved more than 1,000 liters of fresh water.',
    iconName: 'Droplets',
    unlockedAt: null,
    requirement: 'Conserve 1000L water',
  },
  {
    id: 'b-4',
    title: 'Zero Waste Vanguard',
    description: 'Diverted 10 kg of waste from landfills through composting & reusables.',
    iconName: 'Trash2',
    unlockedAt: null,
    requirement: 'Divert 10kg waste',
  },
  {
    id: 'b-5',
    title: 'Green Streak 7',
    description: 'Maintained an active habit logging streak for 7 consecutive days.',
    iconName: 'Flame',
    unlockedAt: null,
    requirement: '7-day streak',
  },
  {
    id: 'b-6',
    title: 'Energy Maestro',
    description: 'Conserved over 50 kWh of electricity with conscious home habits.',
    iconName: 'Zap',
    unlockedAt: null,
    requirement: 'Save 50 kWh',
  },
];

export const ecoGuides: EcoGuideItem[] = [
  {
    id: 'guide-1',
    title: 'Zero-Waste Kitchen Masterclass',
    category: 'food',
    readTime: '4 min',
    difficulty: 'Easy',
    co2Impact: 'High',
    summary: 'Simple system adjustments to prevent food spoiling, optimize storage, and compost efficiently.',
    steps: [
      'Store herbs in a small glass of water like cut flowers to double their lifespan.',
      'Create an "Eat Me First" bin on the top shelf of your refrigerator for nearing-expiry items.',
      'Freeze veggie scraps (onion skins, carrot ends, celery tops) to make rich homemade broth.',
      'Keep dry grains, nuts, and pulses in clear glass jars to easily track inventory before shopping.'
    ]
  },
  {
    id: 'guide-2',
    title: 'Eliminating Phantom "Vampire" Energy',
    category: 'energy',
    readTime: '3 min',
    difficulty: 'Easy',
    co2Impact: 'Medium',
    summary: 'Up to 10% of residential power is drawn while devices are idle or on standby mode.',
    steps: [
      'Use smart power strips that cut power to peripherals when the main TV or PC is shut off.',
      'Unplug chargers for phones and laptops when devices reach 100%.',
      'Adjust TV and monitor brightness settings from dynamic mode to eco/ambient light detection.',
      'Set home thermostat 1°C lower in winter and 1°C higher in summer for 5-8% energy savings.'
    ]
  },
  {
    id: 'guide-3',
    title: 'Low-Impact Urban Transportation',
    category: 'transport',
    readTime: '5 min',
    difficulty: 'Moderate',
    co2Impact: 'High',
    summary: 'Rethinking daily commutes with multimodality, e-bikes, and efficient routing.',
    steps: [
      'Adopt the "Sub-3-Mile Rule": commit to biking or walking any trip under 3 miles (5 km).',
      'Combine errands into single multi-stop trips to minimize cold engine starts.',
      'Maintain tire pressures at manufacturer spec to improve vehicle fuel efficiency by 3-4%.',
      'Use electric car-sharing or intercity trains rather than domestic short-haul flights.'
    ]
  },
  {
    id: 'guide-4',
    title: 'Microplastic-Free Laundry Protocol',
    category: 'water',
    readTime: '3 min',
    difficulty: 'Easy',
    co2Impact: 'Medium',
    summary: 'Protect waterways from synthetic microfibers while extending clothing longevity.',
    steps: [
      'Wash full loads with cold water (30°C / 86°F) to reduce fiber shedding by up to 30%.',
      'Use liquid detergent or soap sheets instead of abrasive powder detergents on synthetics.',
      'Use a micro-fiber filter wash bag (like Guppyfriend) for fleece and polyester garments.',
      'Air dry shirts, jeans, and delicates to prevent fabric degradation and save dryer electricity.'
    ]
  },
  {
    id: 'guide-5',
    title: 'Capsule Wardrobe & Circular Fashion',
    category: 'consumption',
    readTime: '4 min',
    difficulty: 'Moderate',
    co2Impact: 'High',
    summary: 'Curate a durable 30-piece seasonal wardrobe and reduce textile footprint.',
    steps: [
      'Perform a 30-day "Wait Before You Buy" rule on non-essential clothing items.',
      'Prioritize organic natural fibers: linen, hemp, certified organic cotton, and Tencel/Lyocell.',
      'Learn basic mending: sewing buttons, patching denim knees, and de-pilling knitwear.',
      'Participate in local clothes swaps or use quality peer-to-peer resale platforms.'
    ]
  }
];
