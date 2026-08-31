export type MissionCategory = 
  | 'Ocean Health'
  | 'Biodiversity & Forestry'
  | 'Plastic Neutralization'
  | 'Climate & Glacier'
  | 'Desertification & Soil'
  | 'Coral & Marine Sanctuary';

export type MissionDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MissionGadget {
  id: string;
  name: string;
  codename: string;
  icon: string;
  description: string;
  powerSource: string;
  efficiencyRating: string;
  actionPrompt: string;
  calibrationType: 'slider' | 'frequency' | 'timing' | 'multi-tap';
}

export interface FieldIntelCard {
  id: string;
  missionId: string;
  speciesOrTopic: string;
  scientificName?: string;
  category: MissionCategory;
  emoji: string;
  keyFact: string;
  vitalStats: {
    label: string;
    value: string;
  }[];
  conservationStatus: 'Critically Endangered' | 'Endangered' | 'Vulnerable' | 'Near Threatened' | 'Restored';
  unlockedAt?: string;
}

export interface EarthMission {
  id: string;
  title: string;
  codename: string;
  locationName: string;
  region: string;
  coordinates: Coordinates;
  difficulty: MissionDifficulty;
  category: MissionCategory;
  impactScore: string; // e.g. "450 tons CO2 / yr", "12,000 kg Plastic"
  ecoReward: number;
  issueDescription: string;
  satelliteIntel: string;
  solutionGadget: string;
  gadgets: MissionGadget[];
  targetAnomaly: {
    type: string;
    initialReading: string;
    targetReading: string;
    unit: string;
  };
  funFact: string;
  intelReward: FieldIntelCard;
  isCompleted?: boolean;
  restorationRate?: number; // 0 - 100%
  completedTimestamp?: number;
}

export interface ExplorerStats {
  missionsCompleted: number;
  totalEcoImpactPoints: number;
  intelCollectedCount: number;
  radarScansPerformed: number;
  rankTitle: string;
}

export type LocalMissionType =
  | 'park_cleanup'
  | 'water_purity'
  | 'green_commute'
  | 'energy_patrol'
  | 'urban_bio'
  | 'recycle_depot';

export interface LocalEcoMission {
  id: string;
  title: string;
  titleJa: string;
  type: LocalMissionType;
  emoji: string;
  category: MissionCategory;
  coordinates: Coordinates;
  distanceMeters?: number;
  description: string;
  descriptionJa: string;
  lore: string;
  loreJa: string;
  actionName: string;
  actionNameJa: string;
  rewardPoints: number;
  rewardExp: number;
  interactiveChallenge: {
    prompt: string;
    promptJa: string;
    goalCount: number;
    actionVerb: string;
    actionVerbJa: string;
    bonusFact: string;
    bonusFactJa: string;
    gameType: 'tap_clean' | 'slider_calibrate' | 'sort_recycle' | 'solar_charge';
  };
  isCompleted?: boolean;
  completedAt?: string;
}
