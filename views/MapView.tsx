
import React from 'react';
import { HolographicGlobe } from '../components/3d/HolographicGlobe';
import { Place } from '../types';
import { Search, Filter, MapPin, RotateCcw, Network } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';
import { NetworkFilterType } from '../viewmodels/useAppViewModel';

interface MapViewProps {
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace: (id: string) => void;
  onSelectCluster: (places: Place[]) => void;
  onToggleAR: () => void;
  networkFilter: NetworkFilterType;
  onToggleNetworkFilter: (filter: NetworkFilterType) => void;
  isNetworkPanelOpen: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ 
  places, 
  selectedPlaceId, 
  onSelectPlace, 
  onSelectCluster, 
  onToggleAR,
  networkFilter,
  onToggleNetworkFilter,
  isNetworkPanelOpen
}) => {
  
  const filters: { id: NetworkFilterType; label: string; color: string }[] = [
    { id: 'ALL', label: 'ALL', color: 'bg-white' },
    { id: 'CYBER', label: 'CYBER', color: 'bg-cyan-400' },
    { id: 'NATURE', label: 'NATURE', color: 'bg-green-400' },
    { id: 'CULTURE', label: 'CULTURE', color: 'bg-purple-400' },
    { id: 'ENTERTAINMENT', label: 'FUN', color: 'bg-pink-400' },
    { id: 'OFF', label: 'OFF', color: 'bg-gray-600' }
  ];

  return (
    <div className="relative w-full h-full">
      {/* 3D Background */}
      <HolographicGlobe 
        places={places} 
        selectedPlaceId={selectedPlaceId} 
        onSelectPlace={onSelectPlace} 
        onSelectCluster={onSelectCluster}
        networkFilter={networkFilter}
      />

      {/* Top Overlay - Search */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-16 z-10">
        <div className="flex items-center gap-3 p-3 rounded-full mx-2 neon-border-cyan" style={{
          background: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(20px)'
        }}>
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search Categories & Filters"
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1 text-sm touch-manipulation"
          />
          <div className="w-px h-6 bg-cyan-500/30 mx-1"></div>
          <Button variant="ghost" size="sm" className="!p-2 hover:bg-cyan-500/20 transition-colors active:scale-95">
            <Filter className="w-5 h-5 text-cyan-400" />
          </Button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto px-2 pb-2 no-scrollbar">
          {['Restaurants', 'Bars & Clubs', 'Shops', 'Leisure', 'Events'].map((cat) => (
            <button
              key={cat}
              className="whitespace-nowrap px-4 py-2 rounded-full border text-xs font-bold text-gray-300 hover:text-white hover:border-cyan-500/50 transition-all active:scale-95"
              style={{
                background: 'rgba(10, 14, 26, 0.7)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Network Filter UI (Bottom Right) - CONTROLLABLE VISIBILITY */}
      {isNetworkPanelOpen && (
        <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2 animate-in slide-in-from-right duration-300">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
            <div className="flex items-center gap-1 mb-2 px-1">
              <Network size={12} className="text-gray-400" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Data Streams</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {filters.map(f => {
                const isActive = networkFilter === f.id;
                return (
                  <button 
                    key={f.id}
                    onClick={() => onToggleNetworkFilter(f.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                      <div className={`w-1.5 h-1.5 rounded-full ${f.color} ${isActive ? 'shadow-[0_0_8px_currentColor]' : 'opacity-50'}`}></div>
                      <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AR Toggle (Bottom Center) - Enhanced */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto relative group">
           {/* Animated Rings - More vibrant */}
           <div className="absolute inset-0 -m-5 rounded-full border-2 border-cyan-500/40 animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute inset-0 -m-3 rounded-full border-2 border-purple-500/40 animate-[spin_7s_linear_infinite_reverse]"></div>
           <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl animate-pulse"></div>

           <button
            onClick={onToggleAR}
            className="relative w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(6, 182, 212, 0.5)',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(168, 85, 247, 0.3)'
            }}
           >
             <span className="text-3xl font-black neon-text-cyan" style={{
               background: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent'
             }}>AR</span>
           </button>
           <div className="absolute top-full mt-3 w-full text-center">
             <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">AR View</span>
           </div>
        </div>
      </div>
    </div>
  );
};
