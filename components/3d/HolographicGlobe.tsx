
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points, PointMaterial, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Place } from '../../types';

// Augment JSX namespace to support React Three Fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshPhongMaterial: any;
      pointLight: any;
      sphereGeometry: any;
      cylinderGeometry: any;
    }
  }
}

// Augment React's JSX namespace specifically for React 18+ type definitions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      group: any;
      mesh: any;
      meshBasicMaterial: any;
      meshPhongMaterial: any;
      pointLight: any;
      sphereGeometry: any;
      cylinderGeometry: any;
    }
  }
}

// Helper to convert lat/lon to 3D position
const calcPosFromLatLonRad = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z] as [number, number, number];
};

interface GlobeProps {
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace: (id: string) => void;
  onSelectCluster: (places: Place[]) => void;
}

const GlowingSphere = () => {
  return (
    <group>
       {/* Inner Dark Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#030712"
          emissive="#0e1b33"
          emissiveIntensity={0.2}
          shininess={20}
          transparent={true}
          opacity={0.95}
          wireframe={false}
        />
      </Sphere>
      {/* Wireframe overlay */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.05}
        />
      </Sphere>
    </group>
  );
};

// --- CLUSTER MARKER ---
const ClusterMarker: React.FC<{ position: [number, number, number]; count: number; onClick: () => void }> = ({ position, count, onClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Look at camera
      groupRef.current.lookAt(state.camera.position);
      
      // Pulse animation on hover
      const scale = hovered ? 1.3 : 1.0;
      const pulse = hovered ? 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1 : 1;
      
      groupRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={(e) => setHover(false)}
    >
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#a855f7" toneMapped={false} />
      </mesh>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
      </mesh>
      <Html center>
        <div 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClick();
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_10px_purple] cursor-pointer pointer-events-auto"
        >
          <span className="text-[10px] font-bold text-white">{count}</span>
        </div>
      </Html>
    </group>
  );
};

// --- SINGLE PLACE MARKER (PIN) ---
const PlaceMarker: React.FC<{ 
  position: [number, number, number]; 
  selected: boolean;
  onClick: () => void;
}> = ({ position, selected, onClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Look at camera so the pin always faces user
      meshRef.current.lookAt(state.camera.position);
      
      const scale = selected || hovered ? 1.5 : 1.0;
      // Pulsing effect if selected
      const pulse = selected ? 1 + Math.sin(state.clock.elapsedTime * 5) * 0.1 : 1;
      meshRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <group 
      ref={meshRef} 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      cursor="pointer"
    >
      {/* Pin Stem */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.005, 0.005, 0.16, 8]} />
        <meshBasicMaterial color={selected ? "#ff00ff" : "#06b6d4"} />
      </mesh>
      
      {/* Pin Head */}
      <mesh position={[0, 0, 0.16]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={selected ? "#ff00ff" : "#06b6d4"} toneMapped={false} />
      </mesh>
      
      {/* Selection Halo */}
      {selected && (
        <mesh position={[0, 0, 0.16]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ff00ff" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};

interface ClusterData {
  type: 'cluster';
  position: [number, number, number];
  places: Place[];
  id: string;
}

interface SingleData {
  type: 'single';
  position: [number, number, number];
  place: Place;
  id: string;
}

type MarkerData = ClusterData | SingleData;

const Scene: React.FC<GlobeProps> = ({ places, selectedPlaceId, onSelectPlace, onSelectCluster }) => {
  
  // --- CLUSTERING ALGORITHM ---
  const markers = useMemo(() => {
    const result: MarkerData[] = [];
    const processed = new Set<string>();
    const CLUSTER_THRESHOLD = 0.15; // Distance threshold in 3D units

    places.forEach(place => {
      if (processed.has(place.id)) return;

      const p1Pos = calcPosFromLatLonRad(place.coordinates.lat, place.coordinates.lng, 2.05);
      const clusterGroup: Place[] = [place];
      processed.add(place.id);

      // Check all other places
      places.forEach(other => {
        if (place.id === other.id || processed.has(other.id)) return;
        
        const p2Pos = calcPosFromLatLonRad(other.coordinates.lat, other.coordinates.lng, 2.05);
        const dist = new THREE.Vector3(...p1Pos).distanceTo(new THREE.Vector3(...p2Pos));
        
        if (dist < CLUSTER_THRESHOLD) {
           clusterGroup.push(other);
           processed.add(other.id);
        }
      });

      if (clusterGroup.length > 1) {
        result.push({
          type: 'cluster',
          id: `cluster-${place.id}`,
          position: p1Pos, // Use the first place's position for the cluster center
          places: clusterGroup
        });
      } else {
        result.push({
          type: 'single',
          id: place.id,
          position: p1Pos,
          place: place
        });
      }
    });
    return result;
  }, [places]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <GlowingSphere />
      
      {markers.map((marker) => {
        if (marker.type === 'cluster') {
           return (
             <ClusterMarker
               key={marker.id}
               position={marker.position}
               count={marker.places.length}
               onClick={() => {
                 onSelectCluster(marker.places);
               }}
             />
           );
        } else {
           return (
             <PlaceMarker 
               key={marker.id} 
               position={marker.position} 
               selected={selectedPlaceId === marker.place.id}
               onClick={() => onSelectPlace(marker.place.id)}
             />
           );
        }
      })}

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minDistance={2.5} 
        maxDistance={8}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

export const HolographicGlobe: React.FC<GlobeProps> = (props) => {
  return (
    <div className="w-full h-full absolute top-0 left-0 z-0 bg-gradient-to-b from-[#020617] to-[#0f172a]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene {...props} />
      </Canvas>
      
      {/* Decorative grid overlay for "Cyber" feel */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};
