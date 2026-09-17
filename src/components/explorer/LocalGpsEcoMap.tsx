import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { LocalEcoMission, Coordinates } from '../../types/missionTypes';
import { POPULAR_LOCATIONS, generateLocalMissionsForLocation } from '../../data/localMissionsData';
import { sounds } from '../../utils/soundEffects';
import { 
  MapPin, 
  Sparkles, 
  Navigation, 
  CheckCircle2, 
  Globe2,
  Compass,
  Award,
  Layers
} from 'lucide-react';

interface LocalGpsEcoMapProps {
  language: 'ja' | 'en';
  onSelectLocalMission: (mission: LocalEcoMission) => void;
  completedMissionIds: Set<string>;
}

// Default to Desa ParkCity, KL (or Tokyo)
const DEFAULT_CENTER: Coordinates = { lat: 3.1873, lng: 101.6372 }; // Desa ParkCity, KL

export const LocalGpsEcoMap: React.FC<LocalGpsEcoMapProps> = ({
  language,
  onSelectLocalMission,
  completedMissionIds,
}) => {
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_CENTER);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(1); // Index 1: Desa ParkCity, KL
  const [missions, setMissions] = useState<LocalEcoMission[]>([]);

  // Leaflet map refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const missionMarkersRef = useRef<L.Marker[]>([]);

  // Generate missions around current location
  const refreshMissions = useCallback((coords: Coordinates) => {
    const list = generateLocalMissionsForLocation(coords, language);
    setMissions(list);
  }, [language]);

  useEffect(() => {
    refreshMissions(userLocation);
  }, [userLocation, refreshMissions]);

  // Initialize Leaflet OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true,
    });

    // Clean, natural map tiles (CartoDB Positron / OSM Voyager)
    // Warm, crisp, light-themed map perfect for Minimal Clean design
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update map center and markers when userLocation or missions change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.flyTo([userLocation.lat, userLocation.lng], 15, {
      duration: 1.2,
    });

    // 1. Update user location marker (Shatomin Avatar icon)
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      const userIcon = L.divIcon({
        className: 'custom-shatomin-pin',
        html: `
          <div class="relative flex flex-col items-center select-none cursor-pointer">
            <div class="w-12 h-12 rounded-full bg-white border-3 border-[#275236] shadow-lg flex items-center justify-center p-0.5 transform -translate-y-2 hover:scale-110 transition-transform">
              <span class="text-2xl leading-none">🌱</span>
            </div>
            <div class="px-2 py-0.5 rounded-full bg-[#275236] text-white text-[10px] font-extrabold whitespace-nowrap -mt-1 shadow-md">
              ${language === 'ja' ? 'シャトミン現在地' : 'Shatomin'}
            </div>
          </div>
        `,
        iconSize: [48, 54],
        iconAnchor: [24, 48],
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(map);
      userMarkerRef.current = marker;
    }

    // 2. Clear old mission markers
    missionMarkersRef.current.forEach((m) => m.remove());
    missionMarkersRef.current = [];

    // 3. Add new mission markers
    missions.forEach((mission) => {
      const isDone = completedMissionIds.has(mission.id);

      const missionIcon = L.divIcon({
        className: 'custom-mission-pin',
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer transition-transform hover:scale-125 select-none">
            <div class="px-2.5 py-1 rounded-2xl text-xs font-black shadow-md flex items-center gap-1.5 border transition-all ${
              isDone
                ? 'bg-[#EBF3ED] text-[#275236] border-[#387249]'
                : 'bg-white text-stone-900 border-[#E7E0D2] group-hover:border-[#275236]'
            }">
              <span class="text-base">${mission.emoji}</span>
              <span class="font-mono text-[10px] font-bold">
                ${isDone ? '✓ DONE' : `${mission.distanceMeters}m`}
              </span>
            </div>
            <div class="w-2.5 h-2.5 rotate-45 -mt-1 border-r border-b ${
              isDone ? 'bg-[#EBF3ED] border-[#387249]' : 'bg-white border-[#E7E0D2]'
            }"></div>
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 36],
      });

      const marker = L.marker([mission.coordinates.lat, mission.coordinates.lng], { icon: missionIcon }).addTo(map);

      marker.on('click', () => {
        sounds.playPop();
        onSelectLocalMission(mission);
      });

      missionMarkersRef.current.push(marker);
    });
  }, [userLocation, missions, completedMissionIds, language, onSelectLocalMission]);

  // Request actual browser GPS coordinates (100% Touch-Friendly)
  const handleGetLiveGps = () => {
    if (!navigator.geolocation) {
      setLocationStatus(language === 'ja' ? 'GPS非対応ブラウザです' : 'GPS not supported');
      return;
    }
    setIsLocating(true);
    setLocationStatus(language === 'ja' ? 'GPS測位中...' : 'Acquiring GPS...');
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
        setLocationStatus(language === 'ja' ? '現在地に同期しました！' : 'Synced to Current GPS!');
        sounds.playFanfare();
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsLocating(false);
        setLocationStatus(language === 'ja' ? 'GPS利用がオフのためプリセット地点を表示中' : 'Using preset spot (GPS permission restricted)');
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
      setLocationStatus(language === 'ja' ? `${spot.nameJa} に移動しました！` : `Teleported to ${spot.nameEn}!`);
    } else {
      handleGetLiveGps();
    }
  };

  return (
    <div className="space-y-4 select-none animate-fadeIn font-sans">
      {/* Control Header & Spot Teleporter (Minimal Clean Warm Palette) */}
      <div className="bg-[#FAF7F0] border border-[#E7E0D2] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF3ED] border border-[#387249]/30 flex items-center justify-center text-[#275236]">
              <Compass className="w-5 h-5 text-[#275236]" />
            </div>
            <div>
              <div className="text-[10px] text-[#275236] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>OPENSTREETMAP REAL-TIME PATROL</span>
                <span className="w-2 h-2 rounded-full bg-[#275236] animate-pulse" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'ja' ? '現在地・身近なエコパトロール' : 'Hyperlocal Real-Time Eco Radar'}
              </h2>
            </div>
          </div>

          {/* GPS Locate Button (Touch-Friendly) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLiveGps}
              disabled={isLocating}
              className="min-h-[42px] px-4 py-2 rounded-2xl bg-[#275236] hover:bg-[#1E432B] active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{language === 'ja' ? '現在地を取得 (GPS)' : 'Live GPS'}</span>
            </button>
          </div>
        </div>

        {/* Spot Teleporter Pills (Includes Desa ParkCity, KL) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          <span className="text-[11px] text-stone-500 font-bold whitespace-nowrap flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-[#275236]" />
            <span>{language === 'ja' ? 'スポット:' : 'Spots:'}</span>
          </span>
          {POPULAR_LOCATIONS.map((spot, i) => (
            <button
              key={i}
              onClick={() => handleSelectSpot(i)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                selectedSpotIndex === i
                  ? 'bg-[#275236] text-white border-[#275236] shadow-xs scale-105'
                  : 'bg-white text-stone-700 border-[#E7E0D2] hover:bg-[#F4EFE6]'
              }`}
            >
              <span>{spot.icon}</span>
              <span>{language === 'ja' ? spot.nameJa : spot.nameEn}</span>
            </button>
          ))}
        </div>

        {locationStatus && (
          <div className="text-[11px] font-bold text-[#275236] bg-[#EBF3ED] px-3 py-1.5 rounded-xl inline-block border border-[#387249]/20">
            {locationStatus}
          </div>
        )}
      </div>

      {/* Real OpenStreetMap Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] rounded-3xl overflow-hidden border border-[#E7E0D2] shadow-sm bg-[#F5F2EA]">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Quick Summary Badge in Top-Right */}
        <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm border border-[#E7E0D2] px-3 py-1.5 rounded-2xl shadow-xs text-xs font-bold text-stone-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>
            {completedMissionIds.size} / {missions.length} {language === 'ja' ? '完了' : 'Cleared'}
          </span>
        </div>
      </div>

      {/* Mission Quick List Cards below the Map */}
      <div className="space-y-2 font-sans pt-2">
        <div className="text-xs font-bold text-stone-700 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#275236]" />
            <span>{language === 'ja' ? '周辺のエコミッション（タップで調査開始）' : 'Nearby Eco Missions (Tap to Inspect)'}</span>
          </span>
          <span className="text-stone-400 font-mono">
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isDone
                    ? 'bg-[#EBF3ED] border-[#387249] shadow-xs text-stone-800'
                    : 'bg-[#FCFAF5] hover:bg-white border-[#E7E0D2] hover:border-[#387249]/40 text-stone-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2ECE1] border border-[#E7E0D2] flex items-center justify-center text-2xl shrink-0">
                    {mission.emoji}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold line-clamp-1">
                      {language === 'ja' ? mission.titleJa : mission.title}
                    </div>
                    <div className="text-[11px] text-stone-600 line-clamp-2">
                      {language === 'ja' ? mission.descriptionJa : mission.description}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono pt-1">
                      <span className="text-[#275236] font-bold">+{mission.rewardPoints} PTS</span>
                      <span className="text-stone-500">📍 {mission.distanceMeters}m</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-[#275236] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-[#275236] text-white font-bold text-[10px] tracking-wide">
                      {language === 'ja' ? '調査' : 'START'}
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
