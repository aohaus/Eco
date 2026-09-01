import React from 'react';
import { Home, Heart, BookOpen, CheckSquare, Compass } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export type MainTabType = 'home' | 'buddy' | 'library' | 'habits' | 'explorer';

interface MinimalBottomNavProps {
  activeTab: string;
  onSelectTab: (tab: MainTabType) => void;
}

export const MinimalBottomNav: React.FC<MinimalBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'buddy', label: 'Buddy', icon: <Heart className="w-5 h-5" /> },
    { id: 'library', label: 'Library', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'habits', label: 'Habits', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'explorer', label: 'Explorer', icon: <Compass className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-md border-t border-[#E8E1D2] py-2.5">
      <div className="max-w-xl mx-auto px-6 sm:px-10 flex items-center justify-around gap-4 sm:gap-8">
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id || (tab.id === 'home' && activeTab === 'map');

          return (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playPop();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center gap-1.5 py-1.5 px-4 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#275236] font-extrabold scale-105'
                  : 'text-stone-400 hover:text-stone-700 font-medium'
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-[#275236]/10 text-[#275236]' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
