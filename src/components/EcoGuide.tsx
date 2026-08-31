import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock, 
  Zap, 
  Sparkles,
  Check
} from 'lucide-react';
import { ecoGuides } from '../data/initialData';
import { EcoGuideItem } from '../types';

export const EcoGuide: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(ecoGuides[0]?.id || null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const filteredGuides = ecoGuides.filter((guide) => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Sustainable Living Guides & Toolkits</h1>
          <p className="text-sm text-stone-600 mt-1">
            Science-backed strategies to lower your carbon emissions, eliminate waste, and optimize home energy.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'food', 'energy', 'transport', 'water', 'consumption'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {cat === 'all' ? 'All Topics' : cat}
          </button>
        ))}
      </div>

      {/* Guides Accordion / List */}
      <div className="space-y-4">
        {filteredGuides.map((guide) => {
          const isExpanded = expandedGuideId === guide.id;
          return (
            <div
              key={guide.id}
              id={`guide-card-${guide.id}`}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedGuideId(isExpanded ? null : guide.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-stone-50/70"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-stone-900">{guide.title}</h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {guide.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{guide.summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="hidden sm:flex items-center text-xs text-stone-500 font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {guide.readTime}
                  </div>
                  <div className="text-stone-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Action Checklist */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-stone-100 bg-stone-50/40">
                  <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Actionable Implementation Steps
                  </div>

                  <div className="space-y-2.5">
                    {guide.steps.map((step, idx) => {
                      const stepKey = `${guide.id}-step-${idx}`;
                      const isChecked = !!completedSteps[stepKey];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleStep(stepKey)}
                          className={`flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                          }`}
                        >
                          <div className="mt-0.5 text-emerald-600 shrink-0">
                            {isChecked ? (
                              <CheckCircle className="w-4 h-4 fill-emerald-600 text-white" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-stone-300" />
                            )}
                          </div>
                          <div className={`text-xs ${isChecked ? 'line-through text-stone-500' : 'text-stone-800'}`}>
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
