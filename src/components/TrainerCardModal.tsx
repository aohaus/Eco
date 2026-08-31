import React, { useState } from 'react';
import { TrainerProfile, EcoCreature, CraftingRecipe, BuddyData } from '../types/gameTypes';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import { ShatominPlush } from './ShatominPlush';
import { 
  Award, 
  Copy, 
  Check, 
  Share2, 
  X, 
  Star, 
  Flame, 
  Sparkles,
  QrCode,
  Edit3
} from 'lucide-react';

interface TrainerCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerProfile: TrainerProfile;
  onUpdateProfile: (profile: TrainerProfile) => void;
  buddyData: BuddyData;
  creatures: EcoCreature[];
  recipes: CraftingRecipe[];
  totalPoints: number;
  streak: number;
  level: number;
  language: Language;
}

const TITLES_JA = [
  'みどりの冒険者',
  '太陽光マスター',
  '清流のエコレンジャー',
  '風車の守護者',
  'ゼロウェイスト戦士',
  '地球のマスターエコロジスト',
];

const TITLES_EN = [
  'Green Explorer',
  'Solar Master',
  'Stream Eco Ranger',
  'Wind Turbine Keeper',
  'Zero Waste Warrior',
  'Master Ecologist',
];

export const TrainerCardModal: React.FC<TrainerCardModalProps> = ({
  isOpen,
  onClose,
  trainerProfile,
  onUpdateProfile,
  buddyData,
  creatures,
  recipes,
  totalPoints,
  streak,
  level,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (!isOpen) return null;

  const favoriteCreature = creatures.find((c) => c.id === trainerProfile.favoriteCreatureId) || creatures[0];
  const unlockedCreaturesCount = creatures.filter((c) => c.unlocked).length;
  const craftedCount = recipes.filter((r) => r.crafted).length;

  const handleCopyCode = () => {
    sounds.playSuccess();
    navigator.clipboard.writeText(trainerProfile.friendCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCard = () => {
    sounds.playSuccess();
    const shareText = `【Eco with シャトミン】冒険者カード 🌟
名前: ${trainerProfile.name} (${trainerProfile.titleJa})
レベル: Lv.${level} | エコポイント: ${totalPoints}pts
連続日数: ${streak}日 | 図鑑発見: ${unlockedCreaturesCount}/${creatures.length}体
友達コード: ${trainerProfile.friendCode}
一緒に地球を守るエコ大冒険を始めよう！🏸🌿`;

    if (navigator.share) {
      navigator.share({
        title: 'Eco with シャトミン - 冒険パス',
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      alert(language === 'ja' ? '冒険パス情報をクリップボードにコピーしました！友達に見せよう！' : 'Copied Trainer Pass to clipboard! Share with your friends!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border-4 border-[#e2d8c7] animate-fadeIn relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'ja' ? 'トレーナープロフィール＆冒険パス' : 'Trainer Profile & Pass'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {language === 'ja' ? '冒険者カード (友達に見せる！)' : 'Trainer Adventure Pass'}
          </h2>
        </div>

        {/* Pokemon GO / Minecraft style Pass Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#20492c] via-[#2f683f] to-[#1a3a23] text-white p-6 border-4 border-[#122b1a] shadow-xl relative overflow-hidden space-y-5">
          {/* Card Top Banner */}
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-emerald-200">
                ECO TRAINER PASS
              </div>
              <div className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>{trainerProfile.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-extrabold">
                  Lv.{level}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-emerald-200 font-medium">
                {language === 'ja' ? '友達コード' : 'Friend ID'}
              </div>
              <div className="font-mono text-xs font-extrabold text-amber-300">
                {trainerProfile.friendCode}
              </div>
            </div>
          </div>

          {/* Center Mascot & Partner Sprite */}
          <div className="grid grid-cols-2 gap-4 items-center bg-black/20 rounded-2xl p-4 border border-white/10">
            {/* Buddy */}
            <div className="flex flex-col items-center text-center">
              <ShatominPlush expression="smile" size="lg" />
              <span className="text-[11px] font-bold text-emerald-100 mt-1">
                {language === 'ja' ? '相棒シャトミン' : 'Buddy'}
              </span>
              <span className="text-[9px] text-rose-300 font-bold">
                ❤️ なかよし度 {buddyData.affection}%
              </span>
            </div>

            {/* Favorite Dex Sprite */}
            <div className="flex flex-col items-center text-center border-l border-white/10 pl-2">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-3xl shadow-inner mb-1">
                {favoriteCreature.emoji}
              </div>
              <span className="text-[11px] font-bold text-amber-200">
                {language === 'ja' ? favoriteCreature.nameJa : favoriteCreature.nameEn}
              </span>
              <span className="text-[9px] text-emerald-300 font-mono font-bold">
                Leader CP {favoriteCreature.cp}
              </span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <div className="text-[10px] text-emerald-200 font-medium">{language === 'ja' ? 'エコポイント' : 'Eco Points'}</div>
              <div className="font-black text-amber-300 font-mono text-sm">{totalPoints}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <div className="text-[10px] text-emerald-200 font-medium">{language === 'ja' ? '連続記録' : 'Streak'}</div>
              <div className="font-black text-amber-300 font-mono text-sm">{streak} 日</div>
            </div>
            <div className="bg-white/10 rounded-xl p-2 border border-white/10">
              <div className="text-[10px] text-emerald-200 font-medium">{language === 'ja' ? '図鑑 / クラフト' : 'Dex / Craft'}</div>
              <div className="font-black text-amber-300 font-mono text-sm">{unlockedCreaturesCount} / {craftedCount}</div>
            </div>
          </div>

          {/* Player Title Selector */}
          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-emerald-100">
              <span className="text-[11px] font-bold">{language === 'ja' ? '称号:' : 'Title:'}</span>
              <span className="font-extrabold text-amber-300">
                「{language === 'ja' ? trainerProfile.titleJa : trainerProfile.titleEn}」
              </span>
            </div>
            <button
              onClick={() => setIsEditingTitle(!isEditingTitle)}
              className="text-[10px] underline text-emerald-200 hover:text-white cursor-pointer"
            >
              {language === 'ja' ? '称号変更' : 'Change'}
            </button>
          </div>

          {/* Title Options dropdown */}
          {isEditingTitle && (
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/20 animate-fadeIn">
              {(language === 'ja' ? TITLES_JA : TITLES_EN).map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playPop();
                    onUpdateProfile({
                      ...trainerProfile,
                      titleJa: TITLES_JA[idx],
                      titleEn: TITLES_EN[idx],
                    });
                    setIsEditingTitle(false);
                  }}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-left text-[11px] font-bold text-white transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Copy Friend Code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>
              {copied
                ? language === 'ja' ? 'コードコピー完了！' : 'ID Copied!'
                : language === 'ja' ? '友達コードをコピー' : 'Copy Friend ID'}
            </span>
          </button>

          {/* Share Adventure Pass */}
          <button
            onClick={handleShareCard}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md border-b-4 border-emerald-800 transition-transform active:translate-y-1 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'ja' ? '友達にパスを見せる！' : 'Share Adventure Pass'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
