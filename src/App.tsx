import React, { useState, useEffect } from 'react';
import { MinimalTopBar } from './components/MinimalTopBar';
import { MinimalBottomNav, MainTabType } from './components/MinimalBottomNav';
import { HomeScreenPatternC } from './components/HomeScreenPatternC';
import { WorldMapScreen } from './components/WorldMapScreen';
import { Dashboard } from './components/Dashboard';
import { FootprintCalculator } from './components/FootprintCalculator';
import { HabitTracker } from './components/HabitTracker';
import { ResourceMonitor } from './components/ResourceMonitor';
import { EcoGuide } from './components/EcoGuide';
import { EcoLibrary } from './components/EcoLibrary';
import { EcoRunawayGame } from './components/EcoRunawayGame';
import { ShatominRoom } from './components/ShatominRoom';
import { BuddyScreen } from './components/BuddyScreen';
import { EcoDexScreen } from './components/EcoDexScreen';
import { CraftingBenchScreen } from './components/CraftingBenchScreen';
import { EcoExplorerScreen } from './components/explorer/EcoExplorerScreen';
import { DailyRouletteModal } from './components/DailyRouletteModal';
import { TrainerCardModal } from './components/TrainerCardModal';
import { GameIntroModal } from './components/GameIntroModal';
import { LevelUpModal } from './components/LevelUpModal';
import { GuardianMission, GuardianLevelTier, GUARDIAN_LEVEL_TIERS } from './data/guardianQuests';
import { sounds } from './utils/soundEffects';
import { Language } from './utils/i18n';
import confetti from 'canvas-confetti';
import { 
  defaultFootprintAnswers, 
  calculateFootprint, 
  initialHabits, 
  initialBadges 
} from './data/initialData';
import { 
  INITIAL_CREATURES, 
  INITIAL_CRAFTING_RECIPES, 
  INITIAL_BUDDY_DATA, 
  INITIAL_MATERIALS, 
  INITIAL_TRAINER_PROFILE 
} from './data/gameData';
import { FootprintAnswers, EcoHabit, ResourceLog, EcoBadge } from './types';
import { BuddyData, EcoCreature, CraftingRecipe, InventoryMaterials, TrainerProfile } from './types/gameTypes';
import { Award, X } from 'lucide-react';

