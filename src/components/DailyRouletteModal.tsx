import React, { useState } from 'react';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Gift, 
  Flame, 
  RotateCw, 
  Check, 
  Share2, 
  X,
  Award
} from 'lucide-react';

interface DailyRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  onClaimReward: (reward: { points: number; materials: { wood: number; leaf: number; solar: number; crystal: number }; message: string }) => void;
  language: Language;
}

const REWARDS_TABLE = [
  { id: 'jackpot', labelJa: '🌟 超大当たり！エコ鉱石+2 & 100 EXP', labelEn: '🌟 JACKPOT! 2 Crystals & 100 EXP', points: 100, materials: { wood: 4, leaf: 4, solar: 4, crystal: 2 }, color: 'from-amber-400 to-yellow-500' },
  { id: 'solar', labelJa: '⚡ ソーラー破片+5 & 50 EXP', labelEn: '⚡ 5 Solar Shards & 50 EXP', points: 50, materials: { wood: 2, leaf: 2, solar: 5, crystal: 0 }, color: 'from-yellow-400 to-amber-500' },
  { id: 'forest', labelJa: '🪵 木くず+6 & 落ち葉+6 & 40 EXP', labelEn: '🪵 6 Wood & 6 Leaves & 40 EXP', points: 40, materials: { wood: 6, leaf: 6, solar: 1, crystal: 0 }, color: 'from-emerald-500 to-teal-600' },
  { id: 'crystal', labelJa: '💎 輝くエコクリスタル+1 & 60 EXP', labelEn: '💎 1 Eco Crystal & 60 EXP', points: 60, materials: { wood: 1, leaf: 1, solar: 2, crystal: 1 }, color: 'from-purple-500 to-indigo-600' },
  { id: 'energy', labelJa: '🌻 ひまわりエネルギー+4 & 45 EXP', labelEn: '🌻 4 Sunflowers & 45 EXP', points: 45, materials: { wood: 3, leaf: 3, solar: 3, crystal: 0 }, color: 'from-orange-400 to-amber-500' },
];

export const DailyRouletteModal: React.FC<DailyRouletteModalProps> = ({
  isOpen,
  onClose,
  streak,
  onClaimReward,
  language,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonReward, setWonReward] = useState<typeof REWARDS_TABLE[0] | null>(null);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning || claimed) return;
    setIsSpinning(true);
    sounds.playChestOpen();

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * REWARDS_TABLE.length);
      const chosen = REWARDS_TABLE[randomIndex];
      setWonReward(chosen);
      setIsSpinning(false);
      setClaimed(true);
      sounds.playFanfare();
      confetti({ particleCount: 80, spread: 70 });
      onClaimReward({
        points: chosen.points,
        materials: chosen.materials,
        message: chosen.labelJa,
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border-4 border-[#e2d8c7] animate-fadeIn relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>
              {language === 'ja' ? `${streak}日連続ログイン中！` : `${streak} Day Streak!`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {language === 'ja' ? 'まいにちのエコルーレット 🎁' : 'Daily Eco Mystery Chest 🎁'}
          </h2>
          <p className="text-xs text-stone-600">
            {language === 'ja'
              ? '1日1回スピンして、クラフト素材や限定EXPをゲット！明日もログインして連続記録を伸ばそう！'
              : 'Spin once a day to earn crafting materials, berries, and EXP! Keep your streak alive!'}
          </p>
        </div>

        {/* Chest / Spinner Wheel Stage */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div
            className={`w-36 h-36 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-amber-200 border-4 border-amber-400 shadow-inner flex items-center justify-center text-6xl relative select-none ${
              isSpinning ? 'animate-spin' : wonReward ? 'animate-bounce' : 'hover:scale-105 transition-transform'
            }`}
          >
            {isSpinning ? '🌀' : wonReward ? '🎉' : '🎁'}
          </div>

          {wonReward && (
            <div className="mt-4 space-y-2 animate-fadeIn">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {language === 'ja' ? '獲得したご褒美！' : 'Reward Unlocked!'}
              </div>
              <div className="text-base font-black text-stone-900 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 shadow-2xs">
                {language === 'ja' ? wonReward.labelJa : wonReward.labelEn}
              </div>
              <div className="text-xs font-extrabold text-emerald-700">
                +{wonReward.points} EXP 獲得！
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {!claimed ? (
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-md border-b-4 border-amber-700 active:translate-y-1 transition-transform cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning
                ? language === 'ja' ? 'ルーレット回転中…' : 'Spinning...'
                : language === 'ja' ? 'ルーレットを回す！ (Spin!)' : 'Spin the Wheel!'}
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md border-b-4 border-emerald-800 transition-transform cursor-pointer"
            >
              {language === 'ja' ? '冒険にもどる (また明日も回そう！)' : 'Back to Adventure (Come back tomorrow!)'}
            </button>
            <button
              onClick={() => {
                sounds.playSuccess();
                navigator.clipboard.writeText(
                  `シャトミンとエコ大冒険で${wonReward?.labelJa}をゲットしたよ！🌿 毎日ログインして遊ぼう！`
                );
                alert(language === 'ja' ? '大当たり結果をコピーしました！友達に教えよう！' : 'Copied result! Share with your friends!');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ja' ? '友達に結果をシェア！' : 'Share with Friends'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
