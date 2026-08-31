import React, { useState } from 'react';
import { CraftingRecipe, InventoryMaterials } from '../types/gameTypes';
import { Language } from '../utils/i18n';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { 
  Hammer, 
  Compass, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Zap, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';

interface CraftingBenchScreenProps {
  recipes: CraftingRecipe[];
  materials: InventoryMaterials;
  onCraft: (recipeId: string) => void;
  language: Language;
  setActiveTab: (tab: string) => void;
}

export const CraftingBenchScreen: React.FC<CraftingBenchScreenProps> = ({
  recipes,
  materials,
  onCraft,
  language,
  setActiveTab,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(recipes[0] || null);
  const [craftingAnimation, setCraftingAnimation] = useState(false);

  // Check if player has enough materials for selected recipe
  const canCraft = (recipe: CraftingRecipe) => {
    return (
      materials.wood >= recipe.cost.wood &&
      materials.leaf >= recipe.cost.leaf &&
      materials.solar >= recipe.cost.solar &&
      materials.pebble >= recipe.cost.pebble &&
      materials.plastic >= recipe.cost.plastic &&
      materials.crystal >= recipe.cost.crystal
    );
  };

  const handleExecuteCraft = (recipe: CraftingRecipe) => {
    if (!canCraft(recipe) || recipe.crafted || craftingAnimation) return;

    setCraftingAnimation(true);
    sounds.playCraftSuccess();
    confetti({ particleCount: 70, spread: 80 });

    setTimeout(() => {
      onCraft(recipe.id);
      setCraftingAnimation(false);
    }, 600);
  };

  return (
    <div id="crafting-bench-root" className="space-y-6 animate-fadeIn pb-12">
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

        <div className="text-xs font-bold text-stone-600 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 shadow-2xs">
          <span>{language === 'ja' ? 'クラフト完成数' : 'Crafted Items'}:</span>
          <span className="font-mono text-amber-900 font-extrabold ml-1.5">
            {recipes.filter((r) => r.crafted).length} / {recipes.length}
          </span>
        </div>
      </div>

      {/* Hero Banner with Minecraft tactile feel */}
      <div className="bg-gradient-to-r from-[#4d321d] via-[#6e4827] to-[#3b2413] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border-2 border-[#2b180a]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-amber-200">
              <Hammer className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === 'ja' ? 'エコクラフト台 (Minecraft スタイル)' : 'Eco Crafting Bench'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {language === 'ja' ? '自然素材でエコ施設をクラフト！' : 'Craft Green Facilities & Gear!'}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm max-w-xl leading-relaxed">
              {language === 'ja'
                ? 'クエストやゲーム、習慣達成で集めた素材（木くず・落ち葉・ソーラー破片など）を組み合わせて、エコアイランドを豊かにする施設や道具を作ろう！'
                : 'Combine natural and recycled materials gathered from quests and runs to craft eco-generators, bug hotels, and gear with powerful passive perks!'}
            </p>
          </div>
        </div>
      </div>

      {/* Materials Hotbar (Minecraft Inventory style) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#e2d8c7] shadow-sm space-y-2">
        <div className="text-xs font-black text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>{language === 'ja' ? '所持マテリアル (Inventory)' : 'Material Inventory'}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { id: 'wood', nameJa: '🪵 木くず', nameEn: '🪵 Wood', count: materials.wood, color: 'bg-amber-100 text-amber-950 border-amber-300' },
            { id: 'leaf', nameJa: '🍃 落ち葉', nameEn: '🍃 Leaves', count: materials.leaf, color: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
            { id: 'solar', nameJa: '⚡ ソーラー', nameEn: '⚡ Solar', count: materials.solar, color: 'bg-yellow-100 text-yellow-950 border-yellow-300' },
            { id: 'pebble', nameJa: '🪨 小石', nameEn: '🪨 Pebbles', count: materials.pebble, color: 'bg-stone-200 text-stone-900 border-stone-300' },
            { id: 'plastic', nameJa: '🧪 プラ素材', nameEn: '🧪 Plastic', count: materials.plastic, color: 'bg-cyan-100 text-cyan-950 border-cyan-300' },
            { id: 'crystal', nameJa: '💎 エコ鉱石', nameEn: '💎 Crystal', count: materials.crystal, color: 'bg-purple-100 text-purple-950 border-purple-300' },
          ].map((mat) => (
            <div
              key={mat.id}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 ${mat.color} shadow-2xs`}
            >
              <span className="text-xs font-bold">{language === 'ja' ? mat.nameJa : mat.nameEn}</span>
              <span className="text-lg font-black font-mono mt-0.5">{mat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Bench Layout: Recipe Selector & Crafting Anvil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recipes Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-black text-stone-700 flex items-center justify-between">
            <span>{language === 'ja' ? 'クラフトレシピ一覧 (Recipes)' : 'Crafting Recipes'}</span>
            <span className="text-stone-500 font-normal">
              {language === 'ja' ? 'クリックして詳細を確認' : 'Click to inspect'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipes.map((recipe) => {
              const affordable = canCraft(recipe);
              const isSelected = selectedRecipe?.id === recipe.id;

              return (
                <div
                  key={recipe.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedRecipe(recipe);
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-[#8a4e0a] bg-amber-50/60 shadow-md ring-2 ring-amber-400'
                      : 'border-[#e2d8c7] bg-white hover:border-[#8a4e0a] hover:shadow-2xs'
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-2xl">{recipe.emoji}</span>
                    {recipe.crafted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        {language === 'ja' ? '完成済み' : 'CRAFTED'}
                      </span>
                    ) : affordable ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 bg-amber-400 text-stone-950 rounded-full shadow-2xs">
                        {language === 'ja' ? '作成可能！' : 'READY'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                        {language === 'ja' ? '素材不足' : 'LOCKED'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-stone-900 text-sm">
                      {language === 'ja' ? recipe.nameJa : recipe.nameEn}
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-bold">
                      ✨ {language === 'ja' ? recipe.perkJa : recipe.perkEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crafting Anvil Stage */}
        <div className="lg:col-span-5">
          {selectedRecipe ? (
            <div className="bg-white rounded-3xl p-6 border-2 border-[#e2d8c7] shadow-md space-y-5 sticky top-6">
              <div className="flex items-center gap-3 border-b border-[#f0e8dc] pb-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner">
                  {selectedRecipe.emoji}
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">
                    {language === 'ja' ? selectedRecipe.nameJa : selectedRecipe.nameEn}
                  </h3>
                  <div className="text-xs text-stone-500 font-medium">
                    {language === 'ja' ? selectedRecipe.descriptionJa : selectedRecipe.descriptionEn}
                  </div>
                </div>
              </div>

              {/* Perk Callout */}
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-xs">
                <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 mb-0.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ja' ? '発動するボーナス効果 (Perk)' : 'Active Perk'}</span>
                </div>
                <p className="text-emerald-800 font-bold">
                  {language === 'ja' ? selectedRecipe.perkJa : selectedRecipe.perkEn}
                </p>
              </div>

              {/* Required Materials List */}
              <div className="space-y-2 text-xs">
                <div className="font-black text-stone-700">
                  {language === 'ja' ? '必要な素材 (Required Materials)' : 'Required Cost'}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { nameJa: '🪵 木くず', nameEn: 'Wood', req: selectedRecipe.cost.wood, have: materials.wood },
                    { nameJa: '🍃 落ち葉', nameEn: 'Leaves', req: selectedRecipe.cost.leaf, have: materials.leaf },
                    { nameJa: '⚡ ソーラー', nameEn: 'Solar', req: selectedRecipe.cost.solar, have: materials.solar },
                    { nameJa: '🪨 小石', nameEn: 'Pebbles', req: selectedRecipe.cost.pebble, have: materials.pebble },
                    { nameJa: '🧪 プラ', nameEn: 'Plastic', req: selectedRecipe.cost.plastic, have: materials.plastic },
                    { nameJa: '💎 クリスタル', nameEn: 'Crystal', req: selectedRecipe.cost.crystal, have: materials.crystal },
                  ]
                    .filter((m) => m.req > 0)
                    .map((m, idx) => {
                      const hasEnough = m.have >= m.req;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-xl border ${
                            hasEnough
                              ? 'bg-stone-50 border-stone-200 text-stone-800'
                              : 'bg-rose-50 border-rose-200 text-rose-800'
                          }`}
                        >
                          <span className="font-medium">{language === 'ja' ? m.nameJa : m.nameEn}</span>
                          <span className="font-mono font-bold text-xs">
                            {m.have} / {m.req} {hasEnough ? '✓' : '✕'}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Craft Action Button */}
              {selectedRecipe.crafted ? (
                <div className="w-full py-3.5 rounded-2xl bg-stone-100 text-stone-600 font-extrabold text-xs text-center border border-stone-300">
                  {language === 'ja' ? '✅ クラフト完了！効果が有効です' : '✅ Crafted & Active!'}
                </div>
              ) : (
                <button
                  onClick={() => handleExecuteCraft(selectedRecipe)}
                  disabled={!canCraft(selectedRecipe) || craftingAnimation}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm shadow-md transition-transform active:translate-y-1 ${
                    canCraft(selectedRecipe)
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-b-4 border-amber-700 cursor-pointer'
                      : 'bg-stone-200 text-stone-400 border-b-4 border-stone-300 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="w-5 h-5 text-stone-950" />
                  <span>
                    {craftingAnimation
                      ? language === 'ja' ? 'カンカン！クラフト中…' : 'Crafting...'
                      : language === 'ja' ? '🔨 この施設をクラフトする！' : 'Hammer & Craft!'}
                  </span>
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
