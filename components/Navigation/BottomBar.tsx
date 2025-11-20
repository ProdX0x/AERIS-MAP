import React from 'react';
import { NavTab } from '../../types';
import { Map, Radio, PlusSquare, User } from 'lucide-react';

interface BottomBarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: NavTab.MAP, icon: Map, label: 'Map' },
    { id: NavTab.EVENTS, icon: Radio, label: 'Feed' },
    { id: NavTab.CREATE, icon: PlusSquare, label: 'Create' },
    { id: NavTab.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[85px] bg-[#0a101d]/90 backdrop-blur-xl border-t border-white/5 z-40 pb-4">
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-16 h-full relative group"
            >
              {/* Active Glow Indicator */}
              {isActive && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-cyan-400 shadow-[0_0_10px_cyan]"></div>
              )}
              
              <div className={`transition-colors duration-300 mb-1 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
