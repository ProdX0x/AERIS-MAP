import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { X, Navigation, Zap } from 'lucide-react';
import * as THREE from 'three';
import { Place } from '../types';
import { MOCK_PLACES } from '../constants';

// Augment JSX namespace to support React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshBasicMaterial: any;
      ringGeometry: any;
    }
  }
}

interface ARViewProps {
  onExit: () => void;
}

const ARMarker = ({ place, position, delay }: { place: Place; position: [number, number, number], delay: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.1;
      // Make markers look at the camera (billboard effect)
      groupRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Visual Anchor Line */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 3, 8]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      
      {/* Base Ring */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.4, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <Html position={[0, 0, 0]} center transform sprite distanceFactor={12} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center group cursor-pointer pointer-events-none">
          <div className="pointer-events-auto relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] min-w-[220px] transition-transform duration-300 hover:scale-105 hover:border-cyan-400 hover:bg-black/80">
             {/* Decorative Corners */}
             <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl"></div>
             <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr"></div>
             <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl"></div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br"></div>
             
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                 <Navigation size={18} className="text-cyan-400" />
               </div>
               <div>
                 <h3 className="text-white font-bold text-sm leading-none mb-1">{place.name}</h3>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 bg-cyan-900/30 rounded border border-cyan-500/20">{place.distance}</span>
                    <span className="text-[10px] text-gray-400">{place.category}</span>
                 </div>
               </div>
             </div>
             <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-3">{place.description}</p>
             
             <button className="w-full py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-500/50 rounded-lg text-[10px] font-bold text-cyan-300 transition-all tracking-wider flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]">
               <span>INITIALIZE ROUTE</span>
               <Navigation size={10} />
             </button>
          </div>
          
          {/* Connecting Dot & Line */}
          <div className="mt-2 w-[1px] h-8 bg-gradient-to-b from-cyan-400 to-transparent"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan] animate-pulse"></div>
        </div>
      </Html>
    </group>
  );
};

export const ARView: React.FC<ARViewProps> = ({ onExit }) => {
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
            width: { ideal: 1920 },
            height: { ideal: 1080 }
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

  // Mock AR positions
  const arPlaces = React.useMemo(() => MOCK_PLACES.map((place, i) => {
    const angle = (i - 1) * 0.8; // Spread horizontally
    return {
      ...place,
      position: [Math.sin(angle) * 3, 0.5, -4 - Math.abs(Math.cos(angle))] as [number, number, number]
    };
  }), []);

  return (
    <div className="absolute inset-0 z-50 bg-black overflow-hidden animate-in fade-in duration-500">
      {/* Camera Feed / Background */}
      <video 
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${cameraReady && !permissionDenied ? 'opacity-100' : 'opacity-0'}`}
        playsInline
        muted
        autoPlay
      />
      
      {/* Fallback Image (Cyberpunk City) */}
      <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center transition-opacity duration-700 ${cameraReady && !permissionDenied ? 'opacity-0' : 'opacity-60'}`}></div>
      
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Grid Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,20,0.8)_100%)]"></div>
         
         {/* Scanlines */}
         <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>

         {/* Top HUD */}
         <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-start pointer-events-auto z-20">
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                    {permissionDenied ? 'SIMULATION_MODE' : 'LIVE_FEED_ACTIVE'}
                  </span>
               </div>
               <h1 className="text-xl font-black text-white tracking-tight italic">VISION<span className="text-cyan-400">AR</span></h1>
            </div>
            <button 
              onClick={onExit}
              className="group relative w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-red-500/20 hover:border-red-500/50"
            >
               <X size={20} className="group-hover:rotate-90 transition-transform" />
            </button>
         </div>
         
         {/* Center Reticle */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-20 pointer-events-none">
             <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_20s_linear_infinite]">
                <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.2" fill="none" className="text-cyan-400" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-cyan-400" strokeDasharray="10 20" />
             </svg>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
         </div>

         {/* Bottom Status */}
         <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center pointer-events-auto z-20 px-4">
            <div className="px-6 py-3 bg-[#050b14]/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
               <div className="flex items-center gap-2">
                 <Zap size={14} className="text-yellow-400" />
                 <span className="text-[10px] font-mono text-gray-300 tracking-wider">SENSORS: OK</span>
               </div>
               <div className="h-3 w-px bg-white/10"></div>
               <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">{arPlaces.length} POI DETECTED</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-3 font-mono">MOVE DEVICE TO EXPLORE</p>
         </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 0], fov: 50 }}>
           <ambientLight intensity={0.8} />
           <pointLight position={[10, 10, 10]} intensity={1} />
           
           {arPlaces.map((place, i) => (
             <ARMarker 
               key={place.id} 
               place={place} 
               position={place.position} 
               delay={i}
             />
           ))}
        </Canvas>
      </div>
    </div>
  );
};