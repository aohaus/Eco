import React, { useState, useEffect } from 'react';
import { EarthMission, FieldIntelCard, LocalEcoMission } from '../../types/missionTypes';
import { INITIAL_EARTH_MISSIONS, EXPLORER_RANKS } from '../../data/missionsData';
import { EcoRadarMap } from './EcoRadarMap';
import { MissionBriefingCenter } from './MissionBriefingCenter';
import { ScienceDeployStage } from './ScienceDeployStage';
import { FieldIntelLogbook } from './FieldIntelLogbook';
import { LocalGpsEcoMap } from './LocalGpsEcoMap';
import { LocalMissionModal } from './LocalMissionModal';
import { sounds } from '../../utils/soundEffects';
import { 
  Radar, 
  FileText, 
  BookOpen, 
  Globe, 
  Sparkles, 
  ArrowLeft,
  MapPin,
  Compass,
  Zap,
  Award
} from 'lucide-react';

interface EcoExplorerScreenProps {
  language?: 'ja' | 'en';
  onAddPoints: (points: number) => void;
  onAddExp?: (exp: number) => void;
  onReturnToAppMap?: () => void;
  initialMissionId?: string;
}

type ExplorerView = 'local_gps' | 'global_radar' | 'briefing' | 'deploy' | 'logbook';

