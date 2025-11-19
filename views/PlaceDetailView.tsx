import React from 'react';
import { Place } from '../types';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { X, MapPin, Play, Image as ImageIcon, FileText, Music, Video } from 'lucide-react';

interface PlaceDetailViewProps {
  place: Place;
  onClose: () => void;
}

export const PlaceDetailView: React.FC<PlaceDetailViewProps> = ({ place, onClose }) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <GlassPanel className="relative w-full max-w-md max-h-[90vh] overflow-y-auto !p-0 !rounded-t-[40px] sm:!rounded-[40px] border-t border-white/20 sm:border shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Hero Image */}
        <div className="relative h-64 w-full">
          <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-transparent to-transparent"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 -mt-12 relative z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide">{place.name}</h2>
            <p className="text-gray-400 text-sm mb-3">{place.address}</p>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <MapPin size={14} />
              <span>{place.distance} • Real-time Location</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4">
            {[
              { label: 'Short Videos', active: true },
              { label: 'Images', active: false },
              { label: 'PDFs', active: false },
              { label: 'Audio', active: false },
              { label: 'Description', active: false },
            ].map((tab, i) => (
              <button 
                key={i}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-medium border transition-all
                  ${tab.active 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-8">
            {place.description}
          </p>

          {/* Main Action */}
          <Button variant="primary" size="lg" className="w-full mb-8 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <span>View in AR</span>
          </Button>

          {/* Visitor Uploads */}
          <div className="flex justify-between items-center px-4">
             <div className="flex gap-4">
               {[
                 { icon: <Video size={18} />, color: 'text-white' },
                 { img: 'https://picsum.photos/id/64/100/100' },
                 { icon: <Music size={18} />, color: 'text-purple-300' },
                 { icon: <FileText size={18} />, color: 'text-cyan-300' },
               ].map((item, i) => (
                 <div key={i} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
                   {'img' in item ? (
                     <img src={item.img} alt="User" className="w-full h-full object-cover" />
                   ) : (
                     item.icon
                   )}
                   {/* Ring for active items */}
                   {i === 2 && <div className="absolute inset-0 border-2 border-purple-500 rounded-full"></div>}
                 </div>
               ))}
             </div>
             <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <FileText size={18} className="text-gray-400" />
             </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">Visitor Uploads</p>

        </div>
      </GlassPanel>
    </div>
  );
};
