
import React from 'react';
import { Bell, User as UserIcon, Compass, Activity } from 'lucide-react';

interface TopBarProps {
  onToggleNetworkPanel?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleNetworkPanel }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-14 z-40 flex items-center justify-between px-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none pt-[env(safe-area-inset-top)]">
      {/* App Title / Logo */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          <Compass size={18} className="text-cyan-400 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">AERIS MAP</h1>
          <p className="text-[8px] text-gray-400 uppercase tracking-wider">Live World Discovery</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Network / Data Streams Toggle Button */}
        <button 
          onClick={onToggleNetworkPanel}
          className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-cyan-400/50 hover:text-cyan-400 transition-all active:scale-95"
        >
          <Activity size={16} className="text-white" />
        </button>

        <button className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
          <Bell size={16} className="text-white" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
          <UserIcon size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};
