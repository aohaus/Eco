import React from 'react';
import { 
  Leaf, 
  Flame, 
  Sparkles, 
  Award, 
  BarChart3, 
  CheckSquare, 
  Gauge, 
  BookOpen, 
  Heart,
  Library,
  Gamepad2,
  Compass,
  Home,
  ScrollText,
  Hammer,
  Gift,
  User,
  Radar,
  Globe
} from 'lucide-react';
import { ShatominAvatar } from './ShatominAvatar';
import { Language, translations } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  totalPoints: number;
  currentStreak: number;
  level: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenRoulette?: () => void;
  onOpenTrainerCard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalPoints,
  currentStreak,
  level,
  language,
  onLanguageChange,
  onOpenRoulette,
  onOpenTrainerCard,
}) => {
  const t = translations[language];

  const tabs = [
    { id: 'map', label: t.tabMap, icon: Compass, isQuestMap: true },
    { id: 'explorer', label: language === 'ja' ? '🌍 地球レスキュー' : '🌍 Eco Explorer', icon: Radar, isExplorer: true, isNew: true },
    { id: 'buddy', label: language === 'ja' ? '相棒シャトミン' : 'Buddy', icon: Heart, isBuddy: true },
    { id: 'dex', label: language === 'ja' ? 'エコ図鑑' : 'Eco-Dex', icon: BookOpen },
    { id: 'craft', label: language === 'ja' ? 'クラフト台' : 'Crafting', icon: Hammer },
    { id: 'game', label: t.tabGame, icon: Gamepad2 },
    { id: 'library', label: t.tabLibrary, icon: Library },
    { id: 'habits', label: t.tabHabits, icon: CheckSquare },
    { id: 'dashboard', label: language === 'ja' ? 'ダッシュボード' : 'Dashboard', icon: BarChart3 },
    { id: 'calculator', label: t.tabCalculator, icon: Gauge },
    { id: 'resources', label: t.tabResources, icon: Sparkles },
    { id: 'guides', label: t.tabGuides, icon: ScrollText },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e2d8c7] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title -> Takes user to Title Screen or Map */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => {
              sounds.playPop();
              setActiveTab('start');
            }}
            title={language === 'ja' ? 'スタート画面に戻る' : 'Return to Start Screen'}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#387249] to-[#254b30] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform border border-[#23492e]">
              <Leaf className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
                  {language === 'ja' ? 'エコ大冒険' : 'Eco Quest'}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  シャトミン
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                {language === 'ja' ? '自然とあそぶ環境アドベンチャー' : 'Interactive Green Adventure'}
              </p>
            </div>
          </div>

          {/* Gamification Stats & Language Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Title Screen Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('start');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-[#d6c7b2] text-xs font-bold text-stone-700 transition-colors shadow-2xs"
            >
              <Home className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.titleScreen}</span>
            </button>

            {/* Daily Roulette Button */}
            {onOpenRoulette && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenRoulette();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black shadow-2xs border-b-2 border-amber-600 transition-transform active:translate-y-0.5 cursor-pointer"
                title={language === 'ja' ? 'まいにちのエコルーレットを回す！' : 'Daily Mystery Chest'}
              >
                <Gift className="w-3.5 h-3.5 text-stone-950" />
                <span className="hidden md:inline">{language === 'ja' ? 'ルーレット' : 'Roulette'}</span>
              </button>
            )}

            {/* Trainer Pass Button */}
            {onOpenTrainerCard && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenTrainerCard();
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-black border border-[#d6c7b2] shadow-2xs transition-transform active:translate-y-0.5 cursor-pointer"
                title={language === 'ja' ? '冒険者カード (友達に見せる！)' : 'Trainer Adventure Pass'}
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden md:inline">{language === 'ja' ? '冒険パス' : 'Pass'}</span>
              </button>
            )}

            {/* Streak Counter */}
            <div id="streak-indicator" className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{currentStreak}{language === 'ja' ? '日' : 'd'}</span>
            </div>

            {/* Eco Points & Level */}
            <div id="points-indicator" className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#eaf3ec] border border-[#a8d3af] text-[#22482a] text-xs font-black shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#387249]" />
              <span>Lv.{level}</span>
              <span className="text-[#387249]/40">|</span>
              <span className="text-amber-800">{totalPoints} pt</span>
            </div>

            {/* Top-Right Language Switcher */}
            <div className="flex items-center bg-white border border-[#d6c7b2] rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => {
                  onLanguageChange('ja');
                  sounds.playPop();
                }}
                id="header-lang-ja"
                className={`px-2 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                  language === 'ja'
                    ? 'bg-[#387249] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="日本語に切り替え"
              >
                JA
              </button>
              <button
                onClick={() => {
                  onLanguageChange('en');
                  sounds.playPop();
                }}
                id="header-lang-en"
                className={`px-2 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-[#387249] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Earth-toned, Friendly Game Navigation) */}
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-[#eee5d6]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isBuddy = tab.isBuddy;
            const isQuestMap = tab.isQuestMap;
            const isExplorer = tab.isExplorer;

            return (
              <button
                key={tab.id}
                id={`tab-button-${tab.id}`}
                onClick={() => {
                  sounds.playPop();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isExplorer
                      ? 'bg-cyan-700 text-cyan-50 font-black shadow-xs ring-2 ring-cyan-400/50'
                      : isQuestMap
                      ? 'bg-[#387249] text-white shadow-xs'
                      : isBuddy 
                        ? 'bg-rose-500 text-white font-black shadow-xs'
                        : 'bg-[#387249] text-white shadow-xs'
                    : isExplorer
                      ? 'text-cyan-900 bg-cyan-50/90 hover:bg-cyan-100 border border-cyan-300 font-bold'
                      : isQuestMap
                      ? 'bg-[#eef5ef] text-[#2c5737] hover:bg-[#dfeee1] border border-[#a8d3af]'
                      : isBuddy
                        ? 'text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                        : 'text-stone-700 hover:text-stone-900 bg-white/80 hover:bg-white border border-[#e2d8c7]'
                }`}
              >
                {isBuddy ? (
                  <ShatominAvatar expression={isActive ? 'wink' : 'smile'} size="xs" animate={false} />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span>{tab.label}</span>
                {tab.isNew && !isActive && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-amber-200 text-amber-900 tracking-tighter">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
