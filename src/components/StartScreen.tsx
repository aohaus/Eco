import React, { useState } from 'react';
import { 
  Play, 
  MapPin, 
  Sparkles, 
  Award, 
  Volume2, 
  VolumeX, 
  Globe, 
  Flame, 
  Leaf, 
  Compass,
  ArrowRight,
  BookOpen,
  Gamepad2,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { ShatominPlush } from './ShatominPlush';
import { Language, translations } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface StartScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onStartQuest: (targetTab?: string) => void;
  totalPoints: number;
  streak: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  language,
  onLanguageChange,
  onStartQuest,
  totalPoints,
  streak,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const t = translations[language];

  // Calculate Level & EXP based on total points
  const playerLevel = Math.max(1, Math.floor(totalPoints / 150) + 1);
  const currentLevelExp = totalPoints % 150;
  const nextLevelExp = 150;
  const expProgress = Math.min(100, Math.round((currentLevelExp / nextLevelExp) * 100));

  const getRankName = () => {
    if (playerLevel >= 10) return t.rankMaster;
    if (playerLevel >= 7) return t.rankChampion;
    if (playerLevel >= 4) return t.rankRanger;
    if (playerLevel >= 2) return t.rankGuardian;
    return t.rankNovice;
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (newState) {
      sounds.playSparkle();
    }
  };

  return (
    <div className="relative min-h-[85vh] rounded-3xl overflow-hidden bg-gradient-to-b from-[#fdfbf7] via-[#f7f3ea] to-[#ede3d4] border-2 border-[#d6c7b2] shadow-md p-6 sm:p-10 flex flex-col justify-between text-stone-800">
      {/* Decorative Warm Earth Pattern Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#4a7c59_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* Top Utility Bar (Language Selector & Sound Switch) */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#e5dac9] pb-4">
        {/* Earth Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4ebe1] border border-[#d6c7b2] text-xs font-bold text-[#4a5d4e]">
          <Leaf className="w-3.5 h-3.5 text-[#387249]" />
          <span>EARTH-FRIENDLY RPG</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            id="sound-toggle-btn"
            className="p-2 rounded-xl bg-white/90 hover:bg-white border border-[#d6c7b2] text-stone-700 hover:text-stone-900 transition-colors shadow-xs"
            title={soundEnabled ? t.soundOn : t.soundOff}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#387249]" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-white/90 border border-[#d6c7b2] rounded-xl p-1 shadow-xs">
            <button
              onClick={() => {
                onLanguageChange('ja');
                sounds.playPop();
              }}
              id="lang-ja-btn"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'ja'
                  ? 'bg-[#387249] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇯🇵 日本語
            </button>
            <button
              onClick={() => {
                onLanguageChange('en');
                sounds.playPop();
              }}
              id="lang-en-btn"
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-[#387249] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      {/* Main Title Hero Section */}
      <div className="relative z-10 my-auto py-6 sm:py-8 flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto w-full">
        {/* Left Side: Title & Story Intro */}
        <div className="text-center lg:text-left space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8efe9] text-[#2d5a39] text-xs font-extrabold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === 'ja' ? '自然とあそぶ、毎日エコアドベンチャー' : 'Learn, Play & Protect Our Planet'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#2c2621] tracking-tight leading-tight">
            {language === 'ja' ? (
              <>
                シャトミンと<br className="hidden sm:inline" />
                <span className="text-[#387249] underline decoration-[#c9dfcf] decoration-wavy">地球のエコ大冒険</span>
              </>
            ) : (
              <>
                Shatomin&apos;s<br />
                <span className="text-[#387249]">Eco Adventure</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t.heroStory}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={() => {
                sounds.playFanfare();
                onStartQuest('explorer');
              }}
              id="start-explorer-main-btn"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-black text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group border-b-4 border-teal-900 cursor-pointer"
            >
              <Globe className="w-6 h-6 text-cyan-200 animate-spin [animation-duration:15s]" />
              <span>{language === 'ja' ? '🌍 地球レスキューへ出撃！' : '🌍 Launch Earth Rescue!'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                sounds.playPop();
                onStartQuest('map');
              }}
              id="start-quest-main-btn"
              className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-gradient-to-r from-[#387249] to-[#2d5a39] hover:from-[#2e603d] hover:to-[#22452b] text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-[#1e3f27]"
            >
              <Compass className="w-5 h-5" />
              <span>{t.startQuest}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Mascot & Player Status Card */}
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          {/* Mascot Display with Animated Speech */}
          <div className="relative group">
            <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-3xl bg-gradient-to-br from-amber-50 to-[#dce9df] border-2 border-[#c5d8c9] flex items-center justify-center p-4 shadow-md relative overflow-hidden">
              {/* Sunbeam animation background */}
              <div className="absolute inset-0 opacity-20 bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-amber-200 animate-spin [animation-duration:20s]" />
              
              <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                <ShatominPlush expression="sparkle" size="lg" mood="sparkle" />
              </div>
            </div>

            {/* Floating Speech Bubble */}
            <div className="absolute -top-3 -right-2 sm:-right-4 bg-white px-3.5 py-1.5 rounded-2xl border-2 border-[#387249] shadow-sm text-xs font-black text-[#2c2621] animate-bounce">
              {language === 'ja' ? '一緒にエコしようシャト！✨' : "Let's save the earth! 🌱"}
            </div>
          </div>

          {/* Quick Player Stat Bar */}
          <div className="w-full max-w-xs bg-white/95 rounded-2xl p-4 border border-[#d6c7b2] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-stone-700">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{t.level} {playerLevel}</span>
                <span className="text-[#387249] font-extrabold font-mono">[{getRankName()}]</span>
              </span>
              <span className="text-amber-700 font-extrabold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {totalPoints} pts
              </span>
            </div>

            {/* EXP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-stone-500">
                <span>{t.exp}</span>
                <span>{currentLevelExp} / {nextLevelExp}</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-[#387249] rounded-full transition-all duration-500"
                  style={{ width: `${expProgress}%` }}
                />
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-xs text-stone-600 border-t border-stone-100">
              <span className="flex items-center gap-1 font-semibold text-orange-700">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                {streak} {t.streakDays}
              </span>
              <button
                onClick={() => {
                  sounds.playPop();
                  onStartQuest('shatomin');
                }}
                className="text-[11px] font-bold text-[#387249] hover:underline flex items-center gap-0.5"
              >
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                {t.openRoom} ❯
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area Highlights Showcase */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#e5dac9]">
        <div 
          onClick={() => {
            sounds.playSparkle();
            onStartQuest('library');
          }}
          className="p-3 bg-white/80 hover:bg-white rounded-xl border border-[#d6c7b2] hover:border-[#387249] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900">{t.tabLibrary}</span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">{language === 'ja' ? '絵本＆クイズで学ぶ' : 'Illustrated books & quiz'}</p>
        </div>

        <div 
          onClick={() => {
            sounds.playSparkle();
            onStartQuest('game');
          }}
          className="p-3 bg-white/80 hover:bg-white rounded-xl border border-[#d6c7b2] hover:border-amber-500 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900">{t.tabGame}</span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">{language === 'ja' ? '障害物を避けてラン！' : 'Dodge hazards & run'}</p>
        </div>

        <div 
          onClick={() => {
            sounds.playSparkle();
            onStartQuest('habits');
          }}
          className="p-3 bg-white/80 hover:bg-white rounded-xl border border-[#d6c7b2] hover:border-[#387249] transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900">{t.tabHabits}</span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">{language === 'ja' ? '今日の行動をチェック' : 'Track daily actions'}</p>
        </div>

        <div 
          onClick={() => {
            sounds.playSparkle();
            onStartQuest('calculator');
          }}
          className="p-3 bg-white/80 hover:bg-white rounded-xl border border-[#d6c7b2] hover:border-amber-600 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-sky-700 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-stone-900">{t.tabCalculator}</span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">{language === 'ja' ? 'CO₂排出量を計算' : 'Calculate carbon footprint'}</p>
        </div>
      </div>
    </div>
  );
};
