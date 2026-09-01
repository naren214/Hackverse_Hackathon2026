import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface SensorHotspotProps {
  position: [number, number, number];
  sensor: any;
  onClick?: (sensor: any) => void;
}

const SensorHotspot: React.FC<SensorHotspotProps> = ({ position, sensor, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const color = sensor.status === 'online' ? '#3b82f6' : sensor.status === 'warning' ? '#f59e0b' : '#ef4444';

  useFrame((state) => {
    if (meshRef.current) {
      // Pulse animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if(onClick) onClick(sensor);
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={hovered ? 1 : 0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Glow effect */}
      <mesh>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2} 
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {hovered && (
        <Html position={[0, 1, 0]} center zIndexRange={[100, 0]} className="pointer-events-none">
          <div className="bg-t-card/90 backdrop-blur-md border border-t-border p-2 rounded-lg shadow-xl text-xs whitespace-nowrap min-w-[120px]">
            <p className="font-bold text-t-text border-b border-t-border pb-1 mb-1">{sensor.name}</p>
            <div className="flex justify-between items-center text-t-text-secondary mt-1">
              <span className="capitalize">{sensor.type}</span>
              <span className="font-mono font-semibold" style={{ color }}>
                {sensor.value.toFixed(1)}{sensor.unit}
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default SensorHotspot;
