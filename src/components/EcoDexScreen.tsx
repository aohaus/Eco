import React, { useState } from 'react';
import { EcoCreature } from '../types/gameTypes';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import { 
  Sparkles, 
  Search, 
  Award, 
  Compass, 
  Volume2, 
  Star, 
  Lock, 
  CheckCircle, 
  Zap,
  Info
} from 'lucide-react';

interface EcoDexScreenProps {
  creatures: EcoCreature[];
  onSetFavorite: (id: string) => void;
  favoriteId: string;
  language: Language;
  setActiveTab: (tab: string) => void;
}

export const EcoDexScreen: React.FC<EcoDexScreenProps> = ({
  creatures,
  onSetFavorite,
  favoriteId,
  language,
  setActiveTab,
}) => {
  const [selectedCreature, setSelectedCreature] = useState<EcoCreature | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const unlockedCount = creatures.filter((c) => c.unlocked).length;
  const totalCount = creatures.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredCreatures = creatures.filter((c) => {
    if (filterType === 'all') return true;
    if (filterType === 'unlocked') return c.unlocked;
    return c.element === filterType;
  });

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return { label: 'LEGENDARY ⭐⭐⭐⭐', color: 'bg-amber-400 text-stone-950 font-black' };
      case 'epic':
        return { label: 'EPIC ⭐⭐⭐', color: 'bg-purple-600 text-white font-bold' };
      case 'rare':
        return { label: 'RARE ⭐⭐', color: 'bg-blue-500 text-white font-bold' };
      default:
        return { label: 'COMMON ⭐', color: 'bg-emerald-600 text-white font-semibold' };
    }
  };

  const getElementLabel = (elem: string) => {
    switch (elem) {
      case 'sun':
        return { labelJa: '☀️ 太陽 (Sun)', labelEn: '☀️ Sun', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'water':
        return { labelJa: '💧 清流 (Water)', labelEn: '💧 Water', color: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'wind':
        return { labelJa: '🍃 疾風 (Wind)', labelEn: '🍃 Wind', color: 'bg-teal-100 text-teal-900 border-teal-300' };
      case 'nature':
        return { labelJa: '🍄 森林 (Nature)', labelEn: '🍄 Nature', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'spark':
        return { labelJa: '⚡ 再エネ (Clean Spark)', labelEn: '⚡ Spark', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' };
      default:
        return { labelJa: '♻️ リサイクル (Recycle)', labelEn: '♻️ Recycle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    }
  };

  return (
    <div id="ecodex-screen-root" className="space-y-6 animate-fadeIn pb-12">
      {/* Return to Map Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => {
            sounds.playPop();
            setActiveTab('map');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#d6c7b2] text-xs font-bold text-stone-700 shadow-2xs transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#387249]" />
          <span>{language === 'ja' ? '🗺️ 冒険マップへ戻る' : '🗺️ Back to World Map'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 bg-white px-3.5 py-1.5 rounded-full border border-[#e2d8c7] shadow-2xs">
          <span>{language === 'ja' ? '図鑑完成度' : 'Dex Completion'}:</span>
          <span className="font-mono text-emerald-700 font-extrabold">{unlockedCount} / {totalCount} ({progressPercent}%)</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1c4728] via-[#2d663d] to-[#1a3d24] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border-2 border-[#132e1a]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ja' ? 'エコモンスター図鑑 (Pokémon GO スタイル)' : 'Eco-Dex & Collectible Sprites'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'ja' ? '地球を守るエコ精霊図鑑' : 'Eco-Dex: Guardian Sprites'}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              {language === 'ja'
                ? 'エコ行動を実践したりゲームでハイスコアを出すと、地球の各地から可愛いエコ精霊が集まってくるよ！全種類集めてエコマスターを目指そう！'
                : 'Complete eco habits, play arcade runs, and craft items to discover cute elemental sprites from across the globe! Catch them all to become a Master Ecologist!'}
            </p>
          </div>

          {/* Dex Progress Wheel */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center min-w-[140px] space-y-1">
            <div className="text-3xl font-black text-amber-300 font-mono">
              {unlockedCount} <span className="text-sm font-medium text-emerald-100">/ {totalCount}</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="text-[11px] text-emerald-200 font-bold">
              {language === 'ja' ? `${progressPercent}% 完了` : `${progressPercent}% Completed`}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', labelJa: 'すべて (All)', labelEn: 'All' },
          { id: 'unlocked', labelJa: '✨ 発見済み', labelEn: 'Discovered' },
          { id: 'sun', labelJa: '☀️ 太陽', labelEn: 'Sun' },
          { id: 'water', labelJa: '💧 清流', labelEn: 'Water' },
          { id: 'wind', labelJa: '🍃 疾風', labelEn: 'Wind' },
          { id: 'nature', labelJa: '🍄 森林', labelEn: 'Nature' },
          { id: 'spark', labelJa: '⚡ 再エネ', labelEn: 'Spark' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              sounds.playPop();
              setFilterType(f.id);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              filterType === f.id
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-2xs'
                : 'bg-white text-stone-700 border-[#d6c7b2] hover:bg-stone-50'
            }`}
          >
            {language === 'ja' ? f.labelJa : f.labelEn}
          </button>
        ))}
      </div>

      {/* Creatures Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredCreatures.map((creature) => {
          const rarity = getRarityBadge(creature.rarity);
          const isFavorite = favoriteId === creature.id;

          return (
            <div
              key={creature.id}
              onClick={() => {
                sounds.playPop();
                setSelectedCreature(creature);
              }}
              className={`rounded-3xl p-4 border-2 transition-all cursor-pointer relative flex flex-col items-center justify-between text-center select-none group ${
                creature.unlocked
                  ? 'bg-white border-[#e2d8c7] hover:border-emerald-500 hover:shadow-md hover:-translate-y-1'
                  : 'bg-stone-100/80 border-stone-200 opacity-75 hover:opacity-90'
              }`}
            >
              {/* Top CP & Shiny Indicator */}
              <div className="w-full flex items-center justify-between text-[11px]">
                {creature.unlocked ? (
                  <span className="font-extrabold text-stone-700 font-mono">
                    CP <span className="text-emerald-700">{creature.cp}</span>
                  </span>
                ) : (
                  <span className="text-stone-400 font-mono font-bold">CP ???</span>
                )}

                {creature.isShiny && creature.unlocked && (
                  <span className="text-amber-500 text-xs animate-spin" title="Shiny Variant!">
                    ✨
                  </span>
                )}
                {isFavorite && (
                  <span className="text-rose-500 text-xs" title="Favorite Leader">
                    ❤️
                  </span>
                )}
              </div>

              {/* Creature Sprite / Silhouette */}
              <div className="my-3 relative flex items-center justify-center h-20 w-20">
                {creature.unlocked ? (
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: creature.bgColor, borderColor: creature.color }}
                  >
                    {creature.emoji}
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-stone-300 flex items-center justify-center text-stone-500 text-2xl shadow-inner border border-stone-400">
                    <Lock className="w-6 h-6 text-stone-400" />
                  </div>
                )}
              </div>

              {/* Name & Rarity */}
              <div className="space-y-1 w-full">
                <div className="font-extrabold text-xs text-stone-900 truncate">
                  {creature.unlocked
                    ? language === 'ja'
                      ? creature.nameJa
                      : creature.nameEn
                    : '？？？？'}
                </div>
                <div className={`text-[9px] px-2 py-0.5 rounded-full inline-block ${rarity.color}`}>
                  {creature.rarity.toUpperCase()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedCreature && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border-2 border-stone-200 animate-fadeIn relative overflow-hidden">
            {/* Header Close */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-stone-500 font-mono">
                  No. {filteredCreatures.findIndex((c) => c.id === selectedCreature.id) + 1}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${getRarityBadge(selectedCreature.rarity).color}`}>
                  {selectedCreature.rarity.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedCreature(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Creature Stage */}
            <div
              className="rounded-3xl p-6 flex flex-col items-center justify-center text-center relative shadow-inner border-2"
              style={{
                backgroundColor: selectedCreature.unlocked ? selectedCreature.bgColor : '#f5f5f4',
                borderColor: selectedCreature.unlocked ? selectedCreature.color : '#d6d3d1',
              }}
            >
              {selectedCreature.unlocked ? (
                <>
                  <div className="text-6xl animate-bounce mb-2">
                    {selectedCreature.emoji}
                  </div>
                  <h3 className="text-xl font-black text-stone-900">
                    {language === 'ja' ? selectedCreature.nameJa : selectedCreature.nameEn}
                  </h3>
                  <div className="text-xs font-extrabold text-stone-700 font-mono mt-0.5">
                    Eco-Power: <span className="text-emerald-800 font-black text-sm">CP {selectedCreature.cp}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-stone-300 flex items-center justify-center text-3xl mb-2 text-stone-500">
                    <Lock className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-black text-stone-600">
                    {language === 'ja' ? '未発見のエコ精霊' : 'Undiscovered Sprite'}
                  </h3>
                  <div className="text-xs text-stone-400 font-bold mt-0.5">
                    CP ???
                  </div>
                </>
              )}
            </div>

            {/* Element and Lore */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getElementLabel(selectedCreature.element).color}`}>
                  {language === 'ja'
                    ? getElementLabel(selectedCreature.element).labelJa
                    : getElementLabel(selectedCreature.element).labelEn}
                </span>

                {selectedCreature.unlocked && (
                  <button
                    onClick={() => sounds.playPowerUp()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{language === 'ja' ? '鳴き声を聞く' : 'Play Cry'}</span>
                  </button>
                )}
              </div>

              {selectedCreature.unlocked ? (
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-1.5">
                  <div className="font-bold text-stone-900 text-xs">
                    {language === 'ja' ? '精霊のヒミツ (Lore)' : 'Sprite Lore'}
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {language === 'ja' ? selectedCreature.descriptionJa : selectedCreature.descriptionEn}
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-1.5">
                  <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>{language === 'ja' ? '発見のヒント (How to catch)' : 'Unlock Hint'}</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed font-medium">
                    {language === 'ja' ? selectedCreature.unlockHintJa : selectedCreature.unlockHintEn}
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {selectedCreature.unlocked && (
              <button
                onClick={() => {
                  sounds.playSuccess();
                  onSetFavorite(selectedCreature.id);
                  setSelectedCreature(null);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md border-b-4 border-emerald-800 transition-transform active:translate-y-1 cursor-pointer"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>{language === 'ja' ? '相棒リーダーに設定する！' : 'Set as Partner Leader!'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
