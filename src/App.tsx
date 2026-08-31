import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { Dashboard } from './components/Dashboard';
import { FootprintCalculator } from './components/FootprintCalculator';
import { HabitTracker } from './components/HabitTracker';
import { ResourceMonitor } from './components/ResourceMonitor';
import { EcoGuide } from './components/EcoGuide';
import { EcoLibrary } from './components/EcoLibrary';
import { EcoRunawayGame } from './components/EcoRunawayGame';
import { ShatominRoom } from './components/ShatominRoom';
import { ShatominCompanionWidget } from './components/ShatominCompanionWidget';
import { BuddyScreen } from './components/BuddyScreen';
import { EcoDexScreen } from './components/EcoDexScreen';
import { CraftingBenchScreen } from './components/CraftingBenchScreen';
import { EcoExplorerScreen } from './components/explorer/EcoExplorerScreen';
import { DailyRouletteModal } from './components/DailyRouletteModal';
import { TrainerCardModal } from './components/TrainerCardModal';
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
    return (saved === 'en' || saved === 'ja') ? saved : 'ja';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('eco_language', newLang);
  };

  // Start directly on gamified start screen
  const [activeTab, setActiveTab] = useState<string>('start');

  // Modals for Pokémon GO & Minecraft gamification
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isTrainerPassOpen, setIsTrainerPassOpen] = useState(false);

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

  // Derived score
  const score = calculateFootprint(answers);

  // Derive points, streak, and badges
  const totalCompletedHabitCount = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const totalPoints = habits.reduce((acc, h) => acc + (h.completedDates.length * h.points), 0) + 50 + bonusPoints;
  const level = Math.floor(totalPoints / 100) + 1;

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
    <div className="min-h-screen bg-[#fdfbf7] text-stone-800 flex flex-col relative font-sans selection:bg-amber-200 selection:text-stone-900">
      {/* If we are on Start Screen, render the game-like title entrance screen */}
      {activeTab === 'start' ? (
        <StartScreen
          language={language}
          onLanguageChange={handleLanguageChange}
          onStartQuest={(target = 'map') => setActiveTab(target)}
          totalPoints={totalPoints}
          streak={currentStreak}
        />
      ) : (
        <>
          {/* App Header with Quest Navigation, Roulette and Trainer Pass */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            totalPoints={totalPoints}
            currentStreak={currentStreak}
            level={level}
            language={language}
            onLanguageChange={handleLanguageChange}
            onOpenRoulette={() => setIsRouletteOpen(true)}
            onOpenTrainerCard={() => setIsTrainerPassOpen(true)}
          />

          {/* Achievement Banner Notification */}
          {unlockedToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-stone-950 font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce border-2 border-amber-600">
              <Award className="w-5 h-5 text-stone-950" />
              <span className="text-sm">{unlockedToast}</span>
              <button
                onClick={() => setUnlockedToast(null)}
                className="ml-2 text-stone-900 hover:text-stone-950 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Floating Companion Widget (Visible across tabs except in room where Shatomin is in center) */}
          {activeTab !== 'shatomin' && activeTab !== 'buddy' && (
            <ShatominCompanionWidget
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              streak={currentStreak}
              totalPoints={totalPoints}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* 1. World Map Adventure Hub */}
            {activeTab === 'map' && (
              <WorldMapScreen
                language={language}
                onNavigate={(tab) => setActiveTab(tab)}
                totalPoints={totalPoints}
                streak={currentStreak}
                onAddPoints={handleAddBonusPoints}
                onOpenRoulette={() => setIsRouletteOpen(true)}
                onOpenTrainerCard={() => setIsTrainerPassOpen(true)}
              />
            )}

            {/* 1.5. Eco Explorer: Earth Rescue Missions (Sci-Fi Global Rescue) */}
            {activeTab === 'explorer' && (
              <EcoExplorerScreen
                language={language}
                onAddPoints={handleAddBonusPoints}
                onAddExp={(exp) => handleAddBonusPoints(exp)}
                onReturnToAppMap={() => setActiveTab('map')}
              />
            )}

            {/* 2. Buddy Shatomin Screen (Pokémon GO Style Buddy Haven) */}
            {activeTab === 'buddy' && (
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
            )}

            {/* 3. Eco-Dex Screen (Pokémon GO Style Creature Collection) */}
            {activeTab === 'dex' && (
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
            )}

            {/* 4. Crafting Bench Screen (Minecraft Style Voxel Crafting) */}
            {activeTab === 'craft' && (
              <CraftingBenchScreen
                recipes={recipes}
                materials={materials}
                onCraft={handleCraftRecipe}
                language={language}
                setActiveTab={setActiveTab}
              />
            )}

            {/* 5. Dashboard */}
            {activeTab === 'dashboard' && (
              <Dashboard
                score={score}
                habits={habits}
                badges={badges}
                onToggleHabit={handleToggleHabit}
                setActiveTab={setActiveTab}
                todayDate={todayDate}
              />
            )}

            {/* 6. Footprint Calculator */}
            {activeTab === 'calculator' && (
              <FootprintCalculator
                answers={answers}
                onSaveAnswers={setAnswers}
                currentScore={score}
              />
            )}

            {/* 7. Habit Tracker */}
            {activeTab === 'habits' && (
              <HabitTracker
                habits={habits}
                onToggleHabit={handleToggleHabit}
                onAddHabit={handleAddHabit}
                todayDate={todayDate}
              />
            )}

            {/* 8. Resource Monitor */}
            {activeTab === 'resources' && (
              <ResourceMonitor
                logs={resourceLogs}
                onAddLog={handleAddResourceLog}
                onDeleteLog={handleDeleteResourceLog}
              />
            )}

            {/* 9. Eco Guides */}
            {activeTab === 'guides' && (
              <EcoGuide />
            )}

            {/* 10. Eco Library */}
            {activeTab === 'library' && (
              <EcoLibrary
                onAddPoints={handleAddBonusPoints}
                setActiveTab={setActiveTab}
                language={language}
              />
            )}

            {/* 11. Eco Runaway Game */}
            {activeTab === 'game' && (
              <EcoRunawayGame
                onAddPoints={handleAddBonusPoints}
                setActiveTab={setActiveTab}
                language={language}
              />
            )}

            {/* 12. Shatomin's Cozy Room */}
            {activeTab === 'shatomin' && (
              <ShatominRoom
                totalPoints={totalPoints}
                currentStreak={currentStreak}
                onAddPoints={handleAddBonusPoints}
                setActiveTab={setActiveTab}
              />
            )}
          </main>

          {/* Daily Roulette Modal */}
          <DailyRouletteModal
            isOpen={isRouletteOpen}
            onClose={() => setIsRouletteOpen(false)}
            streak={currentStreak}
            onClaimReward={handleClaimRouletteReward}
            language={language}
          />

          {/* Trainer Adventure Pass Modal */}
          <TrainerCardModal
            isOpen={isTrainerPassOpen}
            onClose={() => setIsTrainerPassOpen(false)}
            trainerProfile={trainerProfile}
            onUpdateProfile={setTrainerProfile}
            buddyData={buddyData}
            creatures={creatures}
            recipes={recipes}
            totalPoints={totalPoints}
            streak={currentStreak}
            level={level}
            language={language}
          />

          {/* Footer */}
          <footer className="border-t border-[#e2d8c7] bg-[#f7f3ec] py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#387249]">Eco with シャトミン</span>
                <span>— {language === 'ja' ? '楽しく学べるエコアドベンチャーRPG' : 'Gamified Eco Adventure & Sustainability'}</span>
              </div>
              <div className="text-stone-500">
                {language === 'ja' ? 'IPCC & GHG Protocol 基準準拠' : 'Calculations aligned with IPCC & GHG Protocol standards'}
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

