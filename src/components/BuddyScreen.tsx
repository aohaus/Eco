import React, { useState } from 'react';
import { ShatominPlush } from './ShatominPlush';
import { ShatominAvatar } from './ShatominAvatar';
import { BuddyData, TrainerProfile } from '../types/gameTypes';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  Award, 
  Camera, 
  Zap, 
  ChevronRight, 
  Smile, 
  Gift, 
  RotateCcw,
  Star,
  CheckCircle,
  Share2
} from 'lucide-react';

interface BuddyScreenProps {
  buddyData: BuddyData;
  onUpdateBuddy: (data: BuddyData) => void;
  trainerProfile: TrainerProfile;
  totalPoints: number;
  streak: number;
  level: number;
  language: Language;
  onAddPoints: (points: number, reason: string) => void;
  setActiveTab: (tab: string) => void;
}

const FORTUNES_JA = [
  { rank: '大大吉 🌟', message: '今日は太陽光パワー全開！新しいエコ習慣を始めると運気最高潮シャト！', bonus: 50 },
  { rank: '大吉 🍃', message: 'マイボトルを持って出かけるとラッキーな出会いがあるかも！', bonus: 30 },
  { rank: '中吉 💧', message: '蛇口をこまめに閉めて水滴の妖精ポチョンとお友達になろう！', bonus: 20 },
  { rank: '吉 🌻', message: 'ベランダやお庭の植物に優しく挨拶すると元気がもらえるシャト！', bonus: 15 },
];

const FORTUNES_EN = [
  { rank: 'Super Lucky 🌟', message: 'Solar energy at maximum power! Starting a new green habit today brings great joy!', bonus: 50 },
  { rank: 'Great Luck 🍃', message: 'Carrying your reusable bottle brings lucky encounters today!', bonus: 30 },
  { rank: 'Good Luck 💧', message: 'Turn off the tap gently and make friends with Dropie the water sprite!', bonus: 20 },
  { rank: 'Lucky 🌻', message: 'Watering plants and saying hello brings peaceful green energy!', bonus: 15 },
];

