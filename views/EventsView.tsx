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
    <div className="w-full h-full overflow-hidden flex flex-col pt-12 pb-24 px-4 relative bg-gradient-to-b from-[#050b14] to-[#0f172a]">
       {/* Header */}
       <div className="mb-6">
         <h1 className="text-2xl font-bold text-white mb-1 text-center">LIVE EVENTS</h1>
         <div className="flex justify-center gap-2 mb-6">
            {['Around Me', 'Live', 'Today', 'Global'].map((filter, i) => (
              <button 
                key={filter} 
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  i === 1 
                  ? 'bg-white/10 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                  : 'bg-transparent border-white/20 text-gray-400 hover:border-white/40'
                }`}
              >
                {filter}
              </button>
            ))}
         </div>
       </div>

       {/* List */}
       <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1 scrollbar-hide">
         {events.map(event => (
           <div key={event.id} className="relative group cursor-pointer">
             <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <GlassPanel className="relative overflow-hidden !p-0 !rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-colors">
               
               {/* Image Background */}
               <div className="h-32 w-full relative">
                 <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] to-transparent"></div>
                 
                 {/* Status Badge */}
                 <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      event.status === 'LIVE' ? 'bg-pink-600 text-white' : 
                      event.status === 'RECORDED' ? 'bg-purple-600 text-white' : 'bg-blue-600'
                    }`}>
                      {event.status}
                    </span>
                 </div>
               </div>
               
               <div className="p-4">
                 <h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                       <MapPin size={12} className="text-cyan-400" /> {event.locationName}
                     </p>
                     <span className="text-[10px] text-gray-500 font-mono">{event.distance}</span>
                   </div>
                   
                 </div>
               </div>
             </GlassPanel>
           </div>
         ))}
       </div>
    </div>
  );
};
