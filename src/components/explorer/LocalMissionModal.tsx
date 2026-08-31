import React, { useState, useEffect } from 'react';
import { LocalEcoMission } from '../../types/missionTypes';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  X, 
  Zap, 
  Award, 
  ShieldCheck, 
  HelpCircle,
  RotateCcw,
  Sliders,
  Trash2,
  Leaf
} from 'lucide-react';
import { ShatominAvatar } from '../ShatominAvatar';

interface LocalMissionModalProps {
  mission: LocalEcoMission;
  language: 'ja' | 'en';
  onComplete: (missionId: string, rewardPoints: number, rewardExp: number) => void;
  onClose: () => void;
}

export const LocalMissionModal: React.FC<LocalMissionModalProps> = ({
  mission,
  language,
  onComplete,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sliderVal, setSliderVal] = useState(30);
  const [chargeTime, setChargeTime] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  // For Sort Recycle game
  const [itemsToSort, setItemsToSort] = useState<Array<{ id: number; name: string; type: 'pet' | 'can' | 'paper'; emoji: string }>>([
    { id: 1, name: 'ペットボトル', type: 'pet', emoji: '🧴' },
    { id: 2, name: 'アルミ缶', type: 'can', emoji: '🥫' },
    { id: 3, name: '新聞紙・段ボール', type: 'paper', emoji: '📦' },
    { id: 4, name: 'お茶のプラボトル', type: 'pet', emoji: '🧃' },
    { id: 5, name: 'スチール飲料缶', type: 'can', emoji: '🥫' },
    { id: 6, name: '紙パック', type: 'paper', emoji: '📰' },
  ]);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);

  // Floating trash for Tap Clean game
  const [trashPositions, setTrashPositions] = useState([
    { id: 1, top: 25, left: 30, cleared: false },
    { id: 2, top: 40, left: 65, cleared: false },
    { id: 3, top: 60, left: 25, cleared: false },
    { id: 4, top: 70, left: 75, cleared: false },
    { id: 5, top: 35, left: 50, cleared: false },
  ]);

  const { gameType, goalCount } = mission.interactiveChallenge;

  // Handle charge holding
  useEffect(() => {
    let timer: any;
    if (isCharging && !isSuccess) {
      timer = setInterval(() => {
        setChargeTime((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            handleCompleteGame();
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isCharging, isSuccess]);

  const handleCompleteGame = () => {
    setIsSuccess(true);
    sounds.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      onComplete(mission.id, mission.rewardPoints, mission.rewardExp);
    }, 1800);
  };

  const handleTrashTap = (id: number) => {
    if (isSuccess) return;
    sounds.playPop();
    setTrashPositions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, cleared: true } : t))
    );
    const newCount = progress + 1;
    setProgress(newCount);
    if (newCount >= goalCount) {
      handleCompleteGame();
    }
  };

  const handleSliderCheck = () => {
    if (sliderVal >= 88 && sliderVal <= 100) {
      sounds.playFanfare();
      handleCompleteGame();
    } else {
      sounds.playBeep();
    }
  };

  const handleSortItem = (binType: 'pet' | 'can' | 'paper') => {
    if (isSuccess || currentItemIdx >= itemsToSort.length) return;
    const current = itemsToSort[currentItemIdx];
    if (current.type === binType) {
      sounds.playPop();
      const nextIdx = currentItemIdx + 1;
      setCurrentItemIdx(nextIdx);
      setProgress(nextIdx);
      if (nextIdx >= itemsToSort.length) {
        handleCompleteGame();
      }
    } else {
      sounds.playBeep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fadeIn select-none">
      <div className="bg-[#0e1e32] border-2 border-cyan-400 rounded-3xl max-w-xl w-full text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#112947] to-[#0d223c] p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-3xl">
              {mission.emoji}
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>LOCAL GPS MISSION</span>
                {mission.distanceMeters !== undefined && (
                  <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                    📍 {mission.distanceMeters}m
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {language === 'ja' ? mission.titleJa : mission.title}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Shatomin Lore Bubble */}
          <div className="bg-cyan-950/60 border border-cyan-400/40 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3">
            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-emerald-800/50 p-1 border border-emerald-400">
              <ShatominAvatar expression={isSuccess ? 'sparkle' : 'smile'} size="sm" />
            </div>
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="font-bold text-cyan-300 font-mono">
                {language === 'ja' ? 'シャトミンの通信' : 'Shatomin Transmission'}
              </div>
              <p className="text-stone-200 leading-relaxed font-sans">
                {language === 'ja' ? mission.loreJa : mission.lore}
              </p>
            </div>
          </div>

          {/* Interactive Challenge Arena */}
          <div className="bg-black/40 border border-white/15 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{language === 'ja' ? mission.actionNameJa : mission.actionName}</span>
              </span>
              <span className="text-emerald-400 font-bold">
                {isSuccess ? '100% COMPLETE' : `STEP: ${progress} / ${goalCount}`}
              </span>
            </div>

            <p className="text-xs text-stone-300">
              {language === 'ja' ? mission.interactiveChallenge.promptJa : mission.interactiveChallenge.prompt}
            </p>

            {/* Game Mode 1: Tap Clean */}
            {gameType === 'tap_clean' && (
              <div className="relative h-48 sm:h-56 bg-gradient-to-b from-[#081b2e] to-[#040f1a] rounded-2xl border border-cyan-500/30 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                {trashPositions.map((item) =>
                  !item.cleared ? (
                    <button
                      key={item.id}
                      onClick={() => handleTrashTap(item.id)}
                      style={{ top: `${item.top}%`, left: `${item.left}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-amber-500/30 border-2 border-amber-400 hover:scale-125 active:scale-95 transition-transform flex items-center justify-center text-2xl cursor-pointer shadow-lg animate-bounce"
                    >
                      {mission.emoji}
                    </button>
                  ) : null
                )}
                {isSuccess && (
                  <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-emerald-300 font-mono space-y-2 animate-fadeIn">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                    <div className="text-base font-black">
                      {language === 'ja' ? mission.interactiveChallenge.actionVerbJa : mission.interactiveChallenge.actionVerb}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Game Mode 2: Slider Calibrate */}
            {gameType === 'slider_calibrate' && (
              <div className="p-4 bg-gradient-to-b from-[#081b2e] to-[#040f1a] rounded-2xl border border-cyan-500/30 space-y-4 font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-400">PURITY LEVEL:</span>
                  <span className={`font-bold ${sliderVal >= 88 ? 'text-emerald-400 animate-pulse' : 'text-cyan-300'}`}>
                    {sliderVal}% {sliderVal >= 88 ? '🎯 OPTIMAL TARGET!' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderVal}
                  onChange={(e) => {
                    setSliderVal(Number(e.target.value));
                    if (Number(e.target.value) % 10 === 0) {
                      sounds.playPop();
                    }
                  }}
                  className="w-full h-4 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <button
                  onClick={handleSliderCheck}
                  disabled={isSuccess}
                  className={`w-full min-h-[48px] py-3 rounded-xl font-bold text-xs sm:text-sm uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    sliderVal >= 88
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-stone-950 font-black shadow-lg shadow-emerald-500/30 scale-[1.02]'
                      : 'bg-cyan-900/60 text-cyan-200 border border-cyan-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ja' ? 'フィルター出力確定' : 'Calibrate & Purify'}</span>
                </button>
              </div>
            )}

            {/* Game Mode 3: Sort Recycle */}
            {gameType === 'sort_recycle' && (
              <div className="p-4 bg-gradient-to-b from-[#081b2e] to-[#040f1a] rounded-2xl border border-cyan-500/30 space-y-4">
                {currentItemIdx < itemsToSort.length && !isSuccess ? (
                  <div className="text-center p-4 bg-cyan-950/40 rounded-xl border border-cyan-500/20 space-y-1">
                    <div className="text-4xl animate-bounce">
                      {itemsToSort[currentItemIdx].emoji}
                    </div>
                    <div className="text-sm font-bold text-white">
                      {itemsToSort[currentItemIdx].name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      どの分別ボックスに入れる？
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-emerald-950/60 rounded-xl text-emerald-300 font-bold font-mono">
                    ✅ 全ての資源を分別完了！
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSortItem('pet')}
                    disabled={isSuccess}
                    className="min-h-[54px] p-2.5 rounded-xl bg-blue-900/50 hover:bg-blue-800 border border-blue-400 text-xs font-bold text-blue-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>🧴 プラ・ボトル</span>
                  </button>
                  <button
                    onClick={() => handleSortItem('can')}
                    disabled={isSuccess}
                    className="min-h-[54px] p-2.5 rounded-xl bg-amber-900/50 hover:bg-amber-800 border border-amber-400 text-xs font-bold text-amber-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>🥫 缶・金属</span>
                  </button>
                  <button
                    onClick={() => handleSortItem('paper')}
                    disabled={isSuccess}
                    className="min-h-[54px] p-2.5 rounded-xl bg-emerald-900/50 hover:bg-emerald-800 border border-emerald-400 text-xs font-bold text-emerald-200 flex flex-col items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <span>📦 古紙・段ボール</span>
                  </button>
                </div>
              </div>
            )}

            {/* Game Mode 4: Solar Charge */}
            {gameType === 'solar_charge' && (
              <div className="p-4 bg-gradient-to-b from-[#081b2e] to-[#040f1a] rounded-2xl border border-cyan-500/30 space-y-4 text-center font-mono">
                <div className="w-full bg-stone-800 h-4 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-100"
                    style={{ width: `${chargeTime}%` }}
                  />
                </div>
                <div className="text-xs text-amber-300 font-bold">
                  CHARGE: {chargeTime}%
                </div>
                <button
                  onMouseDown={() => setIsCharging(true)}
                  onMouseUp={() => setIsCharging(false)}
                  onTouchStart={() => setIsCharging(true)}
                  onTouchEnd={() => setIsCharging(false)}
                  disabled={isSuccess}
                  className={`w-full min-h-[54px] py-4 rounded-2xl font-black text-sm uppercase transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isCharging
                      ? 'bg-amber-400 text-stone-950 scale-95 shadow-xl shadow-amber-500/50'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-stone-950'
                  }`}
                >
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span>{language === 'ja' ? '長押しで省エネパルスを送信！' : 'HOLD TO TRANSMIT PULSE'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Environmental Bonus Fact */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1 font-sans">
            <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'ja' ? '地球にいいコト豆知識' : 'Eco Scientific Fact'}</span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {language === 'ja' ? mission.interactiveChallenge.bonusFactJa : mission.interactiveChallenge.bonusFact}
            </p>
          </div>
        </div>

        {/* Modal Footer Rewards */}
        <div className="bg-[#0a1727] p-4 border-t border-cyan-500/30 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold">
              +{mission.rewardPoints} PTS
            </span>
            <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold">
              +{mission.rewardExp} EXP
            </span>
          </div>

          <div className="text-stone-400">
            {isSuccess ? '🏆 REWARD EARNED' : 'READY TO DEPLOY'}
          </div>
        </div>
      </div>
    </div>
  );
};
