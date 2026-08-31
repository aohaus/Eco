import React, { useState } from 'react';
import { EarthMission } from '../../types/missionTypes';
import { sounds } from '../../utils/soundEffects';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Flame, 
  Waves, 
  TreePine, 
  Sparkles, 
  Compass, 
  Radio, 
  Globe, 
  Award,
  AlertOctagon
} from 'lucide-react';

interface MissionBriefingCenterProps {
  missions: EarthMission[];
  onSelectAndDeploy: (mission: EarthMission) => void;
  onOpenRadar: (mission: EarthMission) => void;
  onOpenLogbook: () => void;
}

export const MissionBriefingCenter: React.FC<MissionBriefingCenterProps> = ({
  missions,
  onSelectAndDeploy,
  onOpenRadar,
  onOpenLogbook,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const completedCount = missions.filter((m) => m.isCompleted).length;
  const totalEcoCredits = missions
    .filter((m) => m.isCompleted)
    .reduce((sum, m) => sum + m.ecoReward, 0);

  const categories = [
    'All',
    'Ocean Health',
    'Biodiversity & Forestry',
    'Plastic Neutralization',
    'Climate & Glacier',
    'Desertification & Soil',
  ];

  const filteredMissions =
    selectedCategory === 'All'
      ? missions
      : missions.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Sci-Fi Global Threat Assessment Header Card */}
      <div className="bg-gradient-to-r from-[#0c182a] via-[#132742] to-[#0c182a] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Grid overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-inner">
                <Globe className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                  <span>GLOBAL ECO-RESEARCH LABS // EARTH PATROL</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Earth Rescue Mission Command
                </h2>
              </div>
            </div>

            {/* Quick Action to Logbook */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenLogbook();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-200 font-mono text-xs hover:bg-cyan-900 transition-colors cursor-pointer flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-cyan-300" />
              <span>COLLECTED FIELD INTEL ({completedCount}/{missions.length})</span>
            </button>
          </div>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans max-w-3xl">
            Welcome, Junior Field Scientist. Satellite telemetry has flagged critical ecological stress points across our oceans, rainforests, and glaciers. Deploy non-violent solar-punk restoration gadgets to neutralize threats and restore planetary balance!
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 font-mono">
              <div className="text-[10px] text-cyan-300 font-bold uppercase">HOTSPOTS RESOLVED</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {completedCount} <span className="text-xs text-stone-400 font-normal">/ {missions.length}</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 font-mono">
              <div className="text-[10px] text-cyan-300 font-bold uppercase">ECO-CREDITS EARNED</div>
              <div className="text-xl sm:text-2xl font-black text-amber-400">
                +{totalEcoCredits} <span className="text-xs text-stone-400 font-normal">PTS</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 font-mono">
              <div className="text-[10px] text-cyan-300 font-bold uppercase">GLOBAL RECOVERY RATE</div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400">
                {Math.round((completedCount / missions.length) * 100)}%
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-3 font-mono">
              <div className="text-[10px] text-cyan-300 font-bold uppercase">GADGET SYSTEM READINESS</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-300 flex items-center gap-1.5">
                <span>100%</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sounds.playPop();
              setSelectedCategory(cat);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all border cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-stone-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-[#101d30] text-cyan-200 border-[#1f375b] hover:bg-[#182b46]'
            }`}
          >
            {cat === 'All' && <Globe className="w-3.5 h-3.5" />}
            {cat === 'Ocean Health' && <Waves className="w-3.5 h-3.5" />}
            {cat === 'Biodiversity & Forestry' && <TreePine className="w-3.5 h-3.5" />}
            {cat === 'Plastic Neutralization' && <Zap className="w-3.5 h-3.5" />}
            {cat === 'Climate & Glacier' && <Sparkles className="w-3.5 h-3.5" />}
            {cat === 'Desertification & Soil' && <Flame className="w-3.5 h-3.5" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Mission Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMissions.map((mission) => {
          const isCompleted = mission.isCompleted;

          return (
            <div
              key={mission.id}
              className={`rounded-3xl border-2 transition-all p-5 sm:p-6 space-y-4 shadow-xl flex flex-col justify-between ${
                isCompleted
                  ? 'bg-gradient-to-br from-[#0d2218] via-[#0f2d21] to-[#0a1a12] border-emerald-500/50 text-white'
                  : 'bg-gradient-to-br from-[#0c182a] via-[#12243d] to-[#0a1422] border-cyan-500/30 hover:border-cyan-400 text-white'
              }`}
            >
              <div className="space-y-3">
                {/* Header Status Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-mono text-[10px] font-extrabold border border-cyan-700/50 uppercase">
                      {mission.codename}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-extrabold border ${
                        mission.difficulty === 'Easy'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                          : mission.difficulty === 'Medium'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-rose-950/80 text-rose-300 border-rose-700'
                      }`}
                    >
                      ★ {mission.difficulty.toUpperCase()}
                    </span>
                  </div>

                  {isCompleted && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-mono text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RESTORED</span>
                    </span>
                  )}
                </div>

                {/* Title & Location */}
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                    {mission.title}
                  </h3>
                  <div className="text-xs text-cyan-200 font-mono flex items-center gap-1.5 mt-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{mission.locationName}</span>
                  </div>
                </div>

                {/* Problem & Satellite Intel summary */}
                <p className="text-xs text-stone-300 leading-relaxed bg-black/30 p-3 rounded-2xl border border-white/5">
                  {mission.issueDescription}
                </p>

                {/* Solution Gadget Spec Box */}
                <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-3 flex items-center gap-3">
                  <div className="text-2xl">
                    {mission.category === 'Ocean Health' && '🪸'}
                    {mission.category === 'Biodiversity & Forestry' && '🚁'}
                    {mission.category === 'Plastic Neutralization' && '🐋'}
                    {mission.category === 'Climate & Glacier' && '🧊'}
                    {mission.category === 'Desertification & Soil' && '🏜️'}
                    {mission.category === 'Coral & Marine Sanctuary' && '🐢'}
                  </div>
                  <div className="font-mono text-xs">
                    <div className="text-[10px] text-cyan-400 font-bold uppercase">DEPLOYMENT GADGET:</div>
                    <div className="text-white font-bold">{mission.solutionGadget}</div>
                  </div>
                </div>

                {/* Target Anomaly Readout */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-stone-400 block">IMPACT TARGET:</span>
                    <span className="text-emerald-400 font-bold">{mission.impactScore}</span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] text-stone-400 block">REWARD:</span>
                    <span className="text-amber-400 font-bold">+{mission.ecoReward} Eco-Credits</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Touch friendly, >=48px height) */}
              <div className="pt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    sounds.playPop();
                    onOpenRadar(mission);
                  }}
                  className="min-h-[48px] px-3 py-2.5 rounded-2xl bg-[#14263f] hover:bg-[#1a3254] text-cyan-200 font-mono text-xs font-bold border border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>LOCATE ON RADAR</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onSelectAndDeploy(mission);
                  }}
                  className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg border-b-4 transition-all active:translate-y-1 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-800 shadow-emerald-500/20'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-stone-950 border-emerald-700 shadow-emerald-500/30'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>{isCompleted ? 'RE-DEPLOY' : 'DEPLOY GADGETS'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
