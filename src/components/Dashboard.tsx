import React from 'react';
import { 
  Leaf, 
  Droplets, 
  Trash2, 
  Zap, 
  CheckCircle2, 
  Circle, 
  ArrowUpRight, 
  Award, 
  Calendar,
  Sparkles,
  TreePine,
  ShieldCheck,
  TrendingDown,
  Heart
} from 'lucide-react';
import { EcoHabit, EcoBadge, FootprintScore } from '../types';
import { ShatominAvatar } from './ShatominAvatar';
import { sounds } from '../utils/soundEffects';

interface DashboardProps {
  score: FootprintScore;
  habits: EcoHabit[];
  badges: EcoBadge[];
  onToggleHabit: (habitId: string) => void;
  setActiveTab: (tab: string) => void;
  todayDate: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  score,
  habits,
  badges,
  onToggleHabit,
  setActiveTab,
  todayDate,
}) => {
  // Aggregate impact
  const totalSavedCO2 = habits.reduce((acc, h) => acc + (h.completedDates.length * h.co2SavingsKg), 0);
  const totalSavedWater = habits.reduce((acc, h) => acc + (h.completedDates.length * h.waterSavingsLiters), 0);
  const totalDivertedWaste = habits.reduce((acc, h) => acc + (h.completedDates.length * h.wasteSavedKg), 0);
  const totalSavedEnergy = habits.reduce((acc, h) => acc + (h.completedDates.length * h.energySavedKwh), 0);

  const completedTodayCount = habits.filter(h => h.completedDates.includes(todayDate)).length;
  const unlockedBadgesCount = badges.filter(b => b.unlockedAt !== null).length;

  return (
    <div className="space-y-6">
      {/* Shatomin Welcome & Cheer Banner */}
      <div id="shatomin-dashboard-banner" className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="cursor-pointer bg-white p-2 rounded-2xl border border-emerald-200 shadow-xs hover:scale-105 transition-transform"
            onClick={() => {
              sounds.playShatominSqueak(1);
            }}
            title="シャトミンをなでる！"
          >
            <ShatominAvatar expression="wave" size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                シャトミンのひとこと
              </span>
              <span className="text-xs text-stone-500">Shatomin Partner</span>
            </div>
            <p className="text-sm font-bold text-stone-900 mt-1">
              「今日も地球にいいこと、ナイスショットシャト！バドミントンのように軽やかな暮らしを！」
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('library')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-emerald-900 border border-emerald-200 font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
            title="エコ図書室へ"
          >
            <span>📚 図書室</span>
          </button>

          <button
            onClick={() => setActiveTab('game')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-stone-100 text-amber-900 border border-amber-200 font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
            title="脱出ゲームへ"
          >
            <span>🎮 ゲーム</span>
          </button>

          <button
            onClick={() => setActiveTab('shatomin')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-xs transition-colors whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
            <span>シャトミンの部屋 ❯</span>
          </button>
        </div>
      </div>

      {/* Top Banner & Footprint Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Footprint Highlights Card */}
        <div id="footprint-overview-card" className="lg:col-span-2 bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                Annual Carbon Assessment
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {score.totalTonnes} <span className="text-xl sm:text-2xl font-normal text-emerald-200">tonnes CO₂e/yr</span>
              </h1>
              <p className="text-emerald-100 text-sm max-w-md">
                Status: <span className="font-semibold text-emerald-300">{score.tier}</span> ({score.comparisonToAverage <= 0 ? `${Math.abs(score.comparisonToAverage)}% below` : `${score.comparisonToAverage}% above`} regional average)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3">
              <button
                id="recalculate-footprint-btn"
                onClick={() => setActiveTab('calculator')}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-semibold text-sm transition-all shadow-sm cursor-pointer"
              >
                <span>Refine Footprint</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 rounded-xl px-3.5 py-2">
                <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Equivalent to <strong>{score.treeOffsetNeeded}</strong> trees absorbed/yr</span>
              </div>
            </div>
          </div>

          {/* Quick breakdown bars */}
          <div className="mt-6 pt-6 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-emerald-300">Transport</div>
              <div className="text-lg font-bold text-white">{score.transportTonnes} t</div>
              <div className="w-full bg-emerald-950/70 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(100, (score.transportTonnes / score.totalTonnes) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-emerald-300">Home Energy</div>
              <div className="text-lg font-bold text-white">{score.energyTonnes} t</div>
              <div className="w-full bg-emerald-950/70 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: `${Math.min(100, (score.energyTonnes / score.totalTonnes) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-emerald-300">Food & Diet</div>
              <div className="text-lg font-bold text-white">{score.foodTonnes} t</div>
              <div className="w-full bg-emerald-950/70 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (score.foodTonnes / score.totalTonnes) * 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="text-xs text-emerald-300">Consumption</div>
              <div className="text-lg font-bold text-white">{score.consumptionTonnes} t</div>
              <div className="w-full bg-emerald-950/70 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: `${Math.min(100, (score.consumptionTonnes / score.totalTonnes) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Progress Widget */}
        <div id="today-progress-card" className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Today's Activity
              </span>
              <div className="flex items-center text-xs text-stone-500 font-medium">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {todayDate}
              </div>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-3">
              {completedTodayCount} of {habits.length} Habits Logged
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Keep building your streak by checking off sustainable actions every day.
            </p>

            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Completion</span>
                <span>{Math.round((completedTodayCount / Math.max(1, habits.length)) * 100)}%</span>
              </div>
              <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(completedTodayCount / Math.max(1, habits.length)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Habit Trackers</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>+{completedTodayCount * 15} pts today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Accumulated Impact Counters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            Cumulative Environmental Savings
          </h2>
          <span className="text-xs text-stone-500">Calculated from your verified habits</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{totalSavedCO2.toFixed(1)} <span className="text-sm font-normal text-stone-500">kg</span></div>
            <div className="text-xs font-medium text-stone-600 mt-0.5">CO₂ Emissions Avoided</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{totalSavedWater.toLocaleString()} <span className="text-sm font-normal text-stone-500">L</span></div>
            <div className="text-xs font-medium text-stone-600 mt-0.5">Freshwater Conserved</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{totalDivertedWaste.toFixed(1)} <span className="text-sm font-normal text-stone-500">kg</span></div>
            <div className="text-xs font-medium text-stone-600 mt-0.5">Waste Diverted from Landfill</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-extrabold text-stone-900">{totalSavedEnergy.toFixed(1)} <span className="text-sm font-normal text-stone-500">kWh</span></div>
            <div className="text-xs font-medium text-stone-600 mt-0.5">Electricity Conserved</div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Action Checklist & Milestone Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Quick Checklist */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Today's Eco Checklist</h2>
              <p className="text-xs text-stone-500">Check off actions to boost your daily savings</p>
            </div>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Manage Habits →
            </button>
          </div>

          <div className="space-y-2.5">
            {habits.slice(0, 5).map((habit) => {
              const isCompletedToday = habit.completedDates.includes(todayDate);
              return (
                <div
                  key={habit.id}
                  id={`habit-row-${habit.id}`}
                  onClick={() => onToggleHabit(habit.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isCompletedToday
                      ? 'bg-emerald-50/70 border-emerald-200 text-stone-900'
                      : 'bg-stone-50/70 border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-emerald-600 focus:outline-hidden">
                      {isCompletedToday ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-400" />
                      )}
                    </button>
                    <div>
                      <div className={`text-sm font-semibold ${isCompletedToday ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                        {habit.title}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span>{habit.description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      +{habit.co2SavingsKg} kg CO₂
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Badges */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badges & Trophies
              </h2>
              <span className="text-xs font-medium text-stone-500">
                {unlockedBadgesCount}/{badges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => {
                const isUnlocked = badge.unlockedAt !== null;
                return (
                  <div
                    key={badge.id}
                    id={`badge-card-${badge.id}`}
                    className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-stone-50/50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isUnlocked ? 'bg-amber-500 text-white shadow-xs' : 'bg-stone-200 text-stone-400'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-stone-800 truncate w-full">{badge.title}</div>
                    <div className="text-[10px] text-stone-500 mt-1 line-clamp-2">{badge.requirement}</div>
                    {isUnlocked && (
                      <span className="mt-1.5 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        Unlocked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-center">
            <span className="text-xs text-stone-500">Earn badges by logging daily habits and conserving resources</span>
          </div>
        </div>
      </div>
    </div>
  );
};
