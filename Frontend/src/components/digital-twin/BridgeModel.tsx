import React, { useRef } from 'react';
import * as THREE from 'three';
import SensorHotspot from './SensorHotspot';

interface BridgeModelProps {
  healthScore?: number;
  sensors: any[];
  structure?: any;
}

const BridgeModel: React.FC<BridgeModelProps> = ({ healthScore, sensors, structure }) => {
  const group = useRef<THREE.Group>(null);
  
  const score = structure?.healthScore ?? healthScore ?? 100;
  const type = structure?.type?.toLowerCase() || 'bridge';

  // Materials
  const concreteMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.8,
    metalness: 0.2,
  });

  const getSectionMaterial = (index: number) => {
    let color = '#22c55e'; // green
    if (score < 80 && index === 2) color = '#f59e0b'; // amber warning area
    if (score < 50 && index === 3) color = '#ef4444'; // red critical area
    
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

  const glassMaterial = new THREE.MeshStandardMaterial({
    color: '#38bdf8',
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.7
  });

  const renderBridge = () => (
    <>
      {/* Pillars */}
      {[-12, -4, 4, 12].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, -2.5, 0]} material={concreteMaterial}>
          <cylinderGeometry args={[0.8, 1, 5, 16]} />
        </mesh>
      ))}

      {/* Main Deck Structure */}
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
    </>
  );

  const renderFlyover = () => {
    // Curved deck with central pillars
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 5, -10),
      new THREE.Vector3(-10, 5, -5),
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(10, 5, 5),
      new THREE.Vector3(20, 5, 10),
    ]);
    return (
      <>
        {/* Central Pillars */}
        {[-15, -5, 5, 15].map((x, i) => (
          <mesh key={`pillar-${i}`} position={[x, 0, x * 0.5]} material={concreteMaterial}>
            <cylinderGeometry args={[1.5, 1.5, 10, 16]} />
          </mesh>
        ))}
        {/* Deck */}
        <mesh material={getSectionMaterial(2)}>
          <tubeGeometry args={[curve, 64, 2, 8, false]} />
        </mesh>
      </>
    );
  };

  const renderBuilding = () => (
    <group position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, 5, 0]} material={getSectionMaterial(3)}>
        <boxGeometry args={[10, 20, 10]} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: 8 }).map((_, y) => (
        Array.from({ length: 4 }).map((_, x) => (
          <mesh key={`win-${x}-${y}`} position={[-3.5 + x * 2.33, -3 + y * 2.5, 5.1]} material={glassMaterial}>
            <planeGeometry args={[1.5, 1.5]} />
          </mesh>
        ))
      ))}
    </group>
  );

  const renderDam = () => (
    <group position={[0, -5, 0]}>
      {/* Wedge shape */}
      <mesh material={getSectionMaterial(1)} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[5, 15, 20, 4]} />
      </mesh>
      {/* Water pool */}
      <mesh position={[0, 5, -10]} material={glassMaterial}>
        <boxGeometry args={[40, 5, 20]} />
      </mesh>
    </group>
  );

  const renderTunnel = () => (
    <group position={[0, 0, 0]}>
      <mesh material={getSectionMaterial(0)} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[8, 8, 30, 32, 1, false, 0, Math.PI]} />
      </mesh>
      <mesh position={[0, -0.5, 0]} material={roadMaterial}>
        <boxGeometry args={[30, 1, 15]} />
      </mesh>
    </group>
  );

  return (
    <group ref={group}>
      {type === 'flyover' ? renderFlyover() : 
       type === 'building' ? renderBuilding() :
       type === 'dam' ? renderDam() :
       type === 'tunnel' ? renderTunnel() :
       renderBridge()}

      {/* Sensors Hotspots */}
      {sensors.map((sensor, i) => {
        // Just spread them generically across x
        const xPos = -10 + (i * (20 / Math.max(1, sensors.length))) + Math.random() * 2;
        const yPos = type === 'building' ? Math.random() * 15 : 0.5;
        const zPos = (Math.random() - 0.5) * 3;
        
        return (
          <SensorHotspot 
            key={sensor.id} 
            position={[xPos, yPos, zPos]} 
            sensor={sensor}
          />
        );
      })}
    </group>
  );
};

export default BridgeModel;
