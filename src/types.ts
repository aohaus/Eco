export type EcoCategory = 'transport' | 'energy' | 'food' | 'consumption' | 'water';

export interface FootprintAnswers {
  // Transport
  commuteMode: 'car_petrol' | 'car_hybrid' | 'car_ev' | 'public_transit' | 'bike_walk';
  weeklyCommuteKm: number;
  shortFlightsPerYear: number;
  longFlightsPerYear: number;

  // Energy
  homeType: 'apartment' | 'house_small' | 'house_large';
  householdSize: number;
  heatingType: 'natural_gas' | 'electric' | 'heat_pump' | 'oil_wood';
  greenEnergyPlan: boolean;

  // Food
  dietType: 'vegan' | 'vegetarian' | 'pescatarian' | 'omnivore_low_meat' | 'omnivore_heavy_meat';
  localSeasonalRatio: number; // percentage 0-100
  foodWasteLevel: 'minimal' | 'average' | 'frequent';

  // Consumption & Waste
  shoppingHabit: 'minimalist' | 'conscious' | 'average' | 'frequent';
  recyclingLevel: 'none' | 'basic' | 'thorough';
  composting: boolean;
}

export interface FootprintScore {
  totalTonnes: number;
  transportTonnes: number;
  energyTonnes: number;
  foodTonnes: number;
  consumptionTonnes: number;
  treeOffsetNeeded: number;
  comparisonToAverage: number; // percentage relative to 8.5t average (e.g. -25% or +15%)
  tier: 'Eco Champion' | 'Low Impact' | 'Moderate Impact' | 'High Impact';
}

export interface EcoHabit {
  id: string;
  title: string;
  category: EcoCategory;
  description: string;
  co2SavingsKg: number;
  waterSavingsLiters: number;
  wasteSavedKg: number;
  energySavedKwh: number;
  points: number;
  completedDates: string[]; // ISO date strings (YYYY-MM-DD)
  streak: number;
}

export interface ResourceLog {
  id: string;
  date: string;
  type: 'electricity' | 'water' | 'gas' | 'solar';
  amount: number;
  unit: string;
  notes?: string;
}

export interface EcoBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: string | null;
  requirement: string;
}

export interface EcoGuideItem {
  id: string;
  title: string;
  category: EcoCategory;
  readTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  co2Impact: 'High' | 'Medium' | 'Low';
  summary: string;
  steps: string[];
}
