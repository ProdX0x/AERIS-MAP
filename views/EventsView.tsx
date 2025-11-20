import React from 'react';
import { Event } from '../types';
import { GlassPanel } from '../components/ui/GlassPanel';
import { MapPin, Clock, Search } from 'lucide-react';

interface EventsViewProps {
  events: Event[];
  searchQuery: string;
  onSearch: (q: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, searchQuery, onSearch }) => {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col pt-12 pb-24 px-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b14] via-[#0a0e1a] to-[#0f172a]">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)'
        }}></div>
      </div>

       {/* Header */}
       <div className="mb-6 relative z-10">
         <h1 className="text-3xl font-black text-white mb-4 text-center tracking-tight">
           <span className="neon-text-cyan">AERIS MAP</span> <span className="text-gray-400">–</span>
           <div className="text-sm font-normal text-gray-400 mt-1">Live World Discovery</div>
         </h1>
         <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {['Around Me', 'Live', 'Today', 'Global'].map((filter, i) => (
              <button
                key={filter}
                className={`px-5 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                  i === 1
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 neon-glow-cyan'
                  : 'bg-white/5 border-white/20 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-300'
                }`}
              >
                {filter}
              </button>
            ))}
         </div>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 relative z-10">
         {events.map(event => (
           <div key={event.id} className="relative group cursor-pointer active:scale-[0.98] transition-transform">
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
             <div className="relative overflow-hidden rounded-3xl border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300" style={{
               background: 'linear-gradient(135deg, rgba(15, 20, 35, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
               backdropFilter: 'blur(20px)'
             }}>

               {/* Image Background */}
               <div className="h-40 w-full relative overflow-hidden">
                 <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/50 to-transparent"></div>

                 {/* Status Badge - Enhanced */}
                 <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      event.status === 'LIVE' ? 'bg-gradient-to-r from-pink-600 to-pink-500 text-white neon-glow-magenta animate-pulse-glow' :
                      event.status === 'RECORDED' ? 'bg-purple-600/80 text-white border border-purple-400/30' : 'bg-blue-600/80 border border-blue-400/30'
                    }`}>
                      {event.status === 'LIVE' && <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>}
                      {event.status}
                    </span>
                 </div>

                 {/* Distance Badge - Bottom Left */}
                 <div className="absolute bottom-3 left-3">
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                     <MapPin size={10} className="text-cyan-400" />
                     <span className="text-[10px] font-bold text-white">{event.distance}</span>
                   </div>
                 </div>
               </div>

               <div className="p-4">
                 <h3 className="text-lg font-bold text-white mb-2 leading-tight">{event.title}</h3>
                 <div className="flex justify-between items-center">
                   <p className="text-xs text-gray-400 flex items-center gap-1.5">
                     <Clock size={12} className="text-purple-400" />
                     {event.locationName}
                   </p>
                   <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">{event.category}</span>
                 </div>
               </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
};
