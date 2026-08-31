// Source: Google Maps Platform Code Assist
import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { LocalEcoMission, Coordinates } from '../../types/missionTypes';
import { POPULAR_LOCATIONS, generateLocalMissionsForLocation, calculateDistanceMeters } from '../../data/localMissionsData';
import { sounds } from '../../utils/soundEffects';
import { 
  Compass, 
  Crosshair, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Zap, 
  Award, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Info,
  Radio,
  Globe2,
  AlertCircle
} from 'lucide-react';
import { ShatominAvatar } from '../ShatominAvatar';

interface LocalGpsEcoMapProps {
  language: 'ja' | 'en';
  onSelectLocalMission: (mission: LocalEcoMission) => void;
  completedMissionIds: Set<string>;
}

const DEFAULT_CENTER: Coordinates = { lat: 35.6717, lng: 139.6949 }; // Tokyo Yoyogi Park

export const LocalGpsEcoMap: React.FC<LocalGpsEcoMapProps> = ({
  language,
  onSelectLocalMission,
  completedMissionIds,
}) => {
  const apiKey = ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_API_KEY) || '';
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_CENTER);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('Ready');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(1); // Default to Yoyogi Park
  const [missions, setMissions] = useState<LocalEcoMission[]>([]);
  const [hoveredMission, setHoveredMission] = useState<LocalEcoMission | null>(null);

  // Generate missions around user location
  const refreshMissions = useCallback((coords: Coordinates) => {
    const list = generateLocalMissionsForLocation(coords, language);
    setMissions(list);
  }, [language]);

  useEffect(() => {
    refreshMissions(userLocation);
  }, [userLocation, refreshMissions]);

  // Request actual browser GPS coordinates
  const handleGetLiveGps = () => {
    if (!navigator.geolocation) {
      setLocationStatus(language === 'ja' ? 'GPS非対応ブラウザです' : 'GPS not supported');
      return;
    }
    setIsLocating(true);
    setLocationStatus(language === 'ja' ? '衛星GPS測位中...' : 'Acquiring satellite GPS...');
    sounds.playBeep();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        };
        setUserLocation(coords);
        setSelectedSpotIndex(0);
        setIsLocating(false);
        setLocationStatus(language === 'ja' ? '現在地と同期完了！' : 'Synced to Current GPS!');
        sounds.playFanfare();
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        setLocationStatus(language === 'ja' ? 'GPS取得制限のためプリセット位置を使用中' : 'Using preset spot (GPS permission restricted)');
        sounds.playBeep();
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Switch preset location
  const handleSelectSpot = (index: number) => {
    sounds.playPop();
    setSelectedSpotIndex(index);
    const spot = POPULAR_LOCATIONS[index];
    if (spot.coords) {
      setUserLocation(spot.coords);
      setLocationStatus(language === 'ja' ? `${spot.nameJa} にテレポート！` : `Teleported to ${spot.nameEn}!`);
    } else {
      handleGetLiveGps();
    }
  };

  return (
    <div className="space-y-4 select-none animate-fadeIn font-sans">
      {/* Control Header & Spot Teleporter */}
      <div className="bg-[#0b1b2d] border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-5 text-white shadow-xl space-y-3 font-mono">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>LOCAL GPS ECO-RADAR</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white font-sans">
                {language === 'ja' ? '現在地・身近なエコパトロール' : 'Hyperlocal Real-Time Eco Radar'}
              </h2>
            </div>
          </div>

          {/* GPS Locate Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLiveGps}
              disabled={isLocating}
              className="min-h-[44px] px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{language === 'ja' ? '現在地を取得 (GPS)' : 'Live GPS'}</span>
            </button>
          </div>
        </div>

        {/* Popular Spot Teleporter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] text-cyan-300/80 font-bold whitespace-nowrap flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5" />
            <span>{language === 'ja' ? '探査スポット:' : 'Spots:'}</span>
          </span>
          {POPULAR_LOCATIONS.map((spot, i) => (
            <button
              key={i}
              onClick={() => handleSelectSpot(i)}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                selectedSpotIndex === i
                  ? 'bg-cyan-500 text-stone-950 border-cyan-300 shadow-md'
                  : 'bg-black/40 text-stone-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <span>{spot.icon}</span>
              <span>{language === 'ja' ? spot.nameJa : spot.nameEn}</span>
            </button>
          ))}
        </div>

        {/* Live Coordinate Status */}
        <div className="text-[11px] text-stone-400 flex flex-wrap items-center justify-between border-t border-white/10 pt-2">
          <span>STATUS: <span className="text-cyan-300 font-bold">{locationStatus}</span></span>
          <span>COORDINATES: <span className="text-emerald-400 font-bold">{userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E</span></span>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative w-full h-[520px] sm:h-[580px] rounded-3xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-[#06121e]">
        {apiKey ? (
          /* Google Maps Platform Live Rendering via @vis.gl/react-google-maps */
          <APIProvider apiKey={apiKey}>
            <div className="w-full h-full">
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={userLocation}
                center={userLocation}
                defaultZoom={16}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                style={{ width: '100%', height: '100%' }}
              >
                {/* User GPS Center Marker with Shatomin Avatar */}
                <AdvancedMarker position={userLocation}>
                  <div className="relative flex flex-col items-center group cursor-pointer">
                    <div className="absolute -top-12 bg-stone-900/90 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-400 shadow-lg whitespace-nowrap">
                      {language === 'ja' ? 'シャトミンと現在地' : 'You & Shatomin'}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/30 border-2 border-emerald-400 p-1 flex items-center justify-center animate-pulse">
                      <ShatominAvatar expression="smile" size="sm" />
                    </div>
                    <div className="w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-md -mt-1" />
                  </div>
                </AdvancedMarker>

                {/* Local Mission Markers on Google Map */}
                {missions.map((mission) => {
                  const isDone = completedMissionIds.has(mission.id);
                  return (
                    <AdvancedMarker
                      key={mission.id}
                      position={mission.coordinates}
                      onClick={() => {
                        sounds.playPop();
                        onSelectLocalMission(mission);
                      }}
                    >
                      <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-125">
                        <div className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-xl flex items-center gap-1.5 border ${
                          isDone 
                            ? 'bg-emerald-600 text-white border-emerald-300' 
                            : 'bg-stone-900/90 text-white border-cyan-400'
                        }`}>
                          <span className="text-base">{mission.emoji}</span>
                          <span className="font-mono text-[10px]">
                            {isDone ? 'CLEARED' : `${mission.distanceMeters}m`}
                          </span>
                        </div>
                        <div className={`w-3 h-3 rotate-45 -mt-1 border-r border-b ${
                          isDone ? 'bg-emerald-600 border-emerald-300' : 'bg-stone-900 border-cyan-400'
                        }`} />
                      </div>
                    </AdvancedMarker>
                  );
                })}
              </Map>
            </div>
          </APIProvider>
        ) : (
          /* High-Tech Vector & Satellite Simulation Map Canvas when Key is pending */
          <div className="relative w-full h-full bg-gradient-to-b from-[#0a1828] via-[#0e243d] to-[#071320] flex items-center justify-center overflow-hidden">
            {/* Grid & Radar Lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full border border-cyan-500/20 animate-ping [animation-duration:6s]" />
              <div className="w-[500px] h-[500px] rounded-full border border-cyan-400/10" />
              <div className="w-[300px] h-[300px] rounded-full border border-emerald-400/20" />
            </div>

            {/* User GPS Center Beacon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="bg-stone-900/90 text-cyan-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-cyan-400 shadow-xl mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{language === 'ja' ? '現在地・パトロール拠点' : 'Current GPS Waypoint'}</span>
              </div>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 p-1 flex items-center justify-center shadow-2xl">
                <ShatominAvatar expression="sparkle" size="sm" />
              </div>
            </div>

            {/* Mission Scatter Pins on Radar Canvas */}
            {missions.map((mission, idx) => {
              const isDone = completedMissionIds.has(mission.id);
              // Scatter relative to center
              const angles = [30, 85, 140, 210, 280, 330];
              const distances = [140, 180, 150, 190, 160, 200];
              const angle = (angles[idx % angles.length] * Math.PI) / 180;
              const dist = distances[idx % distances.length];
              const x = Math.cos(angle) * dist;
              const y = Math.sin(angle) * dist;

              return (
                <div
                  key={mission.id}
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  className="absolute top-1/2 left-1/2 z-30 flex flex-col items-center"
                >
                  <button
                    onClick={() => {
                      sounds.playPop();
                      onSelectLocalMission(mission);
                    }}
                    onMouseEnter={() => setHoveredMission(mission)}
                    onMouseLeave={() => setHoveredMission(null)}
                    className={`group p-2.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xl flex flex-col items-center gap-1 hover:scale-125 ${
                      isDone
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                        : 'bg-[#0e253f]/95 border-cyan-400 text-white hover:border-amber-400'
                    }`}
                  >
                    <span className="text-2xl">{mission.emoji}</span>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-black/60">
                      {isDone ? 'DONE' : `${mission.distanceMeters}m`}
                    </span>
                  </button>
                  <div className="text-[10px] font-bold text-cyan-200 mt-1 max-w-[110px] text-center truncate bg-black/70 px-1.5 py-0.5 rounded-md">
                    {language === 'ja' ? mission.titleJa : mission.title}
                  </div>
                </div>
              );
            })}

            {/* Google Maps API Notice in Corner */}
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-[#081524]/90 border border-cyan-500/40 backdrop-blur-md rounded-2xl p-3 text-white flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-stone-300">
                  {language === 'ja' 
                    ? 'Google Maps API連携モード（APIキー設定で衛星3D航空写真マップが起動します）' 
                    : 'Google Maps API ready (Configure VITE_GOOGLE_MAPS_API_KEY for dynamic 3D tiles)'}
                </span>
              </div>
              <div className="text-emerald-400 font-bold text-[11px]">
                RADAR: 6 ANOMALIES DETECTED
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mission Quick List Cards below the Map */}
      <div className="space-y-2 font-sans">
        <div className="text-xs font-mono font-bold text-cyan-300 flex items-center justify-between">
          <span>{language === 'ja' ? '周辺のローカル・エコミッション一覧' : 'NEARBY LOCAL ECO MISSIONS'}</span>
          <span className="text-stone-400">
            {completedMissionIds.size} / {missions.length} CLEARED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {missions.map((mission) => {
            const isDone = completedMissionIds.has(mission.id);
            return (
              <div
                key={mission.id}
                onClick={() => {
                  sounds.playPop();
                  onSelectLocalMission(mission);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-stone-300'
                    : 'bg-[#0d1f35] border-cyan-500/30 hover:border-cyan-400 text-white hover:bg-[#122842]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {mission.emoji}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold line-clamp-1">
                      {language === 'ja' ? mission.titleJa : mission.title}
                    </div>
                    <div className="text-[11px] text-stone-400 line-clamp-2">
                      {language === 'ja' ? mission.descriptionJa : mission.description}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono pt-1">
                      <span className="text-emerald-400 font-bold">+{mission.rewardPoints} PTS</span>
                      <span className="text-cyan-300">📍 {mission.distanceMeters}m</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-cyan-500 text-stone-950 font-bold text-[10px] font-mono">
                      START
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
