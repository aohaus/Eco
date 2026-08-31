import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Flame, 
  Leaf, 
  Droplets, 
  Trash2, 
  Zap, 
  X,
  Filter
} from 'lucide-react';
import { EcoHabit, EcoCategory } from '../types';

interface HabitTrackerProps {
  habits: EcoHabit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: (newHabit: Omit<EcoHabit, 'id' | 'completedDates' | 'streak'>) => void;
  todayDate: string;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  todayDate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New habit form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EcoCategory>('transport');
  const [description, setDescription] = useState('');
  const [co2SavingsKg, setCo2SavingsKg] = useState('1.5');
  const [waterSavingsLiters, setWaterSavingsLiters] = useState('0');
  const [wasteSavedKg, setWasteSavedKg] = useState('0');
  const [energySavedKwh, setEnergySavedKwh] = useState('0');

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter(h => h.category === selectedCategory);

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddHabit({
      title: title.trim(),
      category,
      description: description.trim() || 'Custom sustainable daily habit',
      co2SavingsKg: parseFloat(co2SavingsKg) || 0.5,
      waterSavingsLiters: parseFloat(waterSavingsLiters) || 0,
      wasteSavedKg: parseFloat(wasteSavedKg) || 0,
      energySavedKwh: parseFloat(energySavedKwh) || 0,
      points: 20,
    });

    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const categories = [
    { id: 'all', label: 'All Habits' },
    { id: 'transport', label: 'Transport' },
    { id: 'food', label: 'Food & Diet' },
    { id: 'energy', label: 'Energy' },
    { id: 'water', label: 'Water' },
    { id: 'consumption', label: 'Consumption' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Eco Action & Habit Tracker</h1>
          <p className="text-sm text-stone-600 mt-1">
            Build sustainable daily routines, track your consistency streaks, and quantify your positive impact.
          </p>
        </div>

        <button
          id="add-custom-habit-btn"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Eco Action</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center text-xs font-semibold text-stone-600 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Filter:
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-800 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHabits.map((habit) => {
          const isDone = habit.completedDates.includes(todayDate);
          return (
            <div
              key={habit.id}
              id={`habit-card-${habit.id}`}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-stone-200 shadow-xs hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <button
                      id={`check-habit-${habit.id}`}
                      onClick={() => onToggleHabit(habit.id)}
                      className="mt-0.5 text-emerald-600 focus:outline-hidden cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                      )}
                    </button>
                    <div>
                      <h2 className={`text-base font-bold ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {habit.title}
                      </h2>
                      <p className="text-xs text-stone-500 mt-0.5">{habit.description}</p>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 shrink-0">
                    {habit.category}
                  </span>
                </div>

                {/* Metrics Breakdown */}
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  {habit.co2SavingsKg > 0 && (
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md font-medium">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      {habit.co2SavingsKg} kg CO₂
                    </span>
                  )}
                  {habit.waterSavingsLiters > 0 && (
                    <span className="inline-flex items-center gap-1 text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md font-medium">
                      <Droplets className="w-3 h-3 text-sky-600" />
                      {habit.waterSavingsLiters} L water
                    </span>
                  )}
                  {habit.wasteSavedKg > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-medium">
                      <Trash2 className="w-3 h-3 text-amber-600" />
                      {habit.wasteSavedKg} kg waste
                    </span>
                  )}
                  {habit.energySavedKwh > 0 && (
                    <span className="inline-flex items-center gap-1 text-violet-800 bg-violet-100 px-2 py-0.5 rounded-md font-medium">
                      <Zap className="w-3 h-3 text-violet-600" />
                      {habit.energySavedKwh} kWh
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                <div className="flex items-center gap-1 font-semibold text-amber-600">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Streak: {habit.streak} days</span>
                </div>

                <div className="font-medium">
                  Completed {habit.completedDates.length} times
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">Create Custom Eco Action</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Action Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Used reusable produce mesh bags"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EcoCategory)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    <option value="transport">Transport</option>
                    <option value="food">Food & Diet</option>
                    <option value="energy">Energy</option>
                    <option value="water">Water</option>
                    <option value="consumption">Consumption</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">CO₂ Savings (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={co2SavingsKg}
                    onChange={(e) => setCo2SavingsKg(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Why this action helps the environment"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Water (L)</label>
                  <input
                    type="number"
                    min="0"
                    value={waterSavingsLiters}
                    onChange={(e) => setWaterSavingsLiters(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Waste (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={wasteSavedKg}
                    onChange={(e) => setWasteSavedKg(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Energy (kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={energySavedKwh}
                    onChange={(e) => setEnergySavedKwh(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
