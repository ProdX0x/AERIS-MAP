import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { X, Navigation, Zap, Radar, MapPin, Scan } from 'lucide-react';
import * as THREE from 'three';
import { Place } from '../types';
import { MOCK_PLACES } from '../constants';

// Augment JSX namespace to support React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      cylinderGeometry: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      pointLight: any;
      ringGeometry: any;
    }
  }
}

interface ARViewProps {
  onExit: () => void;
  onSelectPlace: (id: string) => void;
}

const ARMarker = ({ place, position, delay, onSelect }: { place: Place; position: [number, number, number], delay: number, onSelect: (id: string) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
      // Make markers look at the camera
      groupRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Visual Anchor Line */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 3, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </mesh>
      
      {/* Base Ring */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.15, 0.3, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* 
        FIX: Reduced distanceFactor to prevent giant elements on mobile.
        Removed 'sprite' prop to allow proper 3D transform perspective.
      */}
      <Html position={[0, 0, 0]} center transform distanceFactor={3} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center group cursor-pointer pointer-events-none origin-center transition-transform">
          
          {/* Card Container - constrained width for mobile, clickable */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(place.id);
            }}
            className="pointer-events-auto relative bg-black/80 backdrop-blur-xl border border-cyan-500/40 p-3 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] w-[160px] sm:w-[240px] transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:bg-black/90 active:scale-95 cursor-pointer"
          >
             {/* Decorative Corners */}
             <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-cyan-400 rounded-tl"></div>
             <div className="absolute -top-px -right-px w-2 h-2 border-t border-r border-cyan-400 rounded-tr"></div>
             <div className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-cyan-400 rounded-bl"></div>
             <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-cyan-400 rounded-br"></div>
             
             <div className="flex items-start gap-2 mb-2">
               <div className="shrink-0 w-6 h-6 rounded bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center">
                 <MapPin size={12} className="text-cyan-400" />
               </div>
               <div className="overflow-hidden min-w-0">
                 <h3 className="text-white font-bold text-[10px] sm:text-xs leading-tight truncate">{place.name}</h3>
                 <span className="text-[8px] font-mono text-cyan-300 block truncate mt-0.5">{place.distance}</span>
               </div>
             </div>
             
             <p className="text-[9px] text-gray-300 line-clamp-2 leading-relaxed mb-2 opacity-80 hidden sm:block">{place.description}</p>
             
             <button className="w-full py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-[8px] sm:text-[9px] font-bold text-cyan-300 transition-all uppercase flex items-center justify-center gap-1.5">
               <span>View Details</span>
               <Navigation size={8} />
             </button>
          </div>
          
          {/* Connecting Dot & Line */}
          <div className="mt-1 w-[1px] h-8 sm:h-12 bg-gradient-to-b from-cyan-400 to-transparent opacity-80"></div>
          <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan] animate-pulse"></div>
        </div>
      </Html>
    </group>
  );
};

export const ARView: React.FC<ARViewProps> = ({ onExit, onSelectPlace }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            // Use constraints that favor standard mobile aspect ratios
            width: { ideal: 1280 }, 
            height: { ideal: 720 }
          } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraReady(true);
          };
        }
      } catch (err) {
        console.warn("AR Camera Error:", err);
        setPermissionDenied(true);
        setCameraReady(true); // Fallback to simulation
      }
    };
    
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Generate circular positions for mock places
  const arPlaces = React.useMemo(() => MOCK_PLACES.map((place, i) => {
    const angle = (i * (Math.PI * 2)) / MOCK_PLACES.length; // Even spread
    const radius = 5; // 5 meters radius
    // Push them slightly further back (z -6) so they don't start "in" the user
    return {
      ...place,
      position: [Math.sin(angle) * radius, 0, -6 + (-Math.cos(angle) * radius)] as [number, number, number]
    };
  }), []);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden animate-in fade-in duration-500 font-sans">
      {/* Camera Feed / Background */}
      <video 
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${cameraReady && !permissionDenied ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        muted
        autoPlay
      />
      
      {/* Fallback Image (Cyberpunk City) */}
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-700 ${cameraReady && !permissionDenied ? 'opacity-0' : 'opacity-40'}`}></div>
      
      {/* HUD Overlay Layer */}
      <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between">
         
         {/* Tech Grid Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)]"></div>
         
         {/* Top HUD Bar - Safe Area Aware */}
         <div className="w-full px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-4 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px] ${permissionDenied ? 'bg-red-500 shadow-red-500' : 'bg-green-500 shadow-green-500'}`}></div>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                    {permissionDenied ? 'SIMULATOR' : 'LIVE FEED'}
                  </span>
               </div>
               <h1 className="text-lg font-black text-white tracking-tighter italic leading-none">
                 VISION<span className="text-cyan-400">AR</span>
               </h1>
            </div>
            
            <div className="flex gap-3 items-center">
                {/* Radar Widget */}
                <div className="w-10 h-10 rounded-full bg-black/40 border border-cyan-500/30 backdrop-blur-md relative flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-50"></div>
                   <div className="w-full h-[1px] bg-cyan-500/20 absolute top-1/2"></div>
                   <div className="h-full w-[1px] bg-cyan-500/20 absolute left-1/2"></div>
                   {/* Sweep Animation */}
                   <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.2)_360deg)] animate-[spin_3s_linear_infinite]"></div>
                   {/* Blips */}
                   {arPlaces.map((_, i) => (
                      <div key={i} className="absolute w-0.5 h-0.5 bg-white rounded-full" style={{ 
                        top: `${50 + Math.sin(i)*30}%`, 
                        left: `${50 + Math.cos(i)*30}%` 
                      }}></div>
                   ))}
                </div>

                <button 
                  onClick={onExit}
                  className="group relative w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-red-500/20 hover:border-red-500/50 active:scale-95"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
            </div>
         </div>
         
         {/* Center Reticle */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[300px] max-h-[300px] opacity-40 pointer-events-none">
             <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_30s_linear_infinite]">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.2" fill="none" className="text-cyan-400" strokeDasharray="4 4" />
                <path d="M 50 5 L 50 15 M 50 85 L 50 95 M 5 50 L 15 50 M 85 50 L 95 50" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <Scan className="text-cyan-400/50 w-8 h-8 animate-pulse" />
             </div>
         </div>

         {/* Bottom Status Bar - Safe Area Aware */}
         <div className="w-full px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto">
            {/* Navigation Prompt */}
            <div className="text-center mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-black/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-widest backdrop-blur-md animate-pulse">
                 Locating Targets...
              </span>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-3 gap-2">
               {[
                 { label: 'SENSORS', value: 'ACTIVE', color: 'text-green-400' },
                 { label: 'DETECTED', value: `${arPlaces.length} POI`, color: 'text-cyan-400' },
                 { label: 'GPS', value: 'LOCKED', color: 'text-yellow-400' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-2 backdrop-blur-sm text-center">
                    <p className="text-[8px] text-gray-500 tracking-widest mb-0.5">{stat.label}</p>
                    <p className={`text-[10px] font-bold font-mono ${stat.color}`}>{stat.value}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 0], fov: 70 }}>
           <ambientLight intensity={1} />
           <pointLight position={[10, 10, 10]} intensity={1.5} />
           
           {arPlaces.map((place, i) => (
             <ARMarker 
               key={place.id} 
               place={place} 
               position={place.position} 
               delay={i}
               onSelect={onSelectPlace}
             />
           ))}
        </Canvas>
      </div>
    </div>
  );
};