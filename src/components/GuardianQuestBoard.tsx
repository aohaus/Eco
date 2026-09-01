import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Gift, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Trophy,
  Flame
} from 'lucide-react';
import { GuardianLevelTier, GuardianMission, GUARDIAN_LEVEL_TIERS } from '../data/guardianQuests';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface GuardianQuestBoardProps {
  language: Language;
  guardianLevel: number;
  completedMissionIds: string[];
  claimedMissionIds: string[];
  onCompleteMission: (missionId: string) => void;
  onClaimMission: (mission: GuardianMission) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenIntro?: () => void;
}

export const GuardianQuestBoard: React.FC<GuardianQuestBoardProps> = ({
  language,
  guardianLevel,
  completedMissionIds,
  claimedMissionIds,
  onCompleteMission,
  onClaimMission,
  onNavigateToTab,
  onOpenIntro,
}) => {
  const currentTier = GUARDIAN_LEVEL_TIERS.find(t => t.level === guardianLevel) || GUARDIAN_LEVEL_TIERS[0];
  const [selectedLevelView, setSelectedLevelView] = useState<number>(guardianLevel);

  const displayTier = GUARDIAN_LEVEL_TIERS.find(t => t.level === selectedLevelView) || currentTier;

  const currentTierClaimedCount = currentTier.missions.filter(m => claimedMissionIds.includes(m.id)).length;
  const currentTierTotalCount = currentTier.missions.length;
  const isTierAllClaimed = currentTierClaimedCount === currentTierTotalCount;

  const handleClaim = (mission: GuardianMission) => {
    sounds.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimMission(mission);
  };

  return (
    <div className="rounded-3xl bg-white/95 border-2 border-[#d6c7b2] shadow-md p-5 sm:p-7 space-y-5 text-stone-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm text-2xl">
            {displayTier.badgeEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {language === 'ja' ? 'ガーディアン・クエスト' : 'Guardian Questline'}
              </span>
              {onOpenIntro && (
                <button
                  onClick={onOpenIntro}
                  className="text-stone-400 hover:text-emerald-700 transition-colors flex items-center gap-0.5 text-xs font-semibold"
                  title={language === 'ja' ? '遊び方を見る' : 'How to play'}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'ja' ? '遊び方' : 'Help'}</span>
                </button>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-stone-900 leading-tight">
              {language === 'ja' ? displayTier.titleJa : displayTier.titleEn}
            </h2>
          </div>
        </div>

        {/* Level Progression Indicator */}
        <div className="flex items-center gap-2">
          {GUARDIAN_LEVEL_TIERS.map(tier => {
            const isUnlocked = guardianLevel >= tier.level;
            const isCurrent = guardianLevel === tier.level;
            return (
              <button
                key={tier.level}
                onClick={() => {
                  sounds.playPop();
                  setSelectedLevelView(tier.level);
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  selectedLevelView === tier.level
                    ? 'bg-[#387249] text-white shadow-xs scale-105'
                    : isUnlocked
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed opacity-60'
                }`}
              >
                <span>Lv.{tier.level}</span>
                {isUnlocked && <ShieldCheck className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tier Subtitle & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#f6f2e9] rounded-2xl p-3.5 border border-[#e0d6c4]">
        <p className="text-xs sm:text-sm text-stone-700 font-medium">
          {language === 'ja' ? displayTier.subtitleJa : displayTier.subtitleEn}
        </p>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 font-extrabold text-xs text-[#387249]">
          <span>{language === 'ja' ? 'ミッション進捗' : 'Progress'}:</span>
          <span className="font-mono bg-white px-2.5 py-0.5 rounded-lg border border-[#d6c7b2]">
            {displayTier.missions.filter(m => claimedMissionIds.includes(m.id)).length} / {displayTier.missions.length}
          </span>
        </div>
      </div>

      {/* Missions List */}
      <div className="grid grid-cols-1 gap-3.5">
        {displayTier.missions.map((mission, idx) => {
          const isCompleted = completedMissionIds.includes(mission.id);
          const isClaimed = claimedMissionIds.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`rounded-2xl p-4 transition-all border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isClaimed
                  ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                  : isCompleted
                  ? 'bg-amber-50/90 border-amber-400 shadow-sm animate-pulse'
                  : 'bg-white border-stone-200 hover:border-emerald-300 shadow-2xs'
              }`}
            >
              {/* Mission Details */}
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-2xs border ${
                  isClaimed 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                    : isCompleted 
                    ? 'bg-amber-100 border-amber-300 text-amber-800' 
                    : 'bg-stone-100 border-stone-200'
                }`}>
                  {mission.iconEmoji}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-mono">
                      STEP {idx + 1}
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-stone-900">
                      {language === 'ja' ? mission.titleJa : mission.titleEn}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {language === 'ja' ? mission.descJa : mission.descEn}
                  </p>

                  {/* Rewards preview */}
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-amber-700">
                    <span className="flex items-center gap-1 bg-amber-100/80 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      +{mission.rewardExp} EXP
                    </span>
                    {mission.rewardMaterials && (
                      <span className="text-stone-500 font-normal">
                        {language === 'ja' ? '+ クラフト素材' : '+ Materials'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isClaimed ? (
                  <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'ja' ? '達成済み' : 'Completed'}</span>
                  </div>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaim(mission)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer animate-bounce"
                  >
                    <Gift className="w-4 h-4 text-amber-100" />
                    <span>{language === 'ja' ? '報酬を受け取る！' : 'Claim Reward!'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onNavigateToTab(mission.targetTab);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#387249] hover:bg-[#2d5a39] text-white font-extrabold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'ja' ? '挑戦する' : 'Go to Task'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier Completion Banner */}
      {isTierAllClaimed && (
        <div className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Trophy className="w-8 h-8 text-amber-200 shrink-0" />
            <div>
              <h4 className="font-black text-sm sm:text-base">
                {language === 'ja' ? `🎉 ${displayTier.titleJa} を全クリア！` : `🎉 All ${displayTier.titleEn} Missions Cleared!`}
              </h4>
              <p className="text-xs text-emerald-100">
                {language === 'ja' 
                  ? `「${displayTier.badgeNameJa}」を獲得！次のレベルへ進もう！` 
                  : `Earned "${displayTier.badgeNameEn}"! Ready for next level!`}
              </p>
            </div>
          </div>
          {guardianLevel === displayTier.level && guardianLevel < GUARDIAN_LEVEL_TIERS.length && (
            <button
              onClick={() => {
                sounds.playFanfare();
                setSelectedLevelView(guardianLevel + 1);
              }}
              className="px-4 py-2 bg-white text-emerald-800 rounded-xl font-black text-xs hover:bg-emerald-50 transition-all shadow-xs cursor-pointer shrink-0"
            >
              {language === 'ja' ? '次のLvミッションへ ❯' : 'Next Level Missions ❯'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
