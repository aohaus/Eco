import { Language } from '../utils/i18n';

export type EcoElementType = 'sun' | 'water' | 'wind' | 'nature' | 'recycle' | 'spark';
export type CreatureRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface EcoCreature {
  id: string;
  nameJa: string;
  nameEn: string;
  element: EcoElementType;
  rarity: CreatureRarity;
  cp: number; // Eco-Power
  candies?: number; // Pokémon GO style candies for power-ups
  emoji: string;
  color: string;
  bgColor: string;
  unlocked: boolean;
  isShiny?: boolean;
  discoveredAt?: string;
  descriptionJa: string;
  descriptionEn: string;
  unlockHintJa: string;
  unlockHintEn: string;
}

export interface CraftingRecipe {
  id: string;
  nameJa: string;
  nameEn: string;
  emoji: string;
  category: 'energy' | 'living' | 'nature' | 'gear';
  descriptionJa: string;
  descriptionEn: string;
  perkJa: string;
  perkEn: string;
  cost: {
    wood: number;
    leaf: number;
    solar: number;
    pebble: number;
    plastic: number;
    crystal: number;
  };
  crafted: boolean;
  craftedAt?: string;
}

export interface InventoryMaterials {
  wood: number;
  leaf: number;
  solar: number;
  pebble: number;
  plastic: number;
  crystal: number;
}

export interface BuddyData {
  affection: number; // 0 to 100
  buddyRank: 1 | 2 | 3 | 4; // 1: はじめての相棒, 2: グレート相棒, 3: ウルトラ相棒, 4: 最高の相棒
  todayPetCount: number;
  todayFeedCount: number;
  todayPlayCount: number;
  equippedCostume: string;
  totalInteractions: number;
}

export interface TrainerProfile {
  name: string;
  titleJa: string;
  titleEn: string;
  friendCode: string;
  favoriteCreatureId: string;
  avatarSeed: number;
}
