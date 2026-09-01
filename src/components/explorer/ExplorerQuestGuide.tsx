import React, { useState } from 'react';
import { 
  ExplorerLevelTier, 
  ExplorerStepMission, 
  EXPLORER_LEVEL_TIERS 
} from '../../data/explorerQuests';
import { Language } from '../../utils/i18n';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  HelpCircle, 
  Compass, 
  Radar, 
  MapPin, 
  BookOpen, 
  Award,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Info
} from 'lucide-react';

interface ExplorerQuestGuideProps {
  language: 'ja' | 'en';
  currentLevel: number;
  completedMissionIds: string[];
  claimedMissionIds: string[];
  onClaimMission: (mission: ExplorerStepMission) => void;
  onNavigateToView: (view: 'local_gps' | 'global_radar' | 'briefing' | 'deploy' | 'logbook', missionId?: string) => void;
  onOpenHowToPlayModal?: () => void;
}

export const ExplorerQuestGuide: React.FC<ExplorerQuestGuideProps> = ({
  language,
  currentLevel,
  completedMissionIds,
  claimedMissionIds,
  onClaimMission,
  onNavigateToView,
  onOpenHowToPlayModal,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [selectedTierLevel, setSelectedTierLevel] = useState<number>(currentLevel);

  // Sync tier view if user's current level changes
  React.useEffect(() => {
    setSelectedTierLevel(currentLevel);
  }, [currentLevel]);

  const activeTier = EXPLORER_LEVEL_TIERS.find((t) => t.level === selectedTierLevel) || EXPLORER_LEVEL_TIERS[0];
  const userCurrentTier = EXPLORER_LEVEL_TIERS.find((t) => t.level === currentLevel) || EXPLORER_LEVEL_TIERS[0];

  const tierCompletedCount = activeTier.missions.filter((m) =>
    completedMissionIds.includes(m.id)
  ).length;
  const tierClaimedCount = activeTier.missions.filter((m) =>
    claimedMissionIds.includes(m.id)
  ).length;

  const isTierUnlocked = activeTier.level <= currentLevel;
  const isTierMastered = tierClaimedCount === activeTier.missions.length;

  const handleClaim = (mission: ExplorerStepMission) => {
    sounds.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    onClaimMission(mission);
  };

  return (
    <div className="bg-gradient-to-b from-[#0e1a2f] to-[#0a1220] rounded-3xl border-2 border-cyan-500/50 shadow-2xl p-4 sm:p-5 text-white font-sans relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-xl shadow-inner animate-pulse">
            {userCurrentTier.badgeEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {language === 'ja' ? '探査ガイド＆ステップアップ' : 'EXPLORER ROADMAP'}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Lv.{currentLevel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 mt-0.5">
              <span>{language === 'ja' ? '次のステップ・ミッション目標' : 'Current Exploration Objective'}</span>
            </h2>
          </div>
        </div>

        {/* Action button & collapse */}
        <div className="flex items-center gap-2">
          {onOpenHowToPlayModal && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenHowToPlayModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-300" />
              <span>{language === 'ja' ? '遊び方と流れ' : 'HOW TO PLAY'}</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 transition-colors cursor-pointer border border-white/10"
            title={isExpanded ? '折りたたむ' : '展開する'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Level Tabs / Tier Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {EXPLORER_LEVEL_TIERS.map((tier) => {
              const isSelected = tier.level === selectedTierLevel;
              const isCurrent = tier.level === currentLevel;
              const isLocked = tier.level > currentLevel;
              const isCleared = tier.missions.every((m) => claimedMissionIds.includes(m.id));

              return (
                <button
                  key={tier.level}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedTierLevel(tier.level);
                  }}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-cyan-500 text-stone-950 border-cyan-300 shadow-md shadow-cyan-500/40 font-black'
                      : isCleared
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                      : isLocked
                      ? 'bg-black/30 text-stone-500 border-white/10 hover:bg-black/50'
                      : 'bg-white/10 text-cyan-200 border-white/15 hover:bg-white/20'
                  }`}
                >
                  <span className="text-sm">{tier.badgeEmoji}</span>
                  <span>Lv.{tier.level}</span>
                  {isCleared && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {isLocked && <Lock className="w-3 h-3 text-stone-500" />}
                  {isCurrent && !isCleared && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Tier Overview Banner */}
          <div className="bg-black/40 rounded-2xl p-3.5 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">
                  {language === 'ja' ? activeTier.rankNameJa : activeTier.rankNameEn}
                </span>
                {isTierMastered && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    {language === 'ja' ? '制覇完了！' : 'COMPLETED'}
                  </span>
                )}
                {!isTierUnlocked && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    {language === 'ja' ? `Lv.${activeTier.level - 1} クリアで解禁` : `Requires Lv.${activeTier.level - 1}`}
                  </span>
                )}
              </div>
              <p className="text-xs text-cyan-200/80 mt-1 max-w-xl font-sans">
                {language === 'ja' ? activeTier.descriptionJa : activeTier.descriptionEn}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-[10px] text-cyan-400 font-bold uppercase">
                  {language === 'ja' ? '進行状況' : 'PROGRESS'}
                </div>
                <div className="text-sm font-black text-emerald-400">
                  {tierClaimedCount} / {activeTier.missions.length}
                </div>
              </div>
              <div className="w-20 sm:w-28 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{
                    width: `${(tierClaimedCount / activeTier.missions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Missions Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeTier.missions.map((mission) => {
              const isCompleted = completedMissionIds.includes(mission.id);
              const isClaimed = claimedMissionIds.includes(mission.id);

              return (
                <div
                  key={mission.id}
                  className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                    isClaimed
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isCompleted
                      ? 'bg-amber-950/30 border-amber-400/80 shadow-lg shadow-amber-500/10'
                      : isTierUnlocked
                      ? 'bg-[#112239] border-cyan-500/40 hover:border-cyan-400'
                      : 'bg-black/30 border-white/10 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{mission.iconEmoji}</span>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          STEP {mission.order}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{mission.rewardExp} EXP
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {language === 'ja' ? mission.titleJa : mission.titleEn}
                    </h3>

                    <p className="text-xs text-stone-300/80 font-sans leading-relaxed">
                      {language === 'ja' ? mission.descJa : mission.descEn}
                    </p>
                  </div>

                  {/* Footer Action Button */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    {isClaimed ? (
                      <div className="w-full py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{language === 'ja' ? '完了・報酬受取済' : 'CLEARED & CLAIMED'}</span>
                      </div>
                    ) : isCompleted ? (
                      <button
                        onClick={() => handleClaim(mission)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-mono text-xs font-black shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
                      >
                        <Sparkles className="w-4 h-4 text-stone-950" />
                        <span>
                          {language === 'ja' ? `報酬を受取る (+${mission.rewardPoints}pt)` : `Claim +${mission.rewardPoints}pts`}
                        </span>
                      </button>
                    ) : isTierUnlocked ? (
                      <button
                        onClick={() => {
                          sounds.playPop();
                          onNavigateToView(mission.targetView, mission.targetMissionId);
                        }}
                        className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-mono text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-600/30"
                      >
                        <span>{language === 'ja' ? 'この任務に挑戦する' : 'DEPLOY OBJECTIVE'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="w-full py-2 rounded-xl bg-black/40 border border-white/10 text-stone-500 font-mono text-xs flex items-center justify-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{language === 'ja' ? 'ロック中' : 'LOCKED'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