export const BuddyScreen: React.FC<BuddyScreenProps> = ({
  buddyData,
  onUpdateBuddy,
  trainerProfile,
  totalPoints,
  streak,
  level,
  language,
  onAddPoints,
  setActiveTab,
}) => {
  const [expression, setExpression] = useState<'smile' | 'wink' | 'love' | 'excited'>('smile');
  const [heartParticles, setHeartParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [fortuneResult, setFortuneResult] = useState<{ rank: string; message: string; bonus: number } | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isShuttleCatching, setIsShuttleCatching] = useState(false);

  // Buddy ranks
  const getBuddyRankInfo = (rank: number) => {
    switch (rank) {
      case 4:
        return {
          titleJa: '💎 最高の相棒 (Best Buddy)',
          titleEn: '💎 Best Buddy',
          badgeColor: 'from-amber-400 to-yellow-500 text-stone-950',
          perkJa: 'CPブースト発動！＆ 黄金のリボンを装着！',
          perkEn: 'CP Boost active & wearing the Golden Best Buddy ribbon!',
        };
      case 3:
        return {
          titleJa: '🥇 ウルトラ相棒 (Ultra Buddy)',
          titleEn: '🥇 Ultra Buddy',
          badgeColor: 'from-purple-500 to-indigo-600 text-white',
          perkJa: '珍しいエコ精霊の居場所を教えてくれる！',
          perkEn: 'Alerts you to nearby rare Eco Creatures in Eco-Dex!',
        };
      case 2:
        return {
          titleJa: '🥈 グレート相棒 (Great Buddy)',
          titleEn: '🥈 Great Buddy',
          badgeColor: 'from-blue-500 to-cyan-600 text-white',
          perkJa: '冒険中に落ちているクラフト素材を拾ってくる！',
          perkEn: 'Brings gifts of crafting materials found during runs!',
        };
      default:
        return {
          titleJa: '🥉 はじめての相棒 (Good Buddy)',
          titleEn: '🥉 Good Buddy',
          badgeColor: 'from-emerald-500 to-teal-600 text-white',
          perkJa: 'いつもあなたのそばを元気に走るよ！',
          perkEn: 'Walks beside you across the adventure map!',
        };
    }
  };

  const currentRank = getBuddyRankInfo(buddyData.buddyRank);

  // Spawn floating heart particles
  const triggerHearts = (count = 3) => {
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 30,
    }));
    setHeartParticles((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHeartParticles([]);
    }, 1500);
  };

  // 1. Petting Shatomin (なでなで)
  const handlePet = () => {
    sounds.playHeartPing();
    setExpression('love');
    triggerHearts(5);

    const newAffection = Math.min(100, buddyData.affection + 4);
    let newRank = buddyData.buddyRank;
    if (newAffection >= 100 && newRank < 4) newRank = 4;
    else if (newAffection >= 75 && newRank < 3) newRank = 3;
    else if (newAffection >= 40 && newRank < 2) newRank = 2;

    if (newRank > buddyData.buddyRank) {
      sounds.playFanfare();
      confetti({ particleCount: 60, spread: 70 });
      setActionMessage(language === 'ja' ? '🎉 なかよし度ランクアップ！相棒ランクが上がったシャト！' : '🎉 Buddy Rank Up! Affection reached a new peak!');
    } else {
      setActionMessage(language === 'ja' ? 'シャトミン「なでてくれて嬉しいシャト！きもちいい〜❤️」 (+4 なかよし度)' : 'Shatomin loved the headpats! ❤️ (+4 Affection)');
    }

    onUpdateBuddy({
      ...buddyData,
      affection: newAffection,
      buddyRank: newRank,
      todayPetCount: buddyData.todayPetCount + 1,
      totalInteractions: buddyData.totalInteractions + 1,
    });

    setTimeout(() => setExpression('smile'), 1800);
  };

  // 2. Feeding Berry / Sunflower Seeds (ひまわりのタネをあげる)
  const handleFeed = () => {
    sounds.playNomNom();
    setExpression('excited');
    triggerHearts(6);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });

    const newAffection = Math.min(100, buddyData.affection + 6);
    let newRank = buddyData.buddyRank;
    if (newAffection >= 100 && newRank < 4) newRank = 4;
    else if (newAffection >= 75 && newRank < 3) newRank = 3;
    else if (newAffection >= 40 && newRank < 2) newRank = 2;

    setActionMessage(
      language === 'ja' 
        ? 'もぐもぐ…！「おいしいシャト！元気モリモリになったシャト！」 (+6 なかよし度 & +15 EXP)' 
        : 'Nom nom nom! "Delicious sunflower berry! I feel super energized!" (+6 Affection & +15 EXP)'
    );

    onAddPoints(15, '相棒におやつをあげた');

    onUpdateBuddy({
      ...buddyData,
      affection: newAffection,
      buddyRank: newRank,
      todayFeedCount: buddyData.todayFeedCount + 1,
      totalInteractions: buddyData.totalInteractions + 1,
    });

    setTimeout(() => setExpression('smile'), 2000);
  };

  // 3. Play Shuttlecock Toss (シャトルキャッチごっこ)
  const handlePlayCatch = () => {
    if (isShuttleCatching) return;
    setIsShuttleCatching(true);
    sounds.playShuttleSmash();
    setExpression('excited');

    setTimeout(() => {
      sounds.playPowerUp();
      triggerHearts(8);
      setIsShuttleCatching(false);
      
      const newAffection = Math.min(100, buddyData.affection + 8);
      onAddPoints(25, '相棒とシャトルであそんだ');

      setActionMessage(
        language === 'ja'
          ? 'ナイススマッシュ！🏸 シャトミンとラリーが続いたシャト！ (+8 なかよし度 & +25 EXP)'
          : 'Nice smash! 🏸 You rallied back and forth with Shatomin! (+8 Affection & +25 EXP)'
      );

      onUpdateBuddy({
        ...buddyData,
        affection: newAffection,
        todayPlayCount: buddyData.todayPlayCount + 1,
        totalInteractions: buddyData.totalInteractions + 1,
      });

      setTimeout(() => setExpression('smile'), 2000);
    }, 800);
  };

  // 4. Daily Fortune (おみくじ)
  const handleDrawFortune = () => {
    sounds.playChestOpen();
    const list = language === 'ja' ? FORTUNES_JA : FORTUNES_EN;
    const randomF = list[Math.floor(Math.random() * list.length)];
    setFortuneResult(randomF);
    onAddPoints(randomF.bonus, '毎日のおみくじボーナス');
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div id="buddy-screen-root" className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2e5d3c] via-[#387249] to-[#254d31] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border-2 border-[#1f3f27]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-emerald-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ja' ? '相棒システム (Pokémon GO スタイル)' : 'Buddy System & Petting'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'ja' ? '相棒シャトミンとあそぼう！' : 'Play with Buddy Shatomin!'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              {language === 'ja'
                ? 'なでたり、きのみをあげたり、シャトルで遊んで「なかよし度」をアップ！最高の相棒になると特別なご褒美がもらえるよ！'
                : 'Pet, feed sunflower berries, and play shuttle toss to increase your Buddy Affection meter! Reach Best Buddy to unlock exclusive rewards!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:translate-y-0.5 text-stone-950 font-black text-xs shadow-md border-b-4 border-amber-600 transition-transform"
            >
              <Camera className="w-4 h-4" />
              <span>{language === 'ja' ? '📸 相棒と記念さつえい' : '📸 Buddy Photo Card'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Buddy Stage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Interactive Mascot Stage */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#e2d8c7] shadow-sm relative flex flex-col items-center justify-between min-h-[460px] overflow-hidden">
          {/* Top Rank Badge */}
          <div className="w-full flex items-center justify-between gap-2 border-b border-[#f0e8dc] pb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r ${currentRank.badgeColor} shadow-2xs`}>
                {language === 'ja' ? currentRank.titleJa : currentRank.titleEn}
              </span>
              {buddyData.buddyRank === 4 && (
                <span className="text-xs font-extrabold text-amber-600 animate-pulse flex items-center gap-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  {language === 'ja' ? 'CPブースト中！' : 'CP Boosted!'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{buddyData.affection} / 100</span>
            </div>
          </div>

          {/* Floating Action Message Banner */}
          {actionMessage && (
            <div className="my-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs font-bold animate-fadeIn shadow-2xs text-center max-w-md">
              {actionMessage}
            </div>
          )}

          {/* Interactive Mascot Stage with Particles */}
          <div className="relative my-4 flex flex-col items-center justify-center">
            {/* Heart particles */}
            {heartParticles.map((h) => (
              <div
                key={h.id}
                style={{ top: `${h.y}%`, left: `${h.x}%` }}
                className="absolute text-2xl animate-bounce pointer-events-none z-30"
              >
                ❤️
              </div>
            ))}

            {/* Shuttle toss in flight animation */}
            {isShuttleCatching && (
              <div className="absolute -top-6 text-3xl animate-spin z-20">
                🏸
              </div>
            )}

            {/* Shatomin Plush / Avatar */}
            <div
              onClick={handlePet}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95 relative group select-none p-4"
              title={language === 'ja' ? 'クリックしてなでなでするシャト！' : 'Click to pet Shatomin!'}
            >
              <ShatominPlush expression={expression} size="xl" />
              
              {/* Petting prompt tooltip */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-stone-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {language === 'ja' ? '🖐️ クリックでなでなで！' : '🖐️ Click to pet!'}
              </div>
            </div>

            <div className="mt-2 text-center">
              <div className="text-sm font-extrabold text-stone-900">
                {language === 'ja' ? 'シャトミン (相棒)' : 'Shatomin (Buddy)'}
              </div>
              <div className="text-xs text-stone-500">
                {language === 'ja' ? currentRank.perkJa : currentRank.perkEn}
              </div>
            </div>
          </div>

          {/* 4 Interactive Buttons (Minecraft / Pokémon GO style 3D chunky buttons) */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#f0e8dc]">
            {/* 1. Pet */}
            <button
              onClick={handlePet}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-500 hover:bg-rose-600 active:translate-y-1 text-white font-extrabold text-xs shadow-md border-b-4 border-rose-700 transition-transform cursor-pointer"
            >
              <Heart className="w-5 h-5 mb-1 fill-white" />
              <span>{language === 'ja' ? 'なでる' : 'Pet'}</span>
              <span className="text-[10px] text-rose-100 font-normal">+4 ❤️</span>
            </button>

            {/* 2. Feed Sunflower Berry */}
            <button
              onClick={handleFeed}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:translate-y-1 text-stone-950 font-extrabold text-xs shadow-md border-b-4 border-amber-700 transition-transform cursor-pointer"
            >
              <Gift className="w-5 h-5 mb-1 text-stone-950" />
              <span>{language === 'ja' ? 'きのみをあげる' : 'Feed Berry'}</span>
              <span className="text-[10px] text-stone-900 font-normal">+6 ❤️ / +15 EXP</span>
            </button>

            {/* 3. Play Catch */}
            <button
              onClick={handlePlayCatch}
              disabled={isShuttleCatching}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:translate-y-1 text-white font-extrabold text-xs shadow-md border-b-4 border-emerald-800 transition-transform cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-5 h-5 mb-1 text-yellow-300" />
              <span>{language === 'ja' ? 'シャトル遊び' : 'Toss Play'}</span>
              <span className="text-[10px] text-emerald-100 font-normal">+8 ❤️ / +25 EXP</span>
            </button>

            {/* 4. Daily Fortune */}
            <button
              onClick={handleDrawFortune}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:translate-y-1 text-white font-extrabold text-xs shadow-md border-b-4 border-indigo-800 transition-transform cursor-pointer"
            >
              <Sparkles className="w-5 h-5 mb-1 text-amber-300" />
              <span>{language === 'ja' ? '今日のおみくじ' : 'Daily Fortune'}</span>
              <span className="text-[10px] text-indigo-100 font-normal">運勢＆ボーナス</span>
            </button>
          </div>
        </div>

        {/* Right Column: Affection Progress, Perks & Fortune Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Affection Progress & Rank Milestones */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#e2d8c7] shadow-sm space-y-4">
            <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{language === 'ja' ? 'なかよし度メーター & ランク特典' : 'Affection Meter & Rank Perks'}</span>
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>{language === 'ja' ? 'なかよし度 (Affection)' : 'Affection Meter'}</span>
                <span className="font-mono text-emerald-700">{buddyData.affection}%</span>
              </div>
              <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-300">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-full transition-all duration-500 shadow-inner"
                  style={{ width: `${buddyData.affection}%` }}
                />
              </div>
            </div>

            {/* 4 Rank Milestones */}
            <div className="space-y-2.5 pt-2 text-xs">
              {[
                { rank: 1, nameJa: '🥉 はじめての相棒 (0-39%)', nameEn: '🥉 Good Buddy', descJa: 'マップを一緒に走る', descEn: 'Walks beside you on map', req: 0 },
                { rank: 2, nameJa: '🥈 グレート相棒 (40-74%)', nameEn: '🥈 Great Buddy', descJa: 'クラフト素材を拾ってくる', descEn: 'Brings crafting materials', req: 40 },
                { rank: 3, nameJa: '🥇 ウルトラ相棒 (75-99%)', nameEn: '🥇 Ultra Buddy', descJa: '珍しいエコ精霊の出現探知', descEn: 'Detects rare Eco-Creatures', req: 75 },
                { rank: 4, nameJa: '💎 最高の相棒 (100%)', nameEn: '💎 Best Buddy', descJa: '黄金のリボン & CPブースト！', descEn: 'Golden Ribbon & CP Boost', req: 100 },
              ].map((r) => {
                const isUnlocked = buddyData.affection >= r.req;
                return (
                  <div
                    key={r.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'bg-emerald-50/70 border-emerald-300 text-stone-900'
                        : 'bg-stone-50 border-stone-200 text-stone-400 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isUnlocked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-300 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold">{language === 'ja' ? r.nameJa : r.nameEn}</div>
                        <div className="text-[11px] text-stone-500">{language === 'ja' ? r.descJa : r.descEn}</div>
                      </div>
                    </div>
                    {isUnlocked && (
                      <span className="text-[10px] font-black text-emerald-800 px-2 py-0.5 bg-emerald-200 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fortune Cookie Card (If drawn) */}
          {fortuneResult && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-300 shadow-sm space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {language === 'ja' ? '今日のエコおみくじ結果' : 'Daily Eco Fortune'}
                </span>
                <span className="text-xs font-extrabold px-3 py-1 bg-amber-400 text-stone-950 rounded-full shadow-2xs">
                  {fortuneResult.rank}
                </span>
              </div>
              <p className="text-xs text-stone-800 font-medium leading-relaxed">
                {fortuneResult.message}
              </p>
              <div className="text-right text-xs font-black text-emerald-700">
                +{fortuneResult.bonus} エコポイント獲得！
              </div>
            </div>
          )}

          {/* Quick Jump to Crafting & Eco-Dex */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('dex');
              }}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#d6c7b2] text-xs font-extrabold text-stone-800 shadow-2xs transition-colors"
            >
              <span>📖 エコ図鑑 (Eco-Dex)</span>
            </button>
            <button
              onClick={() => {
                sounds.playPop();
                setActiveTab('craft');
              }}
              className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-stone-50 border-2 border-[#d6c7b2] text-xs font-extrabold text-stone-800 shadow-2xs transition-colors"
            >
              <span>🔨 クラフト台 (Crafting)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Photo Frame Modal (AR/Share Photo with Stickers) */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-stone-200 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ja' ? '📸 相棒シャトミン記念フォトカード' : '📸 Buddy Photo Card'}</span>
              </h3>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Card Preview */}
            <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 rounded-2xl p-6 border-4 border-white shadow-inner flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                ECO ADVENTURE PASS
              </div>
              <div className="absolute top-2 right-2 text-xs font-extrabold text-stone-700">
                Lv.{level} {trainerProfile.name}
              </div>

              <div className="my-4">
                <ShatominPlush expression="love" size="xl" />
              </div>

              <div className="text-sm font-extrabold text-stone-900">
                「{trainerProfile.name}」 & シャトミン
              </div>
              <div className="text-xs text-stone-600 font-bold">
                {language === 'ja' ? currentRank.titleJa : currentRank.titleEn} • {totalPoints} pts
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playSuccess();
                  navigator.clipboard.writeText(
                    `シャトミンとエコ大冒険中！なかよし度: ${buddyData.affection}% | エコポイント: ${totalPoints}pts 🌿 友達コード: ${trainerProfile.friendCode}`
                  );
                  alert(language === 'ja' ? '冒険カードをクリップボードにコピーしました！友達に見せよう！' : 'Copied adventure card to clipboard! Share with your friends!');
                  setIsPhotoModalOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md border-b-4 border-emerald-800 transition-transform active:translate-y-1"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'ja' ? '友達にシェア / コピー' : 'Share with Friends'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
