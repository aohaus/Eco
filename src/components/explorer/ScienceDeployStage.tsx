import React, { useState, useEffect } from 'react';
import { EarthMission, MissionGadget, FieldIntelCard } from '../../types/missionTypes';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  RotateCcw, 
  Compass, 
  Activity, 
  ArrowRight, 
  Layers, 
  Flame, 
  Waves, 
  TreePine, 
  Award,
  ChevronLeft
} from 'lucide-react';

interface ScienceDeployStageProps {
  mission: EarthMission;
  onCompleteMission: (missionId: string, reward: number, intel: FieldIntelCard) => void;
  onBackToRadar: () => void;
  onBackToBriefing: () => void;
  onViewIntelInLogbook: (intel: FieldIntelCard) => void;
}

type StagePhase = 'diagnostics' | 'calibration' | 'restoring' | 'success';

export const ScienceDeployStage: React.FC<ScienceDeployStageProps> = ({
  mission,
  onCompleteMission,
  onBackToRadar,
  onBackToBriefing,
  onViewIntelInLogbook,
}) => {
  const [phase, setPhase] = useState<StagePhase>('diagnostics');
  const [diagnosticProgress, setDiagnosticProgress] = useState(0);
  const [activeGadgetIndex, setActiveGadgetIndex] = useState(0);
  const [gadgetCalibrations, setGadgetCalibrations] = useState<Record<string, number>>({});
  const [restorationRate, setRestorationRate] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);

  // Initialize gadget calibrations to 50%
  useEffect(() => {
    const initCalib: Record<string, number> = {};
    mission.gadgets.forEach((g) => {
      initCalib[g.id] = 50;
    });
    setGadgetCalibrations(initCalib);
  }, [mission]);

  // Phase 1: Automated Diagnostic Scan
  useEffect(() => {
    if (phase !== 'diagnostics') return;
    setDiagnosticProgress(0);
    const interval = setInterval(() => {
      setDiagnosticProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          sounds.playRadarPing('locked');
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [phase]);

  // Phase 3: Live Restoration Engine simulation
  useEffect(() => {
    if (phase !== 'restoring') return;
    setIsDeploying(true);
    setRestorationRate(0);

    sounds.playGadgetDeploy();

    const interval = setInterval(() => {
      setRestorationRate((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setPhase('success');
          sounds.playRestorationSuccess();
          // Confetti celebration
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b'],
            });
          } catch {
            // Ignore
          }
          onCompleteMission(mission.id, mission.ecoReward, mission.intelReward);
          return 100;
        }
        return prev + 2;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [phase, mission, onCompleteMission]);

  const currentGadget: MissionGadget | undefined = mission.gadgets[activeGadgetIndex];
  const allGadgetsCalibrated = mission.gadgets.every(
    (g) => (gadgetCalibrations[g.id] || 0) >= 80
  );

  const handleCalibrationChange = (gadgetId: string, val: number) => {
    sounds.playPop();
    setGadgetCalibrations((prev) => ({
      ...prev,
      [gadgetId]: val,
    }));
  };

  // Determine visual themes based on restoration rate and category
  const getBiomeVisualStyles = () => {
    const rate = phase === 'success' ? 100 : restorationRate;

    switch (mission.category) {
      case 'Ocean Health':
      case 'Coral & Marine Sanctuary':
        return {
          bgClass: rate > 60 ? 'from-[#082f49] via-[#0369a1] to-[#0284c7]' : 'from-[#3b1111] via-[#4c1d1d] to-[#1c1917]',
          accentText: 'text-cyan-300',
          particleEmoji: rate > 50 ? '🐠' : '🫧',
          statusText: rate > 80 ? 'PRISTINE CORAL SANCTUARY RESTORED' : rate > 40 ? 'HEAT SHADE BUOYS DEPLOYING' : 'CRITICAL CORAL BLEACHING DETECTED',
        };
      case 'Biodiversity & Forestry':
        return {
          bgClass: rate > 60 ? 'from-[#064e3b] via-[#047857] to-[#059669]' : 'from-[#422006] via-[#292524] to-[#1c1917]',
          accentText: 'text-emerald-300',
          particleEmoji: rate > 50 ? '🌳' : '🌱',
          statusText: rate > 80 ? 'LUSH CANOPY CORRIDOR RECONNECTED' : rate > 40 ? 'SEED BOMBS GERMINATING' : 'FRAGMENTED RAINFOREST CANOPY',
        };
      case 'Plastic Neutralization':
        return {
          bgClass: rate > 60 ? 'from-[#0c4a6e] via-[#0284c7] to-[#38bdf8]' : 'from-[#3f3f46] via-[#27272a] to-[#09090b]',
          accentText: 'text-sky-300',
          particleEmoji: rate > 50 ? '🐋' : '📦',
          statusText: rate > 80 ? 'ZERO-PLASTIC MARINE WATERWAY SECURED' : rate > 40 ? 'WHALE SKIMMER BALLEEN ACTIVE' : 'HIGH PLASTIC DENSITY DETECTED',
        };
      case 'Climate & Glacier':
        return {
          bgClass: rate > 60 ? 'from-[#164e63] via-[#0e7490] to-[#e0f2fe]' : 'from-[#292524] via-[#44403c] to-[#1c1917]',
          accentText: 'text-cyan-200',
          particleEmoji: rate > 50 ? '❄️' : '🧊',
          statusText: rate > 80 ? 'HIGH-ALBEDO FROST SHIELD ACTIVE (0.88)' : rate > 40 ? 'MICRO-SNOW CRUST RESTORING' : 'ACCELERATED GLACIER MELT',
        };
      case 'Desertification & Soil':
      default:
        return {
          bgClass: rate > 60 ? 'from-[#064e3b] via-[#15803d] to-[#84cc16]' : 'from-[#451a03] via-[#78350f] to-[#292524]',
          accentText: 'text-lime-300',
          particleEmoji: rate > 50 ? '🌿' : '🏜️',
          statusText: rate > 80 ? 'GREAT GREEN WALL OASIS THRIVING' : rate > 40 ? 'SUBSURFACE BIOCHAR DRIP ACTIVE' : 'CRITICAL DESERTIFICATION FRONT',
        };
    }
  };

  const biomeTheme = getBiomeVisualStyles();

  return (
    <div className="space-y-5 select-none">
      {/* Top Cockpit Navigation & Mission Breadcrumb */}
      <div className="bg-[#0b1424] border-2 border-cyan-500/40 rounded-2xl p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-lg font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playPop();
              onBackToBriefing();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BRIEFING</span>
          </button>
          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase">
              CODENAME: {mission.codename}
            </div>
            <div className="text-sm sm:text-base font-black text-white">
              {mission.title}
            </div>
          </div>
        </div>

        {/* Phase Indicator Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
          <div
            className={`px-3 py-1 rounded-xl border ${
              phase === 'diagnostics'
                ? 'bg-cyan-500 text-stone-950 font-black border-cyan-400'
                : 'bg-black/40 text-stone-400 border-white/10'
            }`}
          >
            1. SCAN
          </div>
          <div
            className={`px-3 py-1 rounded-xl border ${
              phase === 'calibration'
                ? 'bg-cyan-500 text-stone-950 font-black border-cyan-400'
                : 'bg-black/40 text-stone-400 border-white/10'
            }`}
          >
            2. GADGETS
          </div>
          <div
            className={`px-3 py-1 rounded-xl border ${
              phase === 'restoring' || phase === 'success'
                ? 'bg-emerald-500 text-stone-950 font-black border-emerald-400'
                : 'bg-black/40 text-stone-400 border-white/10'
            }`}
          >
            3. RESTORE
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Box with Dynamic Biome Visual Background */}
      <div
        className={`relative w-full rounded-3xl border-2 border-cyan-500/50 shadow-2xl p-6 sm:p-8 text-white overflow-hidden transition-all duration-700 bg-gradient-to-b ${biomeTheme.bgClass}`}
      >
        {/* Animated Background Scanner Grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Floating Biome Restoration Particles */}
        <div className="absolute top-6 right-8 text-4xl sm:text-5xl opacity-40 animate-bounce pointer-events-none">
          {biomeTheme.particleEmoji}
        </div>
        <div className="absolute bottom-6 left-8 text-3xl sm:text-4xl opacity-30 animate-pulse pointer-events-none">
          {biomeTheme.particleEmoji}
        </div>

        <div className="relative z-10 space-y-6">
          {/* Status Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-black tracking-widest text-cyan-300 uppercase flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                <span>BIOME SENSOR TELEMETRY</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                {biomeTheme.statusText}
              </div>
            </div>

            {/* Target Anomaly Meter */}
            <div className="bg-black/50 border border-white/20 rounded-2xl px-4 py-2 text-right font-mono">
              <div className="text-[10px] text-stone-300 uppercase">{mission.targetAnomaly.type}</div>
              <div className="text-sm sm:text-base font-black text-amber-400">
                {phase === 'success' ? mission.targetAnomaly.targetReading : mission.targetAnomaly.initialReading}{' '}
                <span className="text-xs text-stone-300 font-normal">{mission.targetAnomaly.unit}</span>
              </div>
            </div>
          </div>

          {/* PHASE 1: DIAGNOSTIC SPECTRAL SCAN */}
          {phase === 'diagnostics' && (
            <div className="space-y-6 py-4 animate-fadeIn">
              <div className="bg-black/60 border border-cyan-500/40 rounded-3xl p-6 space-y-4 font-mono">
                <div className="flex items-center justify-between text-xs text-cyan-300">
                  <span className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    ACQUIRING SPECTRAL BIO-FEEDBACK...
                  </span>
                  <span>{diagnosticProgress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3.5 bg-stone-900 rounded-full overflow-hidden border border-cyan-500/50 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-100"
                    style={{ width: `${diagnosticProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-cyan-400 font-bold">TARGET COORDINATES:</div>
                    <div className="text-white">
                      LAT: {mission.coordinates.lat}° | LNG: {mission.coordinates.lng}°
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <div className="text-cyan-400 font-bold">RESTORATION TARGET:</div>
                    <div className="text-emerald-400 font-bold">{mission.impactScore}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans pt-1">
                  {mission.satelliteIntel}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  disabled={diagnosticProgress < 100}
                  onClick={() => {
                    sounds.playPop();
                    setPhase('calibration');
                  }}
                  className={`min-h-[52px] px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
                    diagnosticProgress >= 100
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-stone-950 shadow-cyan-500/30'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  }`}
                >
                  <span>ARM SCIENCE GADGET ARRAY</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: GADGET CALIBRATION & PRE-FLIGHT */}
          {phase === 'calibration' && currentGadget && (
            <div className="space-y-6 py-2 animate-fadeIn">
              {/* Gadget Select Tabs */}
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {mission.gadgets.map((gadget, idx) => {
                  const calib = gadgetCalibrations[gadget.id] || 0;
                  const isReady = calib >= 80;
                  const isCurrent = idx === activeGadgetIndex;

                  return (
                    <button
                      key={gadget.id}
                      onClick={() => {
                        sounds.playPop();
                        setActiveGadgetIndex(idx);
                      }}
                      className={`min-h-[48px] px-4 py-2.5 rounded-2xl font-mono text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        isCurrent
                          ? 'bg-cyan-500 text-stone-950 border-white shadow-lg'
                          : isReady
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                          : 'bg-black/40 text-stone-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg">{gadget.icon}</span>
                      <span>{gadget.codename}</span>
                      {isReady && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Active Gadget Spec & Interactive Slider Box */}
              <div className="bg-black/60 border-2 border-cyan-500/40 rounded-3xl p-6 space-y-5 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-white/10 border border-white/20">
                      {currentGadget.icon}
                    </span>
                    <div>
                      <div className="text-[10px] text-cyan-300 font-bold uppercase">
                        {currentGadget.codename}
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        {currentGadget.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="text-[10px] text-stone-400">POWER EFFICIENCY</div>
                    <div className="text-emerald-400 font-bold">{currentGadget.efficiencyRating}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                  {currentGadget.description}
                </p>

                {/* Interactive Touch Calibration Control (Minimum 48px height) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      {currentGadget.actionPrompt}
                    </span>
                    <span
                      className={`font-black text-sm ${
                        (gadgetCalibrations[currentGadget.id] || 0) >= 80
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {gadgetCalibrations[currentGadget.id] || 0}% CALIBRATED
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={gadgetCalibrations[currentGadget.id] || 0}
                    onChange={(e) =>
                      handleCalibrationChange(currentGadget.id, parseInt(e.target.value))
                    }
                    className="w-full h-8 bg-stone-900 rounded-2xl appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                  />

                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>MIN POWER</span>
                    <span className="text-emerald-400 font-bold">OPTIMAL SYNC (80%+)</span>
                    <span>MAX BOOST</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    sounds.playPop();
                    // Auto tune all to 100%
                    const full: Record<string, number> = {};
                    mission.gadgets.forEach((g) => (full[g.id] = 100));
                    setGadgetCalibrations(full);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 font-mono text-xs border border-white/15 transition-colors cursor-pointer"
                >
                  ⚡ AUTO-CALIBRATE ARRAY
                </button>

                <button
                  disabled={!allGadgetsCalibrated}
                  onClick={() => {
                    sounds.playPop();
                    setPhase('restoring');
                  }}
                  className={`min-h-[52px] px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
                    allGadgetsCalibrated
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-stone-950 shadow-emerald-500/40 border-b-4 border-emerald-800'
                      : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  <span>TRIGGER MASS DEPLOYMENT</span>
                </button>
              </div>
            </div>
          )}

          {/* PHASE 3: LIVE RESTORATION IN PROGRESS */}
          {phase === 'restoring' && (
            <div className="space-y-6 py-6 text-center animate-fadeIn font-mono">
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/30 animate-pulse">
                {biomeTheme.particleEmoji}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  RESTORATION MATRIX DEPLOYED
                </h3>
                <p className="text-sm text-cyan-200">
                  Transmitting neutral bio-frequencies & dispersing regenerative micro-shields...
                </p>
              </div>

              {/* Dynamic Live Percentage Bar */}
              <div className="max-w-md mx-auto space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-300">
                  <span>BIOME RECOVERY COEFFICIENT</span>
                  <span>{restorationRate}%</span>
                </div>
                <div className="w-full h-4 bg-stone-950 rounded-full overflow-hidden border-2 border-emerald-500/60 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-300 rounded-full transition-all duration-75"
                    style={{ width: `${restorationRate}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PHASE 4: MISSION ACCOMPLISHED & FIELD INTEL UNLOCKED */}
          {phase === 'success' && (
            <div className="space-y-6 py-4 animate-fadeIn font-sans">
              <div className="bg-black/60 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-stone-950 flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/40">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-black text-emerald-400 uppercase tracking-widest">
                        MISSION ACCOMPLISHED // THREAT NEUTRALIZED
                      </div>
                      <h3 className="text-2xl font-black text-white">
                        {mission.title}
                      </h3>
                    </div>
                  </div>

                  <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl px-5 py-2.5 text-right font-mono">
                    <div className="text-[10px] text-emerald-300">ECO-CREDIT REWARD</div>
                    <div className="text-xl font-black text-amber-400">+{mission.ecoReward} PTS</div>
                  </div>
                </div>

                {/* Impact Statement */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  <div>
                    <div className="text-xs font-mono text-emerald-300 font-bold uppercase">
                      ENVIRONMENTAL IMPACT RECOVERED
                    </div>
                    <div className="text-base sm:text-lg font-black text-white">
                      {mission.impactScore}
                    </div>
                  </div>
                </div>

                {/* Collectible Wildlife / Science Intel Card Showcase */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>NEW FIELD INTEL UNLOCKED & CATALOGUED</span>
                  </div>

                  <div className="bg-gradient-to-br from-[#0c243a] via-[#0f2e4a] to-[#081b2a] border-2 border-cyan-400/50 rounded-3xl p-5 sm:p-6 text-white space-y-4 shadow-xl">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{mission.intelReward.emoji}</span>
                        <div>
                          <h4 className="text-lg font-black text-white">
                            {mission.intelReward.speciesOrTopic}
                          </h4>
                          {mission.intelReward.scientificName && (
                            <div className="text-xs text-cyan-300 italic font-mono">
                              {mission.intelReward.scientificName}
                            </div>
                          )}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono text-xs font-bold">
                        {mission.intelReward.conservationStatus}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                      {mission.intelReward.keyFact}
                    </p>

                    {/* Vital Stats Chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      {mission.intelReward.vitalStats.map((stat, i) => (
                        <div key={i} className="bg-black/40 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-stone-400 block">{stat.label}</span>
                          <span className="text-cyan-300 font-bold">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Return / Next Step Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onBackToRadar();
                    }}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-200 font-mono text-xs font-bold border border-white/15 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>RETURN TO RADAR MAP</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playPop();
                      onViewIntelInLogbook(mission.intelReward);
                    }}
                    className="min-h-[50px] px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-stone-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/30 cursor-pointer flex items-center gap-2"
                  >
                    <span>OPEN FIELD INTEL LOGBOOK</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
