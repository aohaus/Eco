import React from 'react';
import { Trophy, Sparkles, Award, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { GuardianLevelTier } from '../data/guardianQuests';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newTier: GuardianLevelTier;
  language: Language;
  onContinue: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newTier,
  language,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#fdfbf7] via-[#f7f3ea] to-[#ede3d4] border-3 border-amber-400 shadow-2xl p-6 sm:p-8 text-stone-800 text-center overflow-hidden">
        {/* Sunburst background effect */}
        <div className="absolute inset-0 opacity-15 bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-amber-400 animate-spin [animation-duration:25s] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-stone-500 hover:text-stone-800 border border-stone-200 transition-all shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div className="relative mx-auto my-3 w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl border-4 border-white text-5xl animate-bounce">
          {newTier.badgeEmoji}
        </div>

        {/* Congratulations Text */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{language === 'ja' ? 'ガーディアン・昇格おめでとう！' : 'Guardian Promotion!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mb-1">
          {language === 'ja' ? newTier.titleJa : newTier.titleEn}
        </h2>

        <p className="text-xs sm:text-sm text-stone-600 mb-4 max-w-sm mx-auto">
          {language === 'ja' ? newTier.subtitleJa : newTier.subtitleEn}
        </p>

        {/* Badge Unlocked Card */}
        <div className="bg-white/90 rounded-2xl p-4 border border-amber-200 shadow-xs mb-6 text-left flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase text-amber-800">
              {language === 'ja' ? '獲得した称号バッジ' : 'Unlocked Badge'}
            </div>
            <div className="font-black text-sm text-stone-900">
              {language === 'ja' ? newTier.badgeNameJa : newTier.badgeNameEn}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sounds.playFanfare();
            onClose();
            onContinue();
          }}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 hover:from-amber-400 hover:to-teal-500 text-white font-black text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-b-4 border-teal-900"
        >
          <Sparkles className="w-5 h-5 text-amber-200" />
          <span>{language === 'ja' ? '新しいミッションに挑戦する！' : 'Start New Missions!'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
