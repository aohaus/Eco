import React from 'react';
import { ShatominMascot } from './ShatominMascot';
import { Droplet, Recycle, Sprout, Leaf } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface HomeScreenPatternCProps {
  onStartAdventure: () => void;
  onNavigateToTab: (tab: 'buddy' | 'library' | 'habits' | 'explorer') => void;
  savedWaterToday?: boolean;
  recycledToday?: boolean;
  plantedToday?: boolean;
  onToggleQuest?: (questKey: 'water' | 'recycle' | 'plant') => void;
}

export const HomeScreenPatternC: React.FC<HomeScreenPatternCProps> = ({
  onStartAdventure,
  onNavigateToTab,
  savedWaterToday = false,
  recycledToday = false,
  plantedToday = false,
  onToggleQuest,
}) => {
  const handleQuestClick = (questKey: 'water' | 'recycle' | 'plant') => {
    sounds.playPop();
    if (onToggleQuest) {
      onToggleQuest(questKey);
    }
  };

  const completedCount = [savedWaterToday, recycledToday, plantedToday].filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center min-h-[calc(100vh-140px)]">
      {/* Pattern C: Two-column balanced layout (Left: Eco Adventure & 3 Clean Cards, Right: Big Hero Shatomin) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Section (col-span-7) */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Main Title & Subtitle */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              Eco Adventure
            </h1>
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-md">
              Small steps today, <br className="hidden sm:inline" />
              big change tomorrow.
            </p>
          </div>

          {/* Today's Quest Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-extrabold text-stone-700 tracking-tight">
                Today's Quest
              </span>
              <span className="text-xs font-mono font-bold text-stone-400">
                {completedCount} / 3 Completed
              </span>
            </div>

            {/* 3 Balanced Square/Card Buttons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* Quest 1: Save Water */}
              <button
                onClick={() => handleQuestClick('water')}
                className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                  savedWaterToday
                    ? 'bg-[#EBF3ED] border-[#387249] shadow-xs'
                    : 'bg-[#FCFAF5] hover:bg-white border-[#E7E0D2] hover:border-[#387249]/40'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 ${
                    savedWaterToday
                      ? 'bg-[#387249] text-white'
                      : 'bg-[#F2ECE1] text-[#387249]'
                  }`}
                >
                  <Droplet className="w-5 h-5 fill-current" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-stone-800 whitespace-nowrap">
                  Save Water
                </div>
                <div
                  className={`text-[10px] font-mono font-bold mt-1 ${
                    savedWaterToday ? 'text-[#387249]' : 'text-stone-400'
                  }`}
                >
                  {savedWaterToday ? '1 / 1' : '0 / 1'}
                </div>
              </button>

              {/* Quest 2: Recycle Something */}
              <button
                onClick={() => handleQuestClick('recycle')}
                className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                  recycledToday
                    ? 'bg-[#EBF3ED] border-[#387249] shadow-xs'
                    : 'bg-[#FCFAF5] hover:bg-white border-[#E7E0D2] hover:border-[#387249]/40'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 ${
                    recycledToday
                      ? 'bg-[#387249] text-white'
                      : 'bg-[#F2ECE1] text-[#387249]'
                  }`}
                >
                  <Recycle className="w-5 h-5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-stone-800 whitespace-nowrap">
                  Recycle
                </div>
                <div
                  className={`text-[10px] font-mono font-bold mt-1 ${
                    recycledToday ? 'text-[#387249]' : 'text-stone-400'
                  }`}
                >
                  {recycledToday ? '1 / 1' : '0 / 1'}
                </div>
              </button>

              {/* Quest 3: Plant / Care Something */}
              <button
                onClick={() => handleQuestClick('plant')}
                className={`flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                  plantedToday
                    ? 'bg-[#EBF3ED] border-[#387249] shadow-xs'
                    : 'bg-[#FCFAF5] hover:bg-white border-[#E7E0D2] hover:border-[#387249]/40'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-2 ${
                    plantedToday
                      ? 'bg-[#387249] text-white'
                      : 'bg-[#F2ECE1] text-[#387249]'
                  }`}
                >
                  <Sprout className="w-5 h-5" />
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-stone-800 whitespace-nowrap">
                  Plant
                </div>
                <div
                  className={`text-[10px] font-mono font-bold mt-1 ${
                    plantedToday ? 'text-[#387249]' : 'text-stone-400'
                  }`}
                >
                  {plantedToday ? '1 / 1' : '0 / 1'}
                </div>
              </button>
            </div>
          </div>

          {/* One Primary Action: Start Adventure */}
          <div className="pt-2">
            <button
              onClick={() => {
                sounds.playFanfare();
                confetti({
                  particleCount: 35,
                  spread: 50,
                  origin: { y: 0.7 },
                });
                onStartAdventure();
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#275236] hover:bg-[#1E432B] text-white font-extrabold text-base tracking-wide transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Start Adventure</span>
              <Leaf className="w-5 h-5 fill-white/80 text-white/80" />
            </button>
          </div>
        </div>

        {/* Right Section (col-span-5): Shatomin Hero */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="absolute -top-4 right-10 w-6 h-6 text-[#AEC0A5] opacity-60 pointer-events-none">
            <Leaf className="w-full h-full transform rotate-45" />
          </div>
          <div className="absolute bottom-6 -left-2 w-8 h-8 text-[#AEC0A5] opacity-50 pointer-events-none">
            <Leaf className="w-full h-full transform -rotate-12" />
          </div>

          <ShatominMascot
            size="hero"
            interactive={true}
            onClick={() => {
              sounds.playPop();
              onNavigateToTab('buddy');
            }}
          />
        </div>
      </div>
    </div>
  );
};
