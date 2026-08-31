import React, { useState } from 'react';
import { FieldIntelCard, EarthMission } from '../../types/missionTypes';
import { sounds } from '../../utils/soundEffects';
import { 
  Award, 
  Search, 
  Sparkles, 
  Globe, 
  Waves, 
  TreePine, 
  Zap, 
  Flame, 
  Lock, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

interface FieldIntelLogbookProps {
  missions: EarthMission[];
  unlockedIntel: FieldIntelCard[];
  onSelectMissionFromIntel: (missionId: string) => void;
  onBackToMain: () => void;
}

export const FieldIntelLogbook: React.FC<FieldIntelLogbookProps> = ({
  missions,
  unlockedIntel,
  onSelectMissionFromIntel,
  onBackToMain,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const unlockedIds = new Set(unlockedIntel.map((i) => i.id));

  // Combine all mission intel (locked + unlocked) to display full collection matrix
  const allIntelItems: (FieldIntelCard & { isUnlocked: boolean; missionTitle: string })[] =
    missions.map((m) => {
      const isUnlocked = unlockedIds.has(m.intelReward.id) || !!m.isCompleted;
      return {
        ...m.intelReward,
        isUnlocked,
        missionTitle: m.title,
      };
    });

  const categories = [
    'All',
    'Ocean Health',
    'Biodiversity & Forestry',
    'Plastic Neutralization',
    'Climate & Glacier',
    'Desertification & Soil',
  ];

  const filteredItems = allIntelItems.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.speciesOrTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keyFact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalUnlockedCount = allIntelItems.filter((i) => i.isUnlocked).length;

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0a182a] via-[#102947] to-[#0a182a] border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden font-sans">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  sounds.playPop();
                  onBackToMain();
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">EXPLORER COMMAND</span>
              </button>
              <div>
                <div className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EARTH PATROL SCIENTIFIC ARCHIVES</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Eco-Discovery Field Logbook
                </h2>
              </div>
            </div>

            <div className="bg-cyan-950/80 border border-cyan-400/50 rounded-2xl px-5 py-2 text-right font-mono">
              <div className="text-[10px] text-cyan-300">DISCOVERIES LOGGED</div>
              <div className="text-xl font-black text-emerald-400">
                {totalUnlockedCount} <span className="text-xs text-stone-400">/ {allIntelItems.length}</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            Authentic wildlife dossiers, ecosystem health data, and environmental breakthroughs catalogued during your Earth Rescue Missions.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search wildlife, species, or scientific topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-stone-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Intel Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => {
          if (!item.isUnlocked) {
            // Locked Card
            return (
              <div
                key={item.id}
                className="bg-black/40 border-2 border-dashed border-stone-800 rounded-3xl p-6 text-stone-500 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-stone-900 border border-stone-800 font-mono text-[10px] text-stone-400">
                      CLASSIFIED FIELD INTEL
                    </span>
                    <Lock className="w-5 h-5 text-stone-600" />
                  </div>
                  <div className="text-xl font-bold text-stone-400">
                    ??? [Locked Ecosystem Dossier]
                  </div>
                  <p className="text-xs text-stone-500 font-mono">
                    Required: Complete Earth Rescue Mission "{item.missionTitle}" to decrypt this biological intel card.
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playPop();
                    onSelectMissionFromIntel(item.missionId);
                  }}
                  className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 font-mono text-xs font-bold border border-cyan-800/60 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>LAUNCH MISSION TO UNLOCK ➔</span>
                </button>
              </div>
            );
          }

          // Unlocked Scientific Dossier Card
          return (
            <div
              key={item.id}
              className="bg-gradient-to-br from-[#0c2033] via-[#0f2a44] to-[#091724] border-2 border-cyan-500/40 rounded-3xl p-6 text-white space-y-4 shadow-xl flex flex-col justify-between hover:border-cyan-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-mono text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-mono text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.conservationStatus}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-4xl p-2 rounded-2xl bg-black/40 border border-white/10">
                    {item.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {item.speciesOrTopic}
                    </h3>
                    {item.scientificName && (
                      <div className="text-xs text-cyan-300 italic font-mono">
                        {item.scientificName}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans bg-black/30 p-3.5 rounded-2xl border border-white/5">
                  {item.keyFact}
                </p>

                {/* Vital Stats Grid */}
                <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
                  {item.vitalStats.map((stat, i) => (
                    <div key={i} className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-stone-400 block">{stat.label}</span>
                      <span className="text-cyan-300 font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
                <span>SOURCED: {item.missionTitle}</span>
                <span className="text-emerald-400 font-bold">100% RESTORED</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
