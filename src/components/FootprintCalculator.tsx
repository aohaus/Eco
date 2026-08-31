import React, { useState } from 'react';
import { 
  Car, 
  Home, 
  Utensils, 
  ShoppingBag, 
  Check, 
  Info, 
  RefreshCw,
  TrendingDown,
  TreePine,
  Sparkles
} from 'lucide-react';
import { FootprintAnswers, FootprintScore } from '../types';
import { calculateFootprint } from '../data/initialData';

interface FootprintCalculatorProps {
  answers: FootprintAnswers;
  onSaveAnswers: (newAnswers: FootprintAnswers) => void;
  currentScore: FootprintScore;
}

export const FootprintCalculator: React.FC<FootprintCalculatorProps> = ({
  answers: initialAnswers,
  onSaveAnswers,
  currentScore,
}) => {
  const [form, setForm] = useState<FootprintAnswers>(initialAnswers);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const previewScore = calculateFootprint(form);

  const handleUpdate = <K extends keyof FootprintAnswers>(key: K, value: FootprintAnswers[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAnswers(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Carbon & Ecological Footprint Calculator</h1>
          <p className="text-sm text-stone-600 mt-1">
            Answer key questions about your lifestyle to compute your annual CO₂ equivalent emissions.
          </p>
        </div>

        {/* Real-time score ticker */}
        <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <div>
            <div className="text-xs text-emerald-800 font-medium">Estimated Footprint</div>
            <div className="text-2xl font-extrabold text-emerald-950">
              {previewScore.totalTonnes} <span className="text-xs font-normal text-emerald-800">t CO₂e/yr</span>
            </div>
          </div>
          <div className="border-l border-emerald-200 pl-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
              {previewScore.tier}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Fields Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Mobility & Transport */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <span>1. Mobility & Transportation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Primary Commute Mode
                </label>
                <select
                  id="select-commute-mode"
                  value={form.commuteMode}
                  onChange={(e) => handleUpdate('commuteMode', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="bike_walk">Walking / Cycling (0 kg/km)</option>
                  <option value="public_transit">Public Transit (Bus / Train)</option>
                  <option value="car_ev">Electric Vehicle (EV)</option>
                  <option value="car_hybrid">Hybrid Vehicle</option>
                  <option value="car_petrol">Gasoline / Diesel Car</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Weekly Travel / Commute: <span className="text-emerald-700 font-bold">{form.weeklyCommuteKm} km</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={form.weeklyCommuteKm}
                  onChange={(e) => handleUpdate('weeklyCommuteKm', Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-2"
                />
                <div className="flex justify-between text-[10px] text-stone-600 mt-1">
                  <span>0 km</span>
                  <span>300 km</span>
                  <span>600+ km</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Short-haul flights per year (&lt; 3 hours)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={form.shortFlightsPerYear}
                  onChange={(e) => handleUpdate('shortFlightsPerYear', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Long-haul flights per year (&gt; 3 hours)
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={form.longFlightsPerYear}
                  onChange={(e) => handleUpdate('longFlightsPerYear', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Home Energy */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span>2. Home & Living Space</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Housing Type
                </label>
                <select
                  value={form.homeType}
                  onChange={(e) => handleUpdate('homeType', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="apartment">Apartment / Flat</option>
                  <option value="house_small">Townhouse / Small House (&lt;120m²)</option>
                  <option value="house_large">Large Standalone House (&gt;120m²)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  People in Household
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.householdSize}
                  onChange={(e) => handleUpdate('householdSize', Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Primary Heating Method
                </label>
                <select
                  value={form.heatingType}
                  onChange={(e) => handleUpdate('heatingType', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="heat_pump">Heat Pump / Geothermal (Highest efficiency)</option>
                  <option value="electric">Electric Heating</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="oil_wood">Heating Oil / Wood</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="relative flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.greenEnergyPlan}
                    onChange={(e) => handleUpdate('greenEnergyPlan', e.target.checked)}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 border-stone-300"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    100% Renewable / Green Tariff electricity plan
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Food & Nutrition */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span>3. Food & Diet</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Dietary Archetype
                </label>
                <select
                  value={form.dietType}
                  onChange={(e) => handleUpdate('dietType', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="vegan">100% Plant-Based (Vegan)</option>
                  <option value="vegetarian">Vegetarian (No meat)</option>
                  <option value="pescatarian">Pescatarian (Fish & veggies)</option>
                  <option value="omnivore_low_meat">Low-Meat Omnivore (1-2x / week)</option>
                  <option value="omnivore_heavy_meat">Heavy Meat Omnivore (Daily)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Local & Seasonal Food: <span className="text-emerald-700 font-bold">{form.localSeasonalRatio}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={form.localSeasonalRatio}
                  onChange={(e) => handleUpdate('localSeasonalRatio', Number(e.target.value))}
                  className="w-full accent-emerald-600 mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Household Food Waste
                </label>
                <select
                  value={form.foodWasteLevel}
                  onChange={(e) => handleUpdate('foodWasteLevel', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="minimal">Minimal (Careful meal planning)</option>
                  <option value="average">Average (Some leftovers discarded)</option>
                  <option value="frequent">Frequent (Significant spoilage)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Consumption & Recycling */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 text-stone-900 font-bold text-lg border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>4. Goods, Shopping & Waste</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Purchasing Style
                </label>
                <select
                  value={form.shoppingHabit}
                  onChange={(e) => handleUpdate('shoppingHabit', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="minimalist">Minimalist (Buy only essentials, second-hand)</option>
                  <option value="conscious">Conscious (Quality over quantity, durable items)</option>
                  <option value="average">Average Consumer (Regular purchases)</option>
                  <option value="frequent">Frequent Shopper (Fast-fashion, frequent gadgets)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Recycling Rigor
                </label>
                <select
                  value={form.recyclingLevel}
                  onChange={(e) => handleUpdate('recyclingLevel', e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="thorough">Thorough (Paper, Glass, Plastics, Electronics)</option>
                  <option value="basic">Basic (Paper & Cans)</option>
                  <option value="none">Rarely / None</option>
                </select>
              </div>

              <div className="flex items-center pt-2">
                <label className="relative flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.composting}
                    onChange={(e) => handleUpdate('composting', e.target.checked)}
                    className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 border-stone-300"
                  />
                  <span className="text-xs font-semibold text-stone-800">
                    Compost organic food scraps & yard waste
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              id="save-footprint-btn"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Footprint Saved!</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Update & Save Footprint</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Analysis & Breakdown Sidebar */}
        <div className="space-y-6">
          {/* Analysis Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              Footprint Breakdown
            </h2>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>🚗 Transport</span>
                  <span>{previewScore.transportTonnes} t</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(previewScore.transportTonnes / previewScore.totalTonnes) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>⚡ Home Energy</span>
                  <span>{previewScore.energyTonnes} t</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: `${(previewScore.energyTonnes / previewScore.totalTonnes) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>🥗 Food & Diet</span>
                  <span>{previewScore.foodTonnes} t</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(previewScore.foodTonnes / previewScore.totalTonnes) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>📦 Goods & Waste</span>
                  <span>{previewScore.consumptionTonnes} t</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(previewScore.consumptionTonnes / previewScore.totalTonnes) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Global Paris Target</span>
                <span className="font-bold text-emerald-700">2.0 tonnes / yr</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Regional Average</span>
                <span className="font-bold text-stone-700">7.5 tonnes / yr</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Trees to Offset</span>
                <span className="font-bold text-emerald-800">{previewScore.treeOffsetNeeded} trees</span>
              </div>
            </div>
          </div>

          {/* Targeted Action Insights */}
          <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Highest Reduction Opportunities
            </div>

            <ul className="text-xs text-emerald-100 space-y-2.5">
              {form.commuteMode === 'car_petrol' && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Switching to public transit or an EV for weekly commutes could save up to <strong>1.2 tonnes CO₂</strong> annually.</span>
                </li>
              )}
              {!form.greenEnergyPlan && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Subscribing to a 100% renewable electricity tariff eliminates home grid generation emissions.</span>
                </li>
              )}
              {form.dietType === 'omnivore_heavy_meat' && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Adopting a low-meat or flexitarian diet can reduce food emissions by over <strong>1.1 tonnes CO₂</strong>.</span>
                </li>
              )}
              {!form.composting && (
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Composting organic food waste prevents methane release in oxygen-deprived landfills.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};
