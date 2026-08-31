import React, { useState, useRef, useEffect, useMemo } from 'react';
import { EarthMission, Coordinates } from '../../types/missionTypes';
import { sounds } from '../../utils/soundEffects';
import { 
  Radar, 
  Target, 
  Radio, 
  Compass, 
  Flame, 
  Waves, 
  TreePine, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Globe, 
  Maximize2,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface EcoRadarMapProps {
  missions: EarthMission[];
  selectedMission: EarthMission | null;
  onSelectMission: (mission: EarthMission) => void;
  onDeployMission: (mission: EarthMission) => void;
  onOpenLogbook: () => void;
}

export const EcoRadarMap: React.FC<EcoRadarMapProps> = ({
  missions,
  selectedMission,
  onSelectMission,
  onDeployMission,
  onOpenLogbook,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [scannerPos, setScannerPos] = useState<Coordinates>({
    lat: selectedMission ? selectedMission.coordinates.lat : 0,
    lng: selectedMission ? selectedMission.coordinates.lng : 0,
  });
  const [isDraggingScanner, setIsDraggingScanner] = useState(false);
  const [radarPulseActive, setRadarPulseActive] = useState(true);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Sync scanner position if selectedMission changes externally
  useEffect(() => {
    if (selectedMission) {
      setScannerPos(selectedMission.coordinates);
    }
  }, [selectedMission]);

  // Filtered missions
  const filteredMissions = useMemo(() => {
    if (activeCategory === 'All') return missions;
    return missions.filter((m) => m.category === activeCategory);
  }, [missions, activeCategory]);

  // Calculate distance between scanner and target in degrees
  const getDistanceToTarget = (coords: Coordinates) => {
    const dLat = coords.lat - scannerPos.lat;
    const dLng = coords.lng - scannerPos.lng;
    return Math.sqrt(dLat * dLat + dLng * dLng);
  };

  // Find closest mission to current scanner position
  const closestMissionInfo = useMemo(() => {
    if (missions.length === 0) return null;
    let closest = missions[0];
    let minDistance = getDistanceToTarget(closest.coordinates);

    missions.forEach((m) => {
      const d = getDistanceToTarget(m.coordinates);
      if (d < minDistance) {
        minDistance = d;
        closest = m;
      }
    });

    // Proximity status: locked (<8 deg), hot (<25 deg), warm (<50 deg), cold (>50 deg)
    let status: 'locked' | 'hot' | 'warm' | 'cold' = 'cold';
    if (minDistance < 8) status = 'locked';
    else if (minDistance < 25) status = 'hot';
    else if (minDistance < 50) status = 'warm';

    return {
      mission: closest,
      distance: minDistance,
      status,
    };
  }, [missions, scannerPos]);

  // Periodic radar ping sound based on proximity
  useEffect(() => {
    if (!audioFeedback || !closestMissionInfo) return;

    const intervalMs = closestMissionInfo.status === 'locked' 
      ? 1200 
      : closestMissionInfo.status === 'hot' 
      ? 1800 
      : closestMissionInfo.status === 'warm' 
      ? 2600 
      : 3600;

    const timer = setInterval(() => {
      sounds.playRadarPing(closestMissionInfo.status);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [closestMissionInfo, audioFeedback]);

  // Convert lat/lng to container percentages (Mercator / Equirectangular projection)
  const coordsToPercent = (coords: Coordinates) => {
    // lng: -180 to 180 -> 0% to 100%
    const x = ((coords.lng + 180) / 360) * 100;
    // lat: 85 to -85 -> 0% to 100% (inverted y)
    const y = ((85 - coords.lat) / 170) * 100;
    return { x: Math.max(2, Math.min(98, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const percentToCoords = (xPercent: number, yPercent: number): Coordinates => {
    const lng = (xPercent / 100) * 360 - 180;
    const lat = 85 - (yPercent / 100) * 170;
    return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
  };

  const handleMapClickOrDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const xPercent = ((clientX - rect.left) / rect.width) * 100;
    const yPercent = ((clientY - rect.top) / rect.height) * 100;

    const newCoords = percentToCoords(xPercent, yPercent);
    setScannerPos(newCoords);
  };

  const scannerPosPercent = coordsToPercent(scannerPos);

  const categories = [
    'All',
    'Ocean Health',
    'Biodiversity & Forestry',
    'Plastic Neutralization',
    'Climate & Glacier',
    'Desertification & Soil',
  ];

  return (
    <div className="space-y-4 select-none">
      {/* HUD Telemetry Top Bar */}
      <div className="bg-[#0b1320] border-2 border-[#1e3a5f] rounded-2xl p-3.5 sm:p-4 text-emerald-400 font-mono shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Radar Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75"></span>
            <Radar className="w-5 h-5 text-emerald-400 relative z-10" />
          </div>
          <div>
            <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span>ORBITAL ECO-RADAR ACTIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-xs sm:text-sm font-black text-white">
              LAT: {scannerPos.lat >= 0 ? `+${scannerPos.lat.toFixed(2)}°` : `${scannerPos.lat.toFixed(2)}°`} | LNG:{' '}
              {scannerPos.lng >= 0 ? `+${scannerPos.lng.toFixed(2)}°` : `${scannerPos.lng.toFixed(2)}°`}
            </div>
          </div>
        </div>

        {/* Proximity Ping Indicator */}
        {closestMissionInfo && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all ${
              closestMissionInfo.status === 'locked'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : closestMissionInfo.status === 'hot'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : closestMissionInfo.status === 'warm'
                ? 'bg-yellow-950/70 border-yellow-600 text-yellow-300'
                : 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
            }`}
          >
            <Radio className="w-4 h-4 animate-spin" />
            <div>
              <span className="font-extrabold uppercase">
                {closestMissionInfo.status === 'locked'
                  ? '🎯 TARGET LOCKED!'
                  : closestMissionInfo.status === 'hot'
                  ? '🔥 HOT SIGNAL DETECTED'
                  : closestMissionInfo.status === 'warm'
                  ? '📡 WARM BIO-SIGNAL'
                  : '🟢 SCANNING PERIMETER'}
              </span>
              <span className="hidden sm:inline text-[10px] ml-1 opacity-80">
                ({closestMissionInfo.mission.title.slice(0, 20)}...)
              </span>
            </div>
          </div>
        )}

        {/* Audio / Pulse Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playPop();
              setAudioFeedback(!audioFeedback);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              audioFeedback
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{audioFeedback ? 'SONAR AUDIO ON' : 'SONAR MUTED'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills (Touch friendly, >=48px height) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sounds.playPop();
              setActiveCategory(cat);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all border cursor-pointer min-h-[44px] flex items-center gap-1.5 ${
              activeCategory === cat
                ? 'bg-emerald-500 text-stone-950 border-emerald-400 shadow-md shadow-emerald-500/20'
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

      {/* Sci-Fi Tactical World Map Canvas Stage */}
      <div
        ref={mapContainerRef}
        onClick={handleMapClickOrDrag}
        onTouchMove={handleMapClickOrDrag}
        className="relative w-full h-[420px] sm:h-[500px] lg:h-[560px] bg-[#070e17] rounded-3xl border-2 border-[#1e3a5f] shadow-2xl overflow-hidden cursor-crosshair group select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.04) 0%, rgba(7, 14, 23, 0.95) 100%),
            linear-gradient(rgba(30, 58, 95, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 58, 95, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      >
        {/* World Vector Continents Simplified Silhouette Overlay */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30 text-emerald-500 fill-current"
          preserveAspectRatio="none"
        >
          {/* North America */}
          <path d="M 120,60 L 280,70 L 320,130 L 250,220 L 210,240 L 160,200 L 120,140 Z" />
          {/* South America */}
          <path d="M 280,260 L 370,290 L 350,420 L 300,470 L 270,360 Z" />
          {/* Europe */}
          <path d="M 460,70 L 580,75 L 560,150 L 480,160 L 450,110 Z" />
          {/* Africa */}
          <path d="M 460,180 L 590,190 L 600,320 L 540,420 L 470,330 L 440,240 Z" />
          {/* Asia */}
          <path d="M 590,60 L 880,70 L 850,230 L 720,270 L 620,180 Z" />
          {/* Australia */}
          <path d="M 760,320 L 890,320 L 880,410 L 780,420 Z" />
          {/* Greenland */}
          <path d="M 360,30 L 430,40 L 410,90 L 350,80 Z" />
          {/* Antarctica */}
          <path d="M 100,470 L 900,470 L 880,495 L 120,495 Z" opacity="0.6" />
        </svg>

        {/* Tactical Grid Lat / Lng Labels */}
        <div className="absolute top-2 left-3 text-[10px] font-mono text-cyan-500/70 pointer-events-none">
          LAT +80°N | SECTOR A-1
        </div>
        <div className="absolute top-2 right-3 text-[10px] font-mono text-cyan-500/70 pointer-events-none">
          GLOBAL ECO-DEFENSE GRID
        </div>
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-500/70 pointer-events-none">
          EQUATORIAL EQUILIBRIUM: 99.8%
        </div>
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-cyan-500/70 pointer-events-none">
          GEO-TELEMETRY SYNC
        </div>

        {/* Global Mission Hotspot Pins */}
        {filteredMissions.map((mission) => {
          const { x, y } = coordsToPercent(mission.coordinates);
          const isSelected = selectedMission?.id === mission.id;
          const isCompleted = mission.isCompleted;

          return (
            <div
              key={mission.id}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playPop();
                onSelectMission(mission);
                setScannerPos(mission.coordinates);
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              {/* Pulsing Alert Rings */}
              {!isCompleted && (
                <div className="absolute -inset-3 rounded-full bg-rose-500/30 animate-ping pointer-events-none"></div>
              )}

              {/* Pin Icon Marker */}
              <div
                className={`relative flex items-center justify-center w-11 h-11 rounded-2xl border-2 transition-all transform hover:scale-125 shadow-lg ${
                  isCompleted
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-emerald-500/30'
                    : isSelected
                    ? 'bg-amber-400 border-white text-stone-950 scale-120 ring-4 ring-amber-400/50 shadow-amber-500/50'
                    : 'bg-[#12253d]/90 border-cyan-400 text-cyan-200 hover:border-white shadow-cyan-500/20'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <span className="text-xl">
                    {mission.category === 'Ocean Health' && '🪸'}
                    {mission.category === 'Biodiversity & Forestry' && '🌳'}
                    {mission.category === 'Plastic Neutralization' && '🐋'}
                    {mission.category === 'Climate & Glacier' && '🧊'}
                    {mission.category === 'Desertification & Soil' && '🏜️'}
                    {mission.category === 'Coral & Marine Sanctuary' && '🐢'}
                  </span>
                )}

                {/* Mini difficulty badge */}
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-900 border border-amber-400 text-[9px] font-bold text-amber-300 flex items-center justify-center">
                  {mission.difficulty === 'Easy' ? '1' : mission.difficulty === 'Medium' ? '2' : '3'}
                </div>
              </div>

              {/* Hotspot Floating Tooltip */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-950/95 border border-cyan-500 text-white text-[11px] font-mono px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl z-30 pointer-events-none">
                <div className="font-black text-cyan-300">{mission.codename}</div>
                <div className="text-stone-300">{mission.locationName}</div>
                <div className="text-emerald-400 font-bold">+{mission.ecoReward} Eco-Credits</div>
              </div>
            </div>
          );
        })}

        {/* Live Draggable / Interactive Crosshairs Reticle */}
        <div
          style={{ left: `${scannerPosPercent.x}%`, top: `${scannerPosPercent.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-75"
        >
          {/* Rotating Outer Reticle */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 border border-cyan-400/40 rounded-full border-dashed animate-spin flex items-center justify-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 border border-emerald-400/60 rounded-full"></div>
          </div>

          {/* Crosshair Lines */}
          <div className="absolute top-1/2 left-0 w-20 sm:w-28 h-px bg-cyan-400/80 -translate-y-1/2"></div>
          <div className="absolute top-0 left-1/2 w-px h-20 sm:h-28 bg-cyan-400/80 -translate-x-1/2"></div>

          {/* Central Aim Dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 border-2 border-white shadow-md animate-pulse"></div>

          {/* Real-time coordinates HUD tag */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-stone-950/90 text-cyan-300 font-mono text-[9px] px-2 py-0.5 rounded border border-cyan-500/50 whitespace-nowrap">
            AIM: {scannerPos.lat.toFixed(1)}°, {scannerPos.lng.toFixed(1)}°
          </div>
        </div>
      </div>

      {/* Mission Quick Deploy Console (iPad Touch Friendly) */}
      {selectedMission && (
        <div className="bg-gradient-to-r from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-400/30 uppercase">
                  {selectedMission.codename}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-400/30">
                  DIFFICULTY: {selectedMission.difficulty}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {selectedMission.title}
              </h3>
              <div className="text-xs text-cyan-200 font-mono flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedMission.locationName} ({selectedMission.region})</span>
              </div>
            </div>

            {/* Impact & Reward Stats */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-2xl px-4 py-2 text-right font-mono">
                <div className="text-[10px] text-emerald-300">IMPACT TARGET</div>
                <div className="text-sm font-black text-emerald-400">{selectedMission.impactScore}</div>
              </div>
              <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl px-4 py-2 text-right font-mono">
                <div className="text-[10px] text-amber-300">ECO-CREDITS</div>
                <div className="text-sm font-black text-amber-400">+{selectedMission.ecoReward} PTS</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 space-y-2 text-xs sm:text-sm text-stone-200 leading-relaxed">
              <p className="bg-black/30 p-3 rounded-2xl border border-white/5 font-mono text-xs">
                <span className="text-cyan-400 font-bold uppercase mr-2">SATELLITE INTEL:</span>
                {selectedMission.satelliteIntel}
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>GADGET LOADOUT: {selectedMission.solutionGadget}</span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  sounds.playPop();
                  onDeployMission(selectedMission);
                }}
                className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black text-sm sm:text-base tracking-wider uppercase shadow-lg shadow-emerald-500/30 border-b-4 border-emerald-800 transition-all active:translate-y-1 cursor-pointer flex items-center justify-center gap-2"
              >
                <Radio className="w-5 h-5" />
                <span>{selectedMission.isCompleted ? 'RE-DEPLOY RESTORATION' : 'DEPLOY RESTORATION GADGETS'}</span>
              </button>

              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenLogbook();
                }}
                className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 font-mono text-xs border border-white/10 transition-colors cursor-pointer text-center"
              >
                📖 VIEW WILDLIFE & FIELD INTEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
