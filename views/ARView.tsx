import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, DeviceOrientationControls, OrbitControls } from '@react-three/drei';
import { X, Navigation, Zap, Radar, MapPin, Scan, Compass, Move, Smartphone, MousePointer2, Info, Target } from 'lucide-react';
import * as THREE from 'three';
import { Place } from '../types';
import { MOCK_PLACES } from '../constants';
import { Button } from '../components/ui/Button';

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
      sphereGeometry: any;
      coneGeometry: any;
    }
  }
}

// Augment React's JSX namespace specifically for React 18+ type definitions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      cylinderGeometry: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      pointLight: any;
      ringGeometry: any;
      sphereGeometry: any;
      coneGeometry: any;
    }
  }
}

interface ARViewProps {
  onExit: () => void;
  onSelectPlace: (id: string) => void;
}

// --- Components ---

const ARMarker = ({ 
  place, 
  position, 
  onSelect 
}: { 
  place: Place; 
  position: [number, number, number], 
  onSelect: (id: string) => void 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [distance, setDistance] = useState(0);
  const [isFar, setIsFar] = useState(true); // Default to far
  const [isClicked, setIsClicked] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      // 1. Orientation: Look at camera
      groupRef.current.lookAt(state.camera.position);

      // 2. Distance Calculation
      const dist = state.camera.position.distanceTo(groupRef.current.position);
      setDistance(dist);
      
      // 3. LOD Logic
      setIsFar(dist > 12);
    }
  });

  const handleSelect = (e: any) => {
    e.stopPropagation();
    setIsClicked(true);
    setTimeout(() => {
      onSelect(place.id);
      setIsClicked(false);
    }, 150);
  };

  return (
    <group ref={groupRef} position={position}>
      {/* --- NEAR VIEW (Detailed Card) --- */}
      {!isFar && (
        <group>
          {/* Anchor Line to Ground (Visual tether) */}
          <mesh position={[0, -2, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 4, 8]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
          </mesh>
          
          {/* Ground Ring */}
          <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.4, 32]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>

          <Html position={[0, 0, 0]} center transform distanceFactor={4} zIndexRange={[100, 0]}>
            <div className={`flex flex-col items-center group cursor-pointer pointer-events-none origin-center transition-all duration-300 animate-in zoom-in ${isClicked ? 'scale-95' : ''}`}>
              
              {/* Card Container with Scanning Effect */}
              <div 
                onClick={handleSelect}
                className={`
                  pointer-events-auto relative bg-black/80 backdrop-blur-xl 
                  border p-3 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.2)] 
                  w-[160px] sm:w-[240px] transition-all duration-200 
                  overflow-hidden
                  ${isClicked ? 'border-white bg-cyan-900/60' : 'border-cyan-500/50 hover:border-cyan-300 hover:bg-black/90'}
                `}
              >
                 {/* Scanning Line Animation */}
                 <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[50%] w-full animate-[scan_3s_linear_infinite] -translate-y-full"></div>

                 {/* Decorative Corners */}
                 <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-md"></div>
                 <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
                 <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-md"></div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-md"></div>
                 
                 <div className="flex items-start gap-2 mb-2 relative z-10">
                   <div className="shrink-0 w-7 h-7 rounded bg-cyan-950 border border-cyan-500/30 flex items-center justify-center">
                     <MapPin size={14} className="text-cyan-400" />
                   </div>
                   <div className="overflow-hidden min-w-0">
                     <h3 className="text-white font-bold text-[10px] sm:text-xs leading-tight truncate">{place.name}</h3>
                     <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[9px] font-mono text-cyan-300 block truncate">{Math.round(distance)}m • LIVE</span>
                     </div>
                   </div>
                 </div>
                 
                 <button className="relative z-10 w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-[9px] font-bold text-cyan-300 transition-all uppercase flex items-center justify-center gap-1.5 group-hover:bg-cyan-500/30 group-hover:text-white">
                   <span>Initialize Link</span>
                   <Navigation size={10} />
                 </button>
              </div>
              
              {/* Connecting Line */}
              <div className="mt-1 w-[1px] h-8 bg-gradient-to-b from-cyan-400 to-transparent opacity-80"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]"></div>
            </div>
          </Html>
        </group>
      )}

      {/* --- FAR VIEW (Beacon / Anchor) --- */}
      {isFar && (
        <group onClick={(e) => { e.stopPropagation(); }}>
          {/* Rotating Targeting Rings */}
          <mesh rotation={[0, 0, 0]}>
             <ringGeometry args={[0.3, 0.32, 32]} />
             <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
          
          {/* Vertical Spike/Beacon */}
          <mesh position={[0, 0.5, 0]}>
            <coneGeometry args={[0.05, 1, 4]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} wireframe />
          </mesh>

           <Html position={[0, 1.2, 0]} center distanceFactor={10}>
              <div className="flex flex-col items-center animate-in fade-in duration-500">
                <div className="bg-black/60 backdrop-blur-md border border-cyan-500/50 px-2 py-1 rounded-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Target size={10} className="text-cyan-400" />
                  <span className="text-[9px] font-mono text-cyan-100 whitespace-nowrap tracking-wider">
                    {place.name.toUpperCase().slice(0, 12)}...
                  </span>
                </div>
                <div className="w-px h-4 bg-cyan-500/50"></div>
                <div className="bg-black/80 text-[8px] text-cyan-400 font-bold px-1.5 rounded border border-cyan-900">
                  {Math.round(distance)}m
                </div>
              </div>
           </Html>
        </group>
      )}
    </group>
  );
};

