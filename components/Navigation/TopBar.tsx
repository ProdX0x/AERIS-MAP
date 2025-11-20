
import React from 'react';
import { Bell, User as UserIcon, Compass, Activity } from 'lucide-react';

interface TopBarProps {
  onToggleNetworkPanel?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleNetworkPanel }) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 pointer-events-none" style={{
      height: 'calc(3.5rem + env(safe-area-inset-top))',
      paddingTop: 'env(safe-area-inset-top)',
      background: 'linear-gradient(to bottom, rgba(5, 11, 20, 0.95), transparent)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* App Title / Logo */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <div className="w-10 h-10 rounded-full flex items-center justify-center neon-glow-cyan" style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '2px solid rgba(6, 182, 212, 0.6)'
        }}>
          <Compass size={20} className="text-cyan-400" style={{
            filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))'
          }} />
        </div>
        <div>
          <h1 className="text-base font-black text-white tracking-tight neon-text-cyan">AERIS MAP</h1>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">Live Discovery</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Network / Data Streams Toggle Button */}
        <button
          onClick={onToggleNetworkPanel}
          className="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-90 touch-manipulation"
          style={{
            background: 'rgba(10, 14, 26, 0.7)',
            backdropFilter: 'blur(10px)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
          }}
        >
          <Activity size={18} className="text-cyan-400" />
        </button>

        <button className="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-90 touch-manipulation" style={{
          background: 'rgba(10, 14, 26, 0.6)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <Bell size={18} className="text-gray-300" />
        </button>

        <button className="w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-90 touch-manipulation" style={{
          background: 'rgba(10, 14, 26, 0.6)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <UserIcon size={18} className="text-gray-300" />
        </button>
      </div>
    </div>
  );
};
