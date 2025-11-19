import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Points, PointMaterial, Stars } from '@react-three/drei';
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
  onSelectPlace: (id: string) => void;
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

const PlaceMarker: React.FC<{ position: [number, number, number]; onClick: () => void }> = ({ position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = hovered ? 1.5 : 1.0;
      // Pulsing effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <mesh 
      position={position} 
      ref={meshRef} 
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={hovered ? "#ff00ff" : "#00ffff"} toneMapped={false} />
    </mesh>
  );
};

const Scene: React.FC<GlobeProps> = ({ places, onSelectPlace }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#4f46e5" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <GlowingSphere />
      
      {places.map((place) => {
        const pos = calcPosFromLatLonRad(place.coordinates.lat, place.coordinates.lng, 2.05);
        return (
          <PlaceMarker 
            key={place.id} 
            position={pos} 
            onClick={() => onSelectPlace(place.id)}
          />
        );
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