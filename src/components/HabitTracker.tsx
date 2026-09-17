import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Flame, 
  Droplets, 
  Zap, 
  Car, 
  Utensils, 
  ShoppingBag, 
  Sparkles,
  X,
  CheckCircle2,
  BookmarkPlus
} from 'lucide-react';
import { EcoHabit, EcoCategory } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface HabitTrackerProps {
  habits: EcoHabit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (newHabit: Omit<EcoHabit, 'id' | 'completedDates' | 'streak'>) => void;
  todayDate: string;
}

// 100% Touch-First: Preset Catalog of Realistic Daily Eco Habits
interface PresetHabit {
  title: string;
  category: EcoCategory;
  description: string;
  emoji: string;
  co2SavingsKg: number;
  waterSavingsLiters: number;
  wasteSavedKg: number;
  energySavedKwh: number;
  points: number;
}

const PRESET_HABIT_CATALOG: PresetHabit[] = [
  // Water
  {
    title: 'マイボトルを持参して出かける',
    category: 'water',
    description: 'ペットボトルを買わずに、お気に入りの水筒やタンブラーで水分補給',
    emoji: '💧',
    co2SavingsKg: 0.3,
    waterSavingsLiters: 15,
    wasteSavedKg: 0.05,
    energySavedKwh: 0,
    points: 20,
  },
  {
    title: 'シャワー時間を3分短縮する',
    category: 'water',
    description: '出しっぱなしを防いで、大切な水資源と給湯エネルギーを節約',
    emoji: '🚿',
    co2SavingsKg: 0.5,
    waterSavingsLiters: 36,
    wasteSavedKg: 0,
    energySavedKwh: 1.2,
    points: 25,
  },
  // Energy
  {
    title: '使っていない部屋の照明・主電源オフ',
    category: 'energy',
    description: 'こまめな消灯と待機電力カットで、無駄な電気消費をストップ',
    emoji: '💡',
    co2SavingsKg: 0.4,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 0.8,
    points: 20,
  },
  {
    title: 'エアコンを1℃控えめに調整する',
    category: 'energy',
    description: '夏は28℃、冬は20℃を目安に設定し、サーキュレーターや衣類で快適に',
    emoji: '🍃',
    co2SavingsKg: 0.6,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 1.5,
    points: 25,
  },
  // Transport
  {
    title: 'エレベーターの代わりに階段を使う',
    category: 'transport',
    description: '健康にも地球にも優しい！3階以内なら階段を使って電気を節約',
    emoji: '🪜',
    co2SavingsKg: 0.2,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 0.3,
    points: 20,
  },
  {
    title: '車を使わず徒歩・自転車で移動する',
    category: 'transport',
    description: '近所のお買い物や移動は、クリーンなペダルと足腰を使ってゼロエミッション',
    emoji: '🚲',
    co2SavingsKg: 1.2,
    waterSavingsLiters: 0,
    wasteSavedKg: 0,
    energySavedKwh: 0,
    points: 30,
  },
  // Food
  {
    title: 'ご飯を残さず美味しく完食（食品ロスゼロ）',
    category: 'food',
    description: '食べ切れる量だけ取り分けて、生ごみと廃棄エネルギーを削減',
    emoji: '🍱',
    co2SavingsKg: 0.8,
    waterSavingsLiters: 50,
    wasteSavedKg: 0.3,
    energySavedKwh: 0.2,
    points: 25,
  },
  {
    title: '地元産（地産地消）の旬の野菜・食材を選ぶ',
    category: 'food',
    description: '長距離輸送（フードマイレージ）を減らし、地域の新鮮な恵みを応援',
    emoji: '🥬',
    co2SavingsKg: 0.5,
    waterSavingsLiters: 10,
    wasteSavedKg: 0,
    energySavedKwh: 0.5,
    points: 20,
  },
  // Consumption & Waste
  {
    title: 'マイバッグを持参しレジ袋を辞退する',
    category: 'consumption',
    description: '使い捨てプラスチックを断り、持続可能なエコショッピングを実践',
    emoji: '🛍️',
    co2SavingsKg: 0.1,
    waterSavingsLiters: 0,
    wasteSavedKg: 0.02,
    energySavedKwh: 0,
    points: 15,
  },
  {
    title: 'プラスチックと資源ごみをしっかり分別する',
    category: 'consumption',
    description: '軽くすすいで資源としてリサイクルステーションへ届ける',
    emoji: '♻️',
    co2SavingsKg: 0.4,
    waterSavingsLiters: 0,
    wasteSavedKg: 0.4,
    energySavedKwh: 0.3,
    points: 20,
  },
];

