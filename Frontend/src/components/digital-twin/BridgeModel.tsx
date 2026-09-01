import React, { useRef } from 'react';
import * as THREE from 'three';
import SensorHotspot from './SensorHotspot';

interface BridgeModelProps {
  healthScore: number;
  sensors: any[];
}

const BridgeModel: React.FC<BridgeModelProps> = ({ healthScore, sensors }) => {
  const group = useRef<THREE.Group>(null);
  
  // Materials
  const concreteMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.8,
    metalness: 0.2,
  });

  const getSectionMaterial = (index: number) => {
    let color = '#22c55e'; // green
    if (healthScore < 80 && index === 2) color = '#f59e0b'; // amber warning area
    if (healthScore < 50 && index === 3) color = '#ef4444'; // red critical area
    
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.3,
      emissive: color,
      emissiveIntensity: 0.2,
    });
  };

  const roadMaterial = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.9,
    metalness: 0.1,
  });

  const cableMaterial = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.4,
    metalness: 0.8,
  });

  return (
    <group ref={group}>
      {/* Pillars */}
      {[-12, -4, 4, 12].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, -2.5, 0]} material={concreteMaterial}>
          <cylinderGeometry args={[0.8, 1, 5, 16]} />
        </mesh>
      ))}

      {/* Main Deck Structure (split into sections for coloring based on health) */}
      <group position={[0, 0, 0]}>
        {[-15, -5, 5, 15].map((x, i) => (
          <mesh key={`deck-${i}`} position={[x, 0, 0]} material={getSectionMaterial(i)}>
            <boxGeometry args={[10, 0.5, 4]} />
          </mesh>
        ))}
      </group>

      {/* Road Surface */}
      <mesh position={[0, 0.26, 0]} material={roadMaterial}>
        <boxGeometry args={[40, 0.05, 3.8]} />
      </mesh>

      {/* Arches */}
      {[-4, 4].map((z, i) => {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-15, 0.5, z * 0.45),
          new THREE.Vector3(0, 6, z * 0.45),
          new THREE.Vector3(15, 0.5, z * 0.45),
        ]);
        return (
          <mesh key={`arch-${i}`} material={cableMaterial}>
            <tubeGeometry args={[curve, 64, 0.3, 8, false]} />
          </mesh>
        );
      })}

      {/* Vertical Cables */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = -14 + i * 2;
        const yHeight = Math.max(0.5, 6 - Math.pow(x / 5, 2) * 0.5); // parabolic approx
        if (yHeight <= 0.6) return null;
        
        return (
          <group key={`cables-${i}`}>
            <mesh position={[x, yHeight / 2 + 0.25, 1.8]} material={cableMaterial}>
              <cylinderGeometry args={[0.05, 0.05, yHeight, 8]} />
            </mesh>
            <mesh position={[x, yHeight / 2 + 0.25, -1.8]} material={cableMaterial}>
              <cylinderGeometry args={[0.05, 0.05, yHeight, 8]} />
            </mesh>
          </group>
        );
      })}

      {/* Sensors Hotspots */}
      {sensors.map((sensor, i) => {
        // Map sensor to random position on deck for visualization
        const xPos = -15 + (i * (30 / sensors.length)) + Math.random() * 2;
        const zPos = (Math.random() - 0.5) * 3;
        
        return (
          <SensorHotspot 
            key={sensor.id} 
            position={[xPos, 0.5, zPos]} 
            sensor={sensor}
          />
        );
      })}
      
    </group>
  );
};

export default BridgeModel;
