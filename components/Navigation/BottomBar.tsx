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
    <div className="absolute bottom-0 left-0 right-0 z-40" style={{
      height: 'calc(85px + env(safe-area-inset-bottom))',
      paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'linear-gradient(to top, rgba(5, 11, 20, 0.98), rgba(10, 16, 29, 0.95))',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(6, 182, 212, 0.1)',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="flex items-center justify-around h-full px-4">
        {tabs.map(tab => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-20 h-16 relative group active:scale-95 transition-transform touch-manipulation"
            >
              {/* Active Glow Indicator - Enhanced */}
              {isActive && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-cyan-400 neon-glow-cyan"></div>
              )}

              {/* Icon with enhanced styling */}
              <div className={`transition-all duration-300 mb-1.5 ${
                isActive
                  ? 'text-cyan-400 scale-110'
                  : 'text-gray-500 group-hover:text-gray-300 group-active:text-cyan-300'
              }`}>
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span className={`text-[11px] font-bold transition-colors duration-300 uppercase tracking-wide ${
                isActive ? 'text-cyan-400' : 'text-gray-600 group-hover:text-gray-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
