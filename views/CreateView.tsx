import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { Camera, Image as ImageIcon, Mic, FileText, ChevronDown, ChevronLeft, Loader2 } from 'lucide-react';

interface CreateViewProps {
  onPublish: (data: { title: string; description: string; category: string }) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({ onPublish }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Summer Music Festival 2024',
    description: 'Join us for a weekend of live music, food, and fun under the stars.',
    category: 'Music Festival'
  });

  const handlePublish = () => {
    if (!formData.title) return;

    setIsUploading(true);
    
    // Simulate network upload delay
    setTimeout(() => {
      onPublish(formData);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full overflow-y-auto pt-12 pb-24 px-4 bg-[#050b14]">
      <div className="flex items-center mb-6">
        <ChevronLeft className="text-gray-400 mr-2 cursor-pointer" />
        <h1 className="text-lg font-semibold text-white mx-auto pr-6">PUBLISH NEW EVENT</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" className="flex-1 text-xs border-cyan-500/50 text-cyan-400">AUTOMATIC LOCATION</Button>
        <Button variant="outline" size="sm" className="flex-1 text-xs text-gray-500 border-gray-700">MANUAL LOCATION</Button>
      </div>

      <div className="space-y-6">
        
        {/* Upload Section */}
        <div>
          <label className="text-xs text-gray-400 uppercase font-semibold mb-3 block">Content Upload</label>
          <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5">
             <div className="flex justify-between px-2">
                {[
                  { icon: <Camera />, label: 'SHORT VIDEO' },
                  { icon: <ImageIcon />, label: 'IMAGE' },
                  { icon: <Mic />, label: 'AUDIO' },
                  { icon: <FileText />, label: 'DOCUMENT' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                     <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${i === 0 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                        {item.icon}
                     </div>
                     <span className="text-[8px] text-gray-500 font-medium">{item.label}</span>
                  </div>
                ))}
             </div>
             {/* Progress Bar */}
             <div className="mt-4">
               <div className="flex justify-between text-[10px] mb-1">
                 <span className="text-cyan-400">Uploading...</span>
                 <span className="text-cyan-400">100%</span>
               </div>
               <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-500 w-full"></div>
               </div>
             </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Event Title</label>
            <GlassPanel className="flex items-center justify-between !py-2 !px-4 !rounded-xl border border-white/10 focus-within:border-cyan-500/50 transition-colors">
              <input 
                type="text" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-gray-600"
                placeholder="Enter event title..."
              />
            </GlassPanel>
          </div>

          <div>
             <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Description</label>
             <GlassPanel className="!p-2 !rounded-xl border border-white/10 focus-within:border-cyan-500/50 transition-colors">
               <textarea 
                 value={formData.description}
                 onChange={(e) => setFormData({...formData, description: e.target.value})}
                 className="w-full bg-transparent border-none outline-none text-xs text-gray-300 leading-relaxed resize-none h-20 p-2"
                 placeholder="Describe your event..."
               />
             </GlassPanel>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Schedule</label>
                <GlassPanel className="!py-3 !px-3 !rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>📅</span> Now (Live)
                  </div>
                  <ChevronDown size={14} className="text-gray-500" />
                </GlassPanel>
             </div>
             <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Category</label>
                <GlassPanel className="!py-3 !px-3 !rounded-xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span>📍</span> {formData.category}
                  </div>
                  <ChevronDown size={14} className="text-gray-500" />
                </GlassPanel>
             </div>
          </div>
        </div>

        {/* Preview Area */}
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold mb-2 block">Preview</label>
          <div className="h-32 rounded-2xl border border-white/10 bg-black/30 relative overflow-hidden flex items-center justify-center">
             <div className="flex items-center gap-8">
                {/* Mini Globe Preview */}
                <div className="w-20 h-20 rounded-full border border-cyan-500/30 bg-blue-900/20 shadow-[0_0_20px_rgba(6,182,212,0.2)] relative">
                   <div className="absolute top-2 right-4 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]"></div>
                </div>
                
                {/* Hexagon Preview */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 clip-path-hexagon"></div>
                    <div className="text-center z-10 max-w-[80px]">
                       <p className="text-[8px] font-bold text-white mb-1 truncate">{formData.title}</p>
                       <div className="flex gap-1 justify-center opacity-50">
                         <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                         <div className="w-3 h-3 bg-white/20 rounded-sm"></div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-2">How it appears on map & AR</p>
        </div>

        <Button 
          size="lg" 
          onClick={handlePublish}
          disabled={isUploading}
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 border-none shadow-lg shadow-purple-900/50 disabled:opacity-70"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              PUBLISHING...
            </>
          ) : (
            "PUBLISH EVENT"
          )}
        </Button>

      </div>
    </div>
  );
};