export const EcoExplorerScreen: React.FC<EcoExplorerScreenProps> = ({
  language = 'ja',
  onAddPoints,
  onAddExp,
  onReturnToAppMap,
  initialMissionId,
}) => {
  const [currentView, setCurrentView] = useState<ExplorerView>('local_gps');
  const [missions, setMissions] = useState<EarthMission[]>(() => {
    try {
      const saved = localStorage.getItem('eco_explorer_missions_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return INITIAL_EARTH_MISSIONS;
  });

  const [unlockedIntel, setUnlockedIntel] = useState<FieldIntelCard[]>(() => {
    try {
      const saved = localStorage.getItem('eco_explorer_intel_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return [];
  });

  const [completedLocalIds, setCompletedLocalIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('eco_explorer_local_completed_v1');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
    return new Set();
  });

  const [selectedMission, setSelectedMission] = useState<EarthMission | null>(() => {
    if (initialMissionId) {
      const found = missions.find((m) => m.id === initialMissionId);
      if (found) return found;
    }
    return missions[0] || null;
  });

  const [activeLocalMission, setActiveLocalMission] = useState<LocalEcoMission | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save missions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eco_explorer_missions_v1', JSON.stringify(missions));
    } catch {
      // Ignore
    }
  }, [missions]);

  // Save intel to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eco_explorer_intel_v1', JSON.stringify(unlockedIntel));
    } catch {
      // Ignore
    }
  }, [unlockedIntel]);

  // Save local completed to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'eco_explorer_local_completed_v1',
        JSON.stringify(Array.from(completedLocalIds))
      );
    } catch {
      // Ignore
    }
  }, [completedLocalIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleCompleteGlobalMission = (
    missionId: string,
    reward: number,
    intel: FieldIntelCard
  ) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === missionId) {
          return {
            ...m,
            isCompleted: true,
            restorationRate: 100,
            completedTimestamp: Date.now(),
          };
        }
        return m;
      })
    );

    // Add intel if not already present
    setUnlockedIntel((prev) => {
      if (prev.some((i) => i.id === intel.id)) return prev;
      return [...prev, { ...intel, unlockedAt: new Date().toISOString() }];
    });

    onAddPoints(reward);
    if (onAddExp) {
      onAddExp(120);
    }

    showToast(language === 'ja' 
      ? `🌍 地球レスキュー任務完了！ +${reward}pt & 生態系インテル解禁！`
      : `🌍 Mission Accomplished! +${reward} Eco-Points & Intel Unlocked!`
    );
  };

  const handleCompleteLocalMission = (
    missionId: string,
    rewardPoints: number,
    rewardExp: number
  ) => {
    setCompletedLocalIds((prev) => new Set([...prev, missionId]));
    setActiveLocalMission(null);

    onAddPoints(rewardPoints);
    if (onAddExp) {
      onAddExp(rewardExp);
    }

    showToast(language === 'ja'
      ? `📍 ローカルパトロール完了！ +${rewardPoints}pt & +${rewardExp}EXP 獲得！`
      : `📍 Local Mission Cleared! +${rewardPoints} Eco-Points & +${rewardExp} EXP!`
    );
  };

  const completedGlobalCount = missions.filter((m) => m.isCompleted).length;
  const totalScore = missions
    .filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.ecoReward, 0) + (completedLocalIds.size * 140);

  // Calculate rank
  const currentRank = [...EXPLORER_RANKS]
    .reverse()
    .find((r) => totalScore >= r.minScore) || EXPLORER_RANKS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-5 px-3 sm:px-6 py-4 animate-fadeIn select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-950 border-2 border-emerald-400 text-emerald-300 font-mono text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Local Mission Active Modal */}
      {activeLocalMission && (
        <LocalMissionModal
          mission={activeLocalMission}
          language={language}
          onComplete={handleCompleteLocalMission}
          onClose={() => setActiveLocalMission(null)}
        />
      )}

      {/* Cockpit Command Top Navigation Bar */}
      <div className="bg-[#0b1626] border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-5 text-white shadow-2xl flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          {onReturnToAppMap && (
            <button
              onClick={() => {
                sounds.playPop();
                onReturnToAppMap();
              }}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-200 border border-white/15 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {language === 'ja' ? 'メインマップ' : 'MAIN ECO MAP'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                EARTH PATROL COMMAND
              </div>
              <div className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <span>{language === 'ja' ? '地球レスキュー・ミッション' : 'ECO EXPLORER'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  {currentRank.badge} {currentRank.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs (Local GPS Map, Global Hotzones, Dossiers, Intel) */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          {/* Local GPS Mode */}
          <button
            onClick={() => {
              sounds.playPop();
              setCurrentView('local_gps');
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentView === 'local_gps'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-black shadow-md shadow-emerald-500/30'
                : 'text-emerald-200 hover:bg-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{language === 'ja' ? '📍 現在地パトロール' : 'LOCAL GPS'}</span>
          </button>

          {/* Global Radar Mode */}
          <button
            onClick={() => {
              sounds.playPop();
              setCurrentView('global_radar');
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentView === 'global_radar'
                ? 'bg-cyan-500 text-stone-950 font-black shadow-md shadow-cyan-500/30'
                : 'text-cyan-200 hover:bg-white/10'
            }`}
          >
            <Radar className="w-4 h-4" />
            <span>{language === 'ja' ? '🌍 世界ホットゾーン' : 'GLOBAL RADAR'}</span>
          </button>

          {/* Dossiers */}
          <button
            onClick={() => {
              sounds.playPop();
              setCurrentView('briefing');
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentView === 'briefing'
                ? 'bg-cyan-500 text-stone-950 font-black shadow-md shadow-cyan-500/30'
                : 'text-cyan-200 hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'ja' ? '📋 調査指令書' : 'DOSSIERS'}</span>
          </button>

          {/* Intel Logbook */}
          <button
            onClick={() => {
              sounds.playPop();
              setCurrentView('logbook');
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              currentView === 'logbook'
                ? 'bg-cyan-500 text-stone-950 font-black shadow-md shadow-cyan-500/30'
                : 'text-cyan-200 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ja' ? '生態系図鑑' : 'FIELD INTEL'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-400 text-cyan-300">
              {unlockedIntel.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main View Renderer */}
      {currentView === 'local_gps' && (
        <LocalGpsEcoMap
          language={language}
          completedMissionIds={completedLocalIds}
          onSelectLocalMission={(m) => {
            setActiveLocalMission(m);
          }}
        />
      )}

      {currentView === 'global_radar' && (
        <EcoRadarMap
          missions={missions}
          selectedMission={selectedMission}
          onSelectMission={(m) => setSelectedMission(m)}
          onDeployMission={(m) => {
            setSelectedMission(m);
            setCurrentView('deploy');
          }}
          onOpenLogbook={() => setCurrentView('logbook')}
        />
      )}

      {currentView === 'briefing' && (
        <MissionBriefingCenter
          missions={missions}
          onSelectAndDeploy={(m) => {
            setSelectedMission(m);
            setCurrentView('deploy');
          }}
          onOpenRadar={(m) => {
            setSelectedMission(m);
            setCurrentView('global_radar');
          }}
          onOpenLogbook={() => setCurrentView('logbook')}
        />
      )}

      {currentView === 'deploy' && selectedMission && (
        <ScienceDeployStage
          mission={selectedMission}
          onCompleteMission={handleCompleteGlobalMission}
          onBackToRadar={() => setCurrentView('global_radar')}
          onBackToBriefing={() => setCurrentView('briefing')}
          onViewIntelInLogbook={(intel) => {
            setCurrentView('logbook');
          }}
        />
      )}

      {currentView === 'logbook' && (
        <FieldIntelLogbook
          missions={missions}
          unlockedIntel={unlockedIntel}
          onSelectMissionFromIntel={(missionId) => {
            const found = missions.find((m) => m.id === missionId);
            if (found) {
              setSelectedMission(found);
              setCurrentView('deploy');
            }
          }}
          onBackToMain={() => setCurrentView('local_gps')}
        />
      )}
    </div>
  );
};