const CompassStrip = () => {
  // A simple visual CSS compass strip
  return (
    <div className="absolute top-16 left-0 right-0 flex justify-center pointer-events-none opacity-60 overflow-hidden">
      <div className="w-[300px] h-8 relative mask-linear-fade">
         <div className="absolute inset-0 flex items-center justify-between px-4 text-cyan-400/50 font-mono text-xs font-bold">
            <span>W</span>
            <div className="w-px h-2 bg-current"></div>
            <span className="text-white text-sm shadow-glow">N</span>
            <div className="w-px h-2 bg-current"></div>
            <span>E</span>
         </div>
         {/* Ticks */}
         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>
    </div>
  );
};

const HelpOverlay = ({ onDismiss }: { onDismiss: () => void }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-500 p-6">
    <div className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
       {/* Neon Line */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 animate-gradient-x"></div>
       
       <div className="flex justify-center mb-5 relative">
         <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full scale-150"></div>
         <div className="w-16 h-16 rounded-full bg-[#050b14] border border-cyan-500/30 flex items-center justify-center relative z-10">
            <Scan size={32} className="text-cyan-400" />
         </div>
       </div>
       
       <h2 className="text-xl font-bold text-white text-center mb-2 tracking-tight">VisionAR Active</h2>
       <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed px-4">
         Augmented Reality interface initialized. Sensors calibrated.
       </p>
       
       <div className="space-y-3 mb-8">
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10">
               <Smartphone size={14} className="text-cyan-400" />
             </div>
             <p className="text-xs text-gray-300">Rotate device to scan markers</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10">
               <Move size={14} className="text-purple-400" />
             </div>
             <p className="text-xs text-gray-300">Use slider or walk to approach</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
             <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10">
               <MousePointer2 size={14} className="text-green-400" />
             </div>
             <p className="text-xs text-gray-300">Tap cards for full intel</p>
          </div>
       </div>
       
       <Button onClick={onDismiss} className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-none shadow-[0_0_20px_rgba(6,182,212,0.3)]">
         INITIALIZE SYSTEM
       </Button>
    </div>
  </div>
);

// --- Main View ---

export const ARView: React.FC<ARViewProps> = ({ onExit, onSelectPlace }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [simulatedDistance, setSimulatedDistance] = useState(0);

  // Handle Camera Feed
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setCameraReady(true);
          };
        }
      } catch (err) {
        console.warn("Camera Error:", err);
        setCameraReady(true); 
      }
    };
    startCamera();
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  // Request Orientation Permissions
  const requestAccess = async () => {
    try {
      const DOE = (window as any).DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === 'function') {
        const permissionState = await DOE.requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          setShowHelp(true);
        } else {
          // Fallback even if denied
          setPermissionGranted(true);
          setShowHelp(true);
        }
      } else {
        setPermissionGranted(true);
        setShowHelp(true);
      }
    } catch (e) {
      setPermissionGranted(true);
      setShowHelp(true);
    }
  };

  // Mock Places positioning
  const arPlaces = useMemo(() => {
    return MOCK_PLACES.map((place, i) => {
      const angle = (i * (Math.PI * 2)) / MOCK_PLACES.length;
      const baseRadius = 10 + (i * 5); 
      const zPos = -baseRadius + simulatedDistance; 
      
      return {
        ...place,
        position: [
          Math.sin(angle) * baseRadius, 
          0,                            
          zPos                          
        ] as [number, number, number]
      };
    });
  }, [simulatedDistance]);

  // --- Render: Permission Screen ---
  if (!permissionGranted) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050b14] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-[ping_2s_linear_infinite]"></div>
           <Compass size={48} className="text-cyan-400 animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3">System Access</h2>
        <p className="text-gray-400 text-sm mb-10 max-w-xs leading-relaxed">
          VisionAR requires sensor fusion to overlay digital intelligence on your physical world.
        </p>
        <div className="flex gap-4 w-full max-w-xs">
           <Button variant="outline" onClick={onExit} className="flex-1 border-white/10 hover:bg-white/5">Abort</Button>
           <Button onClick={requestAccess} className="flex-1 bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)]">Initialize</Button>
        </div>
      </div>
    );
  }

  // --- Render: AR View ---
  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden font-sans">
      {/* Video Background */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        playsInline
        muted
        autoPlay
      />
      
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* Help Overlay */}
      {showHelp && <HelpOverlay onDismiss={() => setShowHelp(false)} />}
      
      {/* HUD Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] px-4">
        
        {/* Top Bar */}
        <div className="flex justify-between items-start pointer-events-auto relative z-50">
          <div>
            <div className="flex items-center gap-2 mb-1 bg-black/40 backdrop-blur rounded-full px-2 py-0.5 w-fit border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></div>
              <span className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">
                LIVE_FEED
              </span>
            </div>
            <h1 className="text-2xl font-black text-white italic leading-none tracking-tighter drop-shadow-lg">
              VISION<span className="text-cyan-400">AR</span>
            </h1>
          </div>
          
          <div className="flex gap-3">
             <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-white/10 hover:border-cyan-400/50 transition-all active:scale-95">
               <Info size={20} />
             </button>
             <button onClick={onExit} className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-white backdrop-blur-md hover:bg-red-500/20 hover:border-red-500/50 transition-all active:scale-95">
               <X size={20} />
             </button>
          </div>
        </div>

        <CompassStrip />

        {/* Center Reticle (Refined) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] opacity-40 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_15s_linear_infinite]">
              <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.2" fill="none" className="text-cyan-400" strokeDasharray="4 4" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.1" fill="none" className="text-white" strokeOpacity="0.5" />
              <path d="M50 0 L50 5" stroke="currentColor" className="text-cyan-400" strokeWidth="1" />
              <path d="M50 95 L50 100" stroke="currentColor" className="text-cyan-400" strokeWidth="1" />
              <path d="M0 50 L5 50" stroke="currentColor" className="text-cyan-400" strokeWidth="1" />
              <path d="M95 50 L100 50" stroke="currentColor" className="text-cyan-400" strokeWidth="1" />
           </svg>
           {/* Center Dot */}
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
             <div className="absolute w-8 h-8 border border-cyan-400/30 rounded-full"></div>
           </div>
        </div>

        {/* Bottom Controls */}
        <div className="pointer-events-auto space-y-4">
            
            {/* Simulator Slider (Styled) */}
            <div className="bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/5 mx-2">
              <div className="flex items-center justify-between mb-2 text-cyan-400">
                <div className="flex items-center gap-2">
                   <Move size={12} />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Proximity Simulator</span>
                </div>
                <span className="text-[9px] font-mono">{simulatedDistance.toFixed(1)}m</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="0.1"
                value={simulatedDistance} 
                onChange={(e) => setSimulatedDistance(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_cyan]"
              />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between bg-[#0a101d]/80 backdrop-blur-xl rounded-2xl px-1 py-1 border border-white/10 shadow-xl mx-1 mb-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-black/20 rounded-xl border border-white/5">
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                   <div className="absolute w-full h-full bg-green-500 rounded-full opacity-75 animate-ping"></div>
                   <div className="relative w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                </div>
                <div>
                   <span className="text-[9px] font-bold text-gray-400 block leading-none mb-0.5">SYSTEM</span>
                   <span className="text-[10px] font-mono text-white block leading-none tracking-wider">ONLINE</span>
                </div>
              </div>
              
              <div className="h-8 w-px bg-white/5"></div>
              
              <div className="flex items-center gap-3 px-4 py-2">
                <Radar size={16} className="text-purple-400 animate-pulse" />
                <div className="text-right">
                   <span className="text-[9px] font-bold text-gray-400 block leading-none mb-0.5">TARGETS</span>
                   <span className="text-[10px] font-mono text-white block leading-none tracking-wider">{arPlaces.length} FOUND</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
           <DeviceOrientationControls />
           <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
           
           <ambientLight intensity={1} />
           <pointLight position={[10, 10, 10]} intensity={1.5} />
           
           {arPlaces.map((place) => (
             <ARMarker 
               key={place.id} 
               place={place} 
               position={place.position} 
               onSelect={onSelectPlace}
             />
           ))}
        </Canvas>
      </div>
    </div>
  );
};