
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points, PointMaterial, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Place } from '../../types';
import { NetworkFilterType } from '../../viewmodels/useAppViewModel';

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
  networkFilter: NetworkFilterType;
}

const GlowingSphere = () => {
  return (
    <group>
       {/* Inner Dark Sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#0a1628"
          emissive="#1e3a5f"
          emissiveIntensity={0.4}
          shininess={30}
          transparent={true}
          opacity={0.9}
          wireframe={false}
        />
      </Sphere>
      {/* Wireframe overlay - Enhanced */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>
      {/* Additional glow layer */}
      <Sphere args={[2.02, 24, 24]}>
        <meshBasicMaterial
          color="#22d3ee"
          wireframe
          transparent
          opacity={0.08}
        />
      </Sphere>
    </group>
  );
};

// --- DYNAMIC DATA ARCS COMPONENT ---
const DataArcs: React.FC<{ places: Place[], filter: NetworkFilterType }> = ({ places, filter }) => {
  const connections = useMemo(() => {
    // If filter is OFF, return no lines
    if (filter === 'OFF') return [];

    const lines: { start: THREE.Vector3, end: THREE.Vector3, color: string, speed: number }[] = [];
    
    // Group places by category
    const grouped: Record<string, Place[]> = {};
    places.forEach(p => {
      const cat = p.category.toUpperCase();
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    // Define colors for categories
    const colors: Record<string, string> = {
      'CYBER': '#06b6d4', // Cyan
      'NATURE': '#22c55e', // Green
      'CULTURE': '#a855f7', // Purple
      'ENTERTAINMENT': '#ec4899', // Pink
      'TRANSPORT': '#f59e0b' // Orange
    };

    // Determine which categories to render based on filter
    const categoriesToRender = filter === 'ALL' ? Object.keys(grouped) : [filter];

    categoriesToRender.forEach(cat => {
      const group = grouped[cat];
      if (group && group.length > 1) {
        // Create connections between places in the same category
        for (let i = 0; i < group.length; i++) {
          // Connect to the next one in the list to form a chain, looping back to start
          const startPlace = group[i];
          const endPlace = group[(i + 1) % group.length];

          const startPos = new THREE.Vector3(...calcPosFromLatLonRad(startPlace.coordinates.lat, startPlace.coordinates.lng, 2));
          const endPos = new THREE.Vector3(...calcPosFromLatLonRad(endPlace.coordinates.lat, endPlace.coordinates.lng, 2));
          
          lines.push({
            start: startPos,
            end: endPos,
            color: colors[cat] || '#ffffff',
            speed: 0.3 + Math.random() * 0.4
          });
        }
      }
    });

    return lines;
  }, [places, filter]);

  return (
    <group>
      {connections.map((conn, i) => (
        <Arc key={i} start={conn.start} end={conn.end} color={conn.color} speed={conn.speed} />
      ))}
    </group>
  );
};

interface ArcProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  speed: number;
}

const Arc: React.FC<ArcProps> = ({ start, end, color, speed }) => {
  const curve = useMemo(() => {
    // Calculate control point (midpoint but higher up)
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(3.0); // Height of arc
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.005, 8, false);
  }, [curve]);

  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * speed) % 1;
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Static faint line */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      
      {/* Moving Data Packet */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
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
      {/* INVISIBLE HITBOX FOR EASIER CLICKING - Using transparent instead of visible=false for better raycasting */}
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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
      {/* INVISIBLE HITBOX FOR EASIER CLICKING */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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

const Scene: React.FC<GlobeProps> = ({ places, selectedPlaceId, onSelectPlace, onSelectCluster, networkFilter }) => {
  
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
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={2.0} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#a855f7" />
      <pointLight position={[0, 10, 0]} intensity={1.0} color="#22d3ee" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <GlowingSphere />
      
      {/* GLOBAL DATA NETWORK ARCS */}
      <DataArcs places={places} filter={networkFilter} />
      
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
    <div className="w-full h-full absolute top-0 left-0 z-0" style={{
      background: 'radial-gradient(circle at 50% 50%, #0f1629 0%, #050b14 50%, #020408 100%)'
    }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
      }}></div>

      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Scene {...props} />
      </Canvas>

      {/* Decorative grid overlay for "Cyber" feel */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};