const CATEGORY_TABS: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'すべて', icon: '✨' },
  { id: 'water', label: '水・給湯', icon: '💧' },
  { id: 'energy', label: 'エネルギー', icon: '⚡' },
  { id: 'transport', label: '移動・階段', icon: '🚲' },
  { id: 'food', label: '食事・ロス', icon: '🥗' },
  { id: 'consumption', label: 'ごみ・分別', icon: '🛍️' },
];

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  todayDate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogCategory, setCatalogCategory] = useState<string>('all');

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayDate)).length;
  const totalHabitsCount = habits.length;

  const handleToggle = (id: string, isCompleted: boolean) => {
    sounds.playPop();
    if (!isCompleted) {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.75 },
      });
    }
    onToggleHabit(id);
  };

  // 100% Touch-First: Add preset with a single tap
  const handleSelectPreset = (preset: PresetHabit) => {
    sounds.playFanfare();
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.6 },
    });

    onAddHabit({
      title: preset.title,
      category: preset.category,
      description: preset.description,
      co2SavingsKg: preset.co2SavingsKg,
      waterSavingsLiters: preset.waterSavingsLiters,
      wasteSavedKg: preset.wasteSavedKg,
      energySavedKwh: preset.energySavedKwh,
      points: preset.points,
    });
  };

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const filteredCatalog = catalogCategory === 'all'
    ? PRESET_HABIT_CATALOG
    : PRESET_HABIT_CATALOG.filter((p) => p.category === catalogCategory);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 select-none font-sans">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E8E1D2]/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Daily Habits
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-normal mt-1">
            キーボード入力ゼロ！毎日のエコ習慣をワンタップで記録しましょう。
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Badge */}
          <div className="bg-[#FAF7F0] border border-[#E7E0D2] px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold text-stone-700">
            <span className="w-2 h-2 rounded-full bg-[#275236]" />
            <span>
              {completedTodayCount} / {totalHabitsCount} 完了
            </span>
          </div>

          {/* Add Habit CTA (Opens Touch-First Catalog) */}
          <button
            onClick={() => {
              sounds.playPop();
              setShowCatalogModal(true);
            }}
            className="min-h-[42px] px-4 py-2 rounded-2xl bg-[#275236] hover:bg-[#1E432B] active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>習慣カタログから追加</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sounds.playPop();
              setSelectedCategory(cat.id);
            }}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#275236] text-white border-[#275236] shadow-xs'
                : 'bg-white text-stone-700 border-[#E7E0D2] hover:bg-[#F4EFE6]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Habit Cards List (100% Touch-Friendly Targets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {filteredHabits.map((habit) => {
          const isDone = habit.completedDates.includes(todayDate);

          return (
            <div
              key={habit.id}
              onClick={() => handleToggle(habit.id, isDone)}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                isDone
                  ? 'bg-[#EBF3ED] border-[#387249] shadow-xs'
                  : 'bg-[#FCFAF5] hover:bg-white border-[#E7E0D2] hover:border-[#387249]/40'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {/* Category Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isDone
                      ? 'bg-[#275236] text-white'
                      : 'bg-[#F2ECE1] text-[#275236]'
                  }`}
                >
                  {habit.category === 'water' && <Droplets className="w-5 h-5" />}
                  {habit.category === 'energy' && <Zap className="w-5 h-5" />}
                  {habit.category === 'transport' && <Car className="w-5 h-5" />}
                  {habit.category === 'food' && <Utensils className="w-5 h-5" />}
                  {habit.category === 'consumption' && <ShoppingBag className="w-5 h-5" />}
                </div>

                {/* Habit Details */}
                <div>
                  <h3
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      isDone ? 'text-stone-900 line-through opacity-80' : 'text-stone-900'
                    }`}
                  >
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-medium text-stone-500">
                    <span className="font-mono font-bold text-[#275236]">+{habit.points} pts</span>
                    <span>•</span>
                    <span>-{habit.co2SavingsKg} kg CO₂</span>
                    {habit.streak > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-0.5 font-bold text-amber-700">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {habit.streak}日連続
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Check Action Button */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  isDone
                    ? 'bg-[#275236] text-white shadow-xs'
                    : 'border-2 border-[#DCD5C5] text-transparent group-hover:border-[#275236]'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Touch-First Eco Action Catalog Modal (Zero Keyboard!) */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] border border-[#E7E0D2] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#E7E0D2]">
              <div>
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <span>🌿</span>
                  <span>エコ習慣カタログ</span>
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  気になるアクションをタップするだけで、マイ習慣に追加されます。
                </p>
              </div>
              <button
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Catalog Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sounds.playPop();
                    setCatalogCategory(cat.id);
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    catalogCategory === cat.id
                      ? 'bg-[#275236] text-white border-[#275236]'
                      : 'bg-white text-stone-700 border-[#E7E0D2]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Preset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-1">
              {filteredCatalog.map((preset, idx) => {
                const alreadyAdded = habits.some((h) => h.title === preset.title);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!alreadyAdded) {
                        handleSelectPreset(preset);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2 select-none ${
                      alreadyAdded
                        ? 'bg-[#EBF3ED]/70 border-[#387249]/50 opacity-80 cursor-default'
                        : 'bg-white hover:bg-[#F9F6EE] border-[#E7E0D2] hover:border-[#275236] shadow-xs cursor-pointer active:scale-98'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-2xl shrink-0 p-1 bg-[#FAF7F0] rounded-xl border border-[#E7E0D2]">
                        {preset.emoji}
                      </span>
                      <div className="space-y-0.5">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 leading-snug">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                          {preset.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#E7E0D2]/50 text-[11px]">
                      <span className="font-mono font-bold text-[#275236]">
                        +{preset.points} pts
                      </span>
                      {alreadyAdded ? (
                        <span className="text-[10px] font-bold text-[#275236] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>追加済み</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-xl bg-[#275236] text-white text-[10px] font-bold flex items-center gap-1">
                          <Plus className="w-3 h-3" />
                          <span>追加する</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-[#E7E0D2] flex justify-end shrink-0">
              <button
                onClick={() => setShowCatalogModal(false)}
                className="px-5 py-2 rounded-2xl bg-[#FAF7F0] hover:bg-[#F2ECE1] border border-[#E7E0D2] text-xs font-bold text-stone-700 cursor-pointer"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