export const App: React.FC = () => {
  const todayDate = new Date().toISOString().split('T')[0];

  // Language state (bilingual: JA / EN)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('eco_language');
    return (saved === 'en' || saved === 'ja') ? saved : 'en';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('eco_language', newLang);
  };

  // Main tab state (home, buddy, library, habits, explorer)
  const [activeTab, setActiveTab] = useState<string>('home');

  // Daily Quests state for Pattern C
  const [savedWaterToday, setSavedWaterToday] = useState(false);
  const [recycledToday, setRecycledToday] = useState(false);
  const [plantedToday, setPlantedToday] = useState(false);

  // Modals for Pokémon GO & Minecraft gamification
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isTrainerPassOpen, setIsTrainerPassOpen] = useState(false);

  // Guardian Questline State (Levels 1-4)
  const [guardianLevel, setGuardianLevel] = useState<number>(() => {
    const saved = localStorage.getItem('eco_guardian_level');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_completed_missions');
    return saved ? JSON.parse(saved) : [];
  });

  const [claimedMissionIds, setClaimedMissionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco_claimed_missions');
    return saved ? JSON.parse(saved) : [];
  });

  // Story & How-To-Play Modal
  const [isIntroModalOpen, setIsIntroModalOpen] = useState<boolean>(() => {
    return localStorage.getItem('eco_has_seen_intro') !== 'true';
  });

  // Level Up Celebration Modal
  const [levelUpTier, setLevelUpTier] = useState<GuardianLevelTier | null>(null);

  const [answers, setAnswers] = useState<FootprintAnswers>(() => {
    const saved = localStorage.getItem('eco_answers');
    return saved ? JSON.parse(saved) : defaultFootprintAnswers;
  });

  const [habits, setHabits] = useState<EcoHabit[]>(() => {
    const saved = localStorage.getItem('eco_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [bonusPoints, setBonusPoints] = useState<number>(() => {
    const saved = localStorage.getItem('eco_bonus_points');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Game Persistence: Buddy Data
  const [buddyData, setBuddyData] = useState<BuddyData>(() => {
    const saved = localStorage.getItem('eco_buddy_data');
    return saved ? JSON.parse(saved) : INITIAL_BUDDY_DATA;
  });

  // Game Persistence: Creatures (Eco-Dex)
  const [creatures, setCreatures] = useState<EcoCreature[]>(() => {
    const saved = localStorage.getItem('eco_creatures');
    return saved ? JSON.parse(saved) : INITIAL_CREATURES;
  });

  // Game Persistence: Crafting Recipes
  const [recipes, setRecipes] = useState<CraftingRecipe[]>(() => {
    const saved = localStorage.getItem('eco_craft_recipes');
    return saved ? JSON.parse(saved) : INITIAL_CRAFTING_RECIPES;
  });

  // Game Persistence: Materials Inventory
  const [materials, setMaterials] = useState<InventoryMaterials>(() => {
    const saved = localStorage.getItem('eco_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  // Game Persistence: Trainer Profile
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(() => {
    const saved = localStorage.getItem('eco_trainer_profile');
    return saved ? JSON.parse(saved) : INITIAL_TRAINER_PROFILE;
  });

  const [resourceLogs, setResourceLogs] = useState<ResourceLog[]>(() => {
    const saved = localStorage.getItem('eco_resource_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-1',
        date: '2026-08-28',
        type: 'electricity',
        amount: 12.4,
        unit: 'kWh',
        notes: 'Normal weekday baseline usage',
      },
      {
        id: 'log-2',
        date: '2026-08-28',
        type: 'water',
        amount: 140,
        unit: 'L',
        notes: 'Quick showers & dish wash',
      },
      {
        id: 'log-3',
        date: '2026-08-27',
        type: 'solar',
        amount: 8.5,
        unit: 'kWh',
        notes: 'Sunny afternoon generation',
      }
    ];
  });

  const [badges, setBadges] = useState<EcoBadge[]>(() => {
    const saved = localStorage.getItem('eco_badges');
    return saved ? JSON.parse(saved) : initialBadges;
  });

  const [unlockedToast, setUnlockedToast] = useState<string | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('eco_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('eco_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('eco_bonus_points', bonusPoints.toString());
  }, [bonusPoints]);

  useEffect(() => {
    localStorage.setItem('eco_resource_logs', JSON.stringify(resourceLogs));
  }, [resourceLogs]);

  useEffect(() => {
    localStorage.setItem('eco_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('eco_buddy_data', JSON.stringify(buddyData));
  }, [buddyData]);

  useEffect(() => {
    localStorage.setItem('eco_creatures', JSON.stringify(creatures));
  }, [creatures]);

  useEffect(() => {
    localStorage.setItem('eco_craft_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('eco_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('eco_trainer_profile', JSON.stringify(trainerProfile));
  }, [trainerProfile]);

  useEffect(() => {
    localStorage.setItem('eco_guardian_level', guardianLevel.toString());
  }, [guardianLevel]);

  useEffect(() => {
    localStorage.setItem('eco_completed_missions', JSON.stringify(completedMissionIds));
  }, [completedMissionIds]);

  useEffect(() => {
    localStorage.setItem('eco_claimed_missions', JSON.stringify(claimedMissionIds));
  }, [claimedMissionIds]);

  // Derived score
  const score = calculateFootprint(answers);

  // Derive points, streak, and badges
  const totalCompletedHabitCount = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const totalPoints = habits.reduce((acc, h) => acc + (h.completedDates.length * h.points), 0) + 50 + bonusPoints;
  const level = Math.floor(totalPoints / 100) + 1;
  const expInLevel = totalPoints % 100;

  // Global Streak: Max consecutive streak among habits or active days
  const currentStreak = Math.max(1, ...habits.map(h => h.streak));

  // Check and unlock badges automatically
  useEffect(() => {
    const totalSavedCO2 = habits.reduce((acc, h) => acc + (h.completedDates.length * h.co2SavingsKg), 0);
    const totalSavedWater = habits.reduce((acc, h) => acc + (h.completedDates.length * h.waterSavingsLiters), 0);
    const totalDivertedWaste = habits.reduce((acc, h) => acc + (h.completedDates.length * h.wasteSavedKg), 0);
    const totalSavedEnergy = habits.reduce((acc, h) => acc + (h.completedDates.length * h.energySavedKwh), 0);

    let updated = false;
    const nextBadges = badges.map(badge => {
      if (badge.unlockedAt) return badge;

      let shouldUnlock = false;
      if (badge.id === 'b-1' && totalCompletedHabitCount >= 1) shouldUnlock = true;
      if (badge.id === 'b-2' && totalSavedCO2 >= 25) shouldUnlock = true;
      if (badge.id === 'b-3' && totalSavedWater >= 1000) shouldUnlock = true;
      if (badge.id === 'b-4' && totalDivertedWaste >= 10) shouldUnlock = true;
      if (badge.id === 'b-5' && currentStreak >= 7) shouldUnlock = true;
      if (badge.id === 'b-6' && totalSavedEnergy >= 50) shouldUnlock = true;

      if (shouldUnlock) {
        updated = true;
        sounds.playEcoChime();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 }
        });
        setUnlockedToast(`Badge Unlocked: ${badge.title}!`);
        return { ...badge, unlockedAt: todayDate };
      }
      return badge;
    });

    if (updated) {
      setBadges(nextBadges);
    }
  }, [habits, currentStreak, totalCompletedHabitCount, todayDate, badges]);

  // Handlers
  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const isCompletedToday = habit.completedDates.includes(todayDate);
      let newDates: string[];
      let newStreak = habit.streak;

      if (isCompletedToday) {
        newDates = habit.completedDates.filter(d => d !== todayDate);
        newStreak = Math.max(0, newStreak - 1);
      } else {
        newDates = [...habit.completedDates, todayDate];
        newStreak = newStreak + 1;
        sounds.playShatominSqueak(0.5);

        // Habit bonus: Reward wood & leaf materials
        setMaterials(prevMat => ({
          ...prevMat,
          wood: prevMat.wood + 2,
          leaf: prevMat.leaf + 3,
        }));
      }

      return {
        ...habit,
        completedDates: newDates,
        streak: newStreak,
      };
    }));
  };

  const handleAddBonusPoints = (pts: number) => {
    setBonusPoints(prev => prev + pts);
    // Also give player some crafting materials for completing runs / quizzes
    setMaterials(prev => ({
      ...prev,
      solar: prev.solar + 1,
      pebble: prev.pebble + 1,
    }));
  };

  // Craft item handler
  const handleCraftRecipe = (recipeId: string) => {
    const targetRecipe = recipes.find(r => r.id === recipeId);
    if (!targetRecipe || targetRecipe.crafted) return;

    // Deduct cost
    setMaterials(prev => ({
      wood: Math.max(0, prev.wood - targetRecipe.cost.wood),
      leaf: Math.max(0, prev.leaf - targetRecipe.cost.leaf),
      solar: Math.max(0, prev.solar - targetRecipe.cost.solar),
      pebble: Math.max(0, prev.pebble - targetRecipe.cost.pebble),
      plastic: Math.max(0, prev.plastic - targetRecipe.cost.plastic),
      crystal: Math.max(0, prev.crystal - targetRecipe.cost.crystal),
    }));

    // Mark as crafted
    setRecipes(prev => prev.map(r => r.id === recipeId ? { ...r, crafted: true } : r));

    // Award bonus points
    handleAddBonusPoints(80);
    setUnlockedToast(`Crafted: ${language === 'ja' ? targetRecipe.nameJa : targetRecipe.nameEn}!`);
  };

  // Power Up Creature handler (Pokémon GO Style)
  const handlePowerUpCreature = (creatureId: string) => {
    const target = creatures.find(c => c.id === creatureId);
    if (!target || !target.unlocked) return;

    const candyCost = target.rarity === 'legendary' ? 10 : target.rarity === 'epic' ? 6 : target.rarity === 'rare' ? 4 : 2;
    const currentCandies = target.candies || 0;
    if (currentCandies < candyCost) return;

    setCreatures(prev => prev.map(c => {
      if (c.id !== creatureId) return c;
      return {
        ...c,
        candies: (c.candies || 0) - candyCost,
        cp: c.cp + 45,
      };
    }));

    sounds.playLevelUp();
    confetti({ particleCount: 50, spread: 60 });
    handleAddBonusPoints(30);
  };

  // Guardian Mission Complete & Claim Handlers
  const handleCompleteMission = (missionId: string) => {
    if (!completedMissionIds.includes(missionId)) {
      setCompletedMissionIds(prev => [...prev, missionId]);
      sounds.playPop();
    }
  };

  const handleClaimMission = (mission: GuardianMission) => {
    if (claimedMissionIds.includes(mission.id)) return;

    // Mark as claimed
    setClaimedMissionIds(prev => [...prev, mission.id]);

    // Add EXP & Points
    handleAddBonusPoints(mission.rewardExp);

    // Add Materials
    if (mission.rewardMaterials) {
      setMaterials(prev => ({
        wood: prev.wood + (mission.rewardMaterials?.wood || 0),
        leaf: prev.leaf + (mission.rewardMaterials?.leaf || 0),
        solar: prev.solar + (mission.rewardMaterials?.solar || 0),
        pebble: prev.pebble + (mission.rewardMaterials?.pebble || 0),
        plastic: prev.plastic + (mission.rewardMaterials?.plastic || 0),
        crystal: prev.crystal + (mission.rewardMaterials?.crystal || 0),
      }));
    }

    setUnlockedToast(`Mission Clear: ${language === 'ja' ? mission.titleJa : mission.titleEn}! (+${mission.rewardExp} EXP)`);

    // Check if all missions in current tier are now claimed
    const currentTier = GUARDIAN_LEVEL_TIERS.find(t => t.level === guardianLevel);
    if (currentTier) {
      const nextClaimed = [...claimedMissionIds, mission.id];
      const allTierClaimed = currentTier.missions.every(m => nextClaimed.includes(m.id));
      if (allTierClaimed && guardianLevel < GUARDIAN_LEVEL_TIERS.length) {
        const nextLevel = guardianLevel + 1;
        setGuardianLevel(nextLevel);
        const nextTierObj = GUARDIAN_LEVEL_TIERS.find(t => t.level === nextLevel);
        if (nextTierObj) {
          setLevelUpTier(nextTierObj);
        }
      }
    }
  };

  // Auto-evaluate missions based on player activity
  useEffect(() => {
    const toComplete: string[] = [];

    // Lv.1: Greet & Pet Shatomin
    if (buddyData.todayPetCount > 0 || buddyData.totalInteractions > 0) {
      toComplete.push('lv1-m1');
    }

    // Lv.1: Read book in library
    const completedBooks = localStorage.getItem('eco_library_completed');
    if (completedBooks && JSON.parse(completedBooks).length > 0) {
      toComplete.push('lv1-m2');
    }

    // Lv.1: Check 1 daily habit
    if (totalCompletedHabitCount > 0) {
      toComplete.push('lv1-m3');
    }

    // Lv.2: Collect plastic in runner game / mini-game played
    if (bonusPoints > 0) {
      toComplete.push('lv2-m1');
    }

    // Lv.2: Craft an item
    if (recipes.some(r => r.crafted)) {
      toComplete.push('lv2-m2');
    }

    // Lv.2: Calculate footprint
    if (answers.weeklyCommuteKm !== defaultFootprintAnswers.weeklyCommuteKm || answers.dietType !== defaultFootprintAnswers.dietType) {
      toComplete.push('lv2-m3');
    }

    // Lv.3: Discover creatures in Dex
    if (creatures.filter(c => c.unlocked).length >= 2) {
      toComplete.push('lv3-m3');
    }

    // Lv.4: Deepen bond with Shatomin
    if (buddyData.buddyRank >= 2 || buddyData.affection >= 40) {
      toComplete.push('lv4-m1');
    }

    // Lv.4: Log resource data
    if (resourceLogs.length > 3) {
      toComplete.push('lv4-m3');
    }

    if (toComplete.length > 0) {
      setCompletedMissionIds(prev => {
        const newIds = toComplete.filter(id => !prev.includes(id));
        if (newIds.length > 0) {
          return [...prev, ...newIds];
        }
        return prev;
      });
    }
  }, [buddyData, totalCompletedHabitCount, bonusPoints, recipes, answers, creatures, resourceLogs]);

  // Current active mission calculation for StartScreen
  const currentTierObj = GUARDIAN_LEVEL_TIERS.find(t => t.level === guardianLevel) || GUARDIAN_LEVEL_TIERS[0];
  const nextActiveMission = currentTierObj.missions.find(m => !claimedMissionIds.includes(m.id)) || currentTierObj.missions[0];
  const activeMissionTitle = nextActiveMission ? (language === 'ja' ? nextActiveMission.titleJa : nextActiveMission.titleEn) : undefined;
  const activeMissionTab = nextActiveMission?.targetTab;

  // Daily Roulette Claim
  const handleClaimRouletteReward = (reward: { points: number; materials: { wood: number; leaf: number; solar: number; crystal: number }; message: string }) => {
    handleAddBonusPoints(reward.points);
    setMaterials(prev => ({
      ...prev,
      wood: prev.wood + reward.materials.wood,
      leaf: prev.leaf + reward.materials.leaf,
      solar: prev.solar + reward.materials.solar,
      crystal: prev.crystal + reward.materials.crystal,
    }));
  };

  const handleAddHabit = (newHabit: Omit<EcoHabit, 'id' | 'completedDates' | 'streak'>) => {
    const created: EcoHabit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      completedDates: [],
      streak: 0,
    };
    setHabits(prev => [created, ...prev]);
  };

  const handleAddResourceLog = (newLog: Omit<ResourceLog, 'id'>) => {
    const created: ResourceLog = {
      ...newLog,
      id: `log-${Date.now()}`,
    };
    setResourceLogs(prev => [created, ...prev]);
  };

  const handleDeleteResourceLog = (id: string) => {
    setResourceLogs(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FBF8F2] text-stone-800 flex flex-col relative font-sans selection:bg-[#275236]/20 selection:text-[#275236] pb-24">
      {/* 1. Minimal Clean Top Bar */}
      <MinimalTopBar
        level={level}
        currentExp={expInLevel}
        maxExp={level * 100}
        ecoPoints={totalPoints}
        streak={currentStreak}
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenIntro={() => setIsIntroModalOpen(true)}
        onAvatarClick={() => setActiveTab('buddy')}
      />

      {/* Achievement Banner Notification */}
      {unlockedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#275236] text-white font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <Award className="w-5 h-5 text-amber-300" />
          <span className="text-sm">{unlockedToast}</span>
          <button
            onClick={() => setUnlockedToast(null)}
            className="ml-2 text-white/80 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-center">
        {/* Tab 1: Home (Pattern C Minimal Clean) */}
        {activeTab === 'home' && (
          <HomeScreenPatternC
            onStartAdventure={() => setActiveTab('explorer')}
            onNavigateToTab={(target) => setActiveTab(target)}
            savedWaterToday={savedWaterToday}
            recycledToday={recycledToday}
            plantedToday={plantedToday}
            onToggleQuest={(quest) => {
              if (quest === 'water') {
                setSavedWaterToday(!savedWaterToday);
                if (!savedWaterToday) handleAddBonusPoints(30);
              } else if (quest === 'recycle') {
                setRecycledToday(!recycledToday);
                if (!recycledToday) handleAddBonusPoints(30);
              } else if (quest === 'plant') {
                setPlantedToday(!plantedToday);
                if (!plantedToday) handleAddBonusPoints(30);
              }
            }}
          />
        )}

        {/* Tab 2: Buddy Haven */}
        {activeTab === 'buddy' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <BuddyScreen
              buddyData={buddyData}
              onUpdateBuddy={setBuddyData}
              trainerProfile={trainerProfile}
              totalPoints={totalPoints}
              streak={currentStreak}
              level={level}
              language={language}
              onAddPoints={(pts) => handleAddBonusPoints(pts)}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {/* Tab 3: Eco Library */}
        {activeTab === 'library' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <EcoLibrary
              onAddPoints={handleAddBonusPoints}
              setActiveTab={setActiveTab}
              language={language}
            />
          </div>
        )}

        {/* Tab 4: Habit Tracker */}
        {activeTab === 'habits' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <HabitTracker
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              todayDate={todayDate}
            />
          </div>
        )}

        {/* Tab 5: Eco Explorer (Earth Rescue & GPS Map) */}
        {activeTab === 'explorer' && (
          <div className="max-w-6xl w-full mx-auto px-4 py-4">
            <EcoExplorerScreen
              language={language}
              onAddPoints={handleAddBonusPoints}
              onAddExp={(exp) => handleAddBonusPoints(exp)}
              onReturnToAppMap={() => setActiveTab('home')}
            />
          </div>
        )}

        {/* Secondary Views (Accessible smoothly from internal links) */}
        {activeTab === 'map' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <WorldMapScreen
              language={language}
              onNavigate={(tab) => setActiveTab(tab)}
              totalPoints={totalPoints}
              streak={currentStreak}
              onAddPoints={handleAddBonusPoints}
              guardianLevel={guardianLevel}
              completedMissionIds={completedMissionIds}
              claimedMissionIds={claimedMissionIds}
              onCompleteMission={handleCompleteMission}
              onClaimMission={handleClaimMission}
              onOpenIntro={() => setIsIntroModalOpen(true)}
              onOpenRoulette={() => setIsRouletteOpen(true)}
              onOpenTrainerCard={() => setIsTrainerPassOpen(true)}
            />
          </div>
        )}

        {activeTab === 'dex' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <EcoDexScreen
              creatures={creatures}
              favoriteId={trainerProfile.favoriteCreatureId}
              onSetFavorite={(id) => {
                setTrainerProfile(prev => ({ ...prev, favoriteCreatureId: id }));
                setUnlockedToast(language === 'ja' ? 'お気に入りの相棒リーダーを変更しました！' : 'Updated Favorite Leader Creature!');
              }}
              language={language}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'craft' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <CraftingBenchScreen
              recipes={recipes}
              materials={materials}
              onCraft={handleCraftRecipe}
              language={language}
              setActiveTab={setActiveTab}
            />
          </div>
        )}

        {activeTab === 'game' && (
          <div className="max-w-5xl w-full mx-auto px-4 py-4">
            <EcoRunawayGame
              onAddPoints={handleAddBonusPoints}
              setActiveTab={setActiveTab}
              language={language}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="max-w-4xl w-full mx-auto px-4 py-4">
            <FootprintCalculator
              answers={answers}
              onSaveAnswers={setAnswers}
              currentScore={score}
            />
          </div>
        )}
      </main>

      {/* 2. Minimal Clean Bottom 5-Item Navigation */}
      <MinimalBottomNav
        activeTab={activeTab}
        onSelectTab={(tab: MainTabType) => setActiveTab(tab)}
      />

      {/* Global Story & How-To-Play Guide Modal */}
      <GameIntroModal
        isOpen={isIntroModalOpen}
        onClose={() => {
          setIsIntroModalOpen(false);
          localStorage.setItem('eco_has_seen_intro', 'true');
        }}
        language={language}
        onStartFirstQuest={() => {
          setIsIntroModalOpen(false);
          localStorage.setItem('eco_has_seen_intro', 'true');
          setActiveTab(activeMissionTab || 'buddy');
        }}
      />

      {/* Level Up Guardian Promotion Modal */}
      {levelUpTier && (
        <LevelUpModal
          isOpen={!!levelUpTier}
          onClose={() => setLevelUpTier(null)}
          newTier={levelUpTier}
          language={language}
          onContinue={() => {
            setLevelUpTier(null);
            setActiveTab('map');
          }}
        />
      )}
    </div>
  );
};

