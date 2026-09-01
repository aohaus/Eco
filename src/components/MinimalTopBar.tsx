import React, { useState, useEffect } from 'react';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import { Flame, Globe, HelpCircle, MapPin, Clock } from 'lucide-react';

interface MinimalTopBarProps {
  level: number;
  currentExp: number;
  maxExp: number;
  ecoPoints: number;
  streak: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenIntro?: () => void;
  onAvatarClick?: () => void;
}

export const MinimalTopBar: React.FC<MinimalTopBarProps> = ({
  level = 1,
  currentExp = 1250,
  maxExp = 2000,
  ecoPoints = 2850,
  streak = 14,
  language,
  onLanguageChange,
  onOpenIntro,
  onAvatarClick,
}) => {
  const expPercent = Math.min(100, Math.max(0, (currentExp / maxExp) * 100));

  // Live Date and Time without seconds
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      setCurrentDateTime(now.toLocaleDateString(language === 'ja' ? 'ja-JP' : 'en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [language]);

  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-2">
      {/* Top micro bar: Date, Time, and Location (Desa ParkCity, KL) */}
      <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 pb-2 mb-2 border-b border-[#EDE6D8]/60">
        <div className="flex items-center gap-1.5 font-sans">
          <Clock className="w-3 h-3 text-[#275236]" />
          <span>{currentDateTime || 'Tue, Sep 1, 10:48 AM'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-stone-600">
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>Desa ParkCity, KL</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Left: Avatar + Level + Minimal EXP bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              if (onAvatarClick) onAvatarClick();
            }}
            className="w-10 h-10 rounded-full bg-[#F4EFE6] border border-[#E5DEC9] flex items-center justify-center overflow-hidden hover:scale-105 transition-transform shadow-xs cursor-pointer"
            title="Shatomin Profile"
          >
            <span className="text-xl">🌱</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-stone-800 tracking-tight">
                Lv. {level} <span className="font-semibold text-stone-600">Shatomin</span>
              </span>
            </div>

            {/* Micro EXP bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 sm:w-28 h-1.5 bg-[#E6DFC9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#275236] rounded-full transition-all duration-500"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-stone-500 font-medium">
                {currentExp.toLocaleString()} / {maxExp.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Eco Points + Streak + Language Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Eco Points */}
          <div className="flex items-center gap-1.5 text-stone-800">
            <span className="text-[11px] font-semibold text-stone-600 hidden sm:inline">
              Eco Points
            </span>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#275236] inline-block" />
              <span>{ecoPoints.toLocaleString()}</span>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 text-stone-800">
            <span className="text-[11px] font-semibold text-stone-600 hidden sm:inline">
              Streak
            </span>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-amber-800">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}</span>
            </div>
          </div>

          {/* Language switcher button (JP / EN) */}
          <button
            onClick={() => {
              sounds.playPop();
              onLanguageChange(language === 'ja' ? 'en' : 'ja');
            }}
            className="px-2.5 py-1 rounded-full bg-[#F4EFE6] hover:bg-[#EFE8DC] border border-[#E5DEC9] text-[11px] font-bold text-stone-700 transition-colors cursor-pointer flex items-center gap-1"
            title={language === 'ja' ? 'Switch to English' : '日本語に切り替え'}
          >
            <Globe className="w-3 h-3 text-stone-500" />
            <span>{language === 'ja' ? 'EN' : 'JP'}</span>
          </button>

          {/* How to play help */}
          {onOpenIntro && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenIntro();
              }}
              className="p-1.5 rounded-full bg-[#F4EFE6] hover:bg-[#EFE8DC] border border-[#E5DEC9] text-stone-600 transition-colors cursor-pointer"
              title="How to play / 遊び方"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
