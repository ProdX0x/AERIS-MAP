
import React from 'react';
import { HolographicGlobe } from '../components/3d/HolographicGlobe';
import { Place } from '../types';
import { Search, Filter, MapPin, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassPanel } from '../components/ui/GlassPanel';

interface MapViewProps {
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace: (id: string) => void;
  onSelectCluster: (places: Place[]) => void;
  onToggleAR: () => void;
}

export const MapView: React.FC<MapViewProps> = ({ places, selectedPlaceId, onSelectPlace, onSelectCluster, onToggleAR }) => {
  return (
    <div className="relative w-full h-full">
      {/* 3D Background */}
      <HolographicGlobe 
        places={places} 
        selectedPlaceId={selectedPlaceId} 
        onSelectPlace={onSelectPlace} 
        onSelectCluster={onSelectCluster}
      />

      {/* Top Overlay - Search */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 z-10">
        <GlassPanel className="flex items-center gap-3 p-3 !rounded-full mx-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Categories & Filters" 
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 flex-1 text-sm"
          />
          <div className="w-px h-6 bg-white/20 mx-1"></div>
          <Button variant="ghost" size="sm" className="!p-1">
            <Filter className="w-5 h-5 text-white" />
          </Button>
        </GlassPanel>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto px-2 pb-2 no-scrollbar">
          {['Restaurants', 'Bars & Clubs', 'Shops', 'Leisure', 'Events'].map((cat) => (
            <button 
              key={cat}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AR Toggle (Bottom Center) */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto relative group">
           {/* Animated Rings */}
           <div className="absolute inset-0 -m-4 rounded-full border border-cyan-500/30 animate-[spin_10s_linear_infinite]"></div>
           <div className="absolute inset-0 -m-2 rounded-full border border-purple-500/30 animate-[spin_7s_linear_infinite_reverse]"></div>
           
           <button 
            onClick={onToggleAR}
            className="relative w-16 h-16 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center group-hover:bg-cyan-900/30 transition-all"
           >
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">AR</span>
           </button>
           <div className="absolute top-full mt-2 w-full text-center">
             <span className="text-[10px] text-gray-400 uppercase tracking-widest">AR View</span>
           </div>
        </div>
      </div>
    </div>
  );
};
