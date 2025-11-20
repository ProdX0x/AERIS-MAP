
import React from 'react';
import { Place } from '../types';
import { GlassPanel } from '../components/ui/GlassPanel';
import { X, MapPin, ChevronRight, Layers } from 'lucide-react';

interface ClusterListViewProps {
  places: Place[];
  onSelectPlace: (id: string) => void;
  onClose: () => void;
}

export const ClusterListView: React.FC<ClusterListViewProps> = ({ places, onSelectPlace, onClose }) => {
  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="absolute inset-0" onClick={onClose}></div>
       
       <GlassPanel className="relative w-full max-w-sm max-h-[60vh] overflow-hidden flex flex-col !p-0 !rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-white/10 ring-1 ring-purple-500/20">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center border border-purple-500/30">
                   <Layers size={18} className="text-purple-400" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-white leading-tight">Cluster Detected</h2>
                    <p className="text-[10px] text-purple-300 font-mono uppercase tracking-wider">{places.length} EVENTS FOUND</p>
                </div>
             </div>
             <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <X size={18} />
             </button>
          </div>

          {/* List */}
          <div className="overflow-y-auto p-2 space-y-2 scrollbar-hide">
             {places.map((place) => (
                <button 
                  key={place.id}
                  onClick={() => onSelectPlace(place.id)}
                  className="w-full text-left p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-cyan-500/30 transition-all group flex items-center gap-3 relative overflow-hidden"
                >
                   {/* Hover gradient bg */}
                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                   
                   {/* Thumbnail */}
                   <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0 relative border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                      <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                   </div>
                   
                   {/* Info */}
                   <div className="flex-1 min-w-0 relative z-10">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{place.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                         <MapPin size={10} className="text-cyan-500" />
                         <span className="truncate uppercase">{place.category} • {place.distance}</span>
                      </div>
                   </div>

                   <ChevronRight size={16} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
             ))}
          </div>
          
          <div className="p-3 bg-white/5 border-t border-white/10 text-center">
            <p className="text-[9px] text-gray-500">Select an event to view full details</p>
          </div>
       </GlassPanel>
    </div>
  );
};
