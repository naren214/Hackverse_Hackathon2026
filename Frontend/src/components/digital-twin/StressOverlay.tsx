import React, { useMemo } from 'react';
import * as THREE from 'three';

interface StressOverlayProps {
  stressData: number[]; // Array of values (0-1) representing stress along the length
}

const StressOverlay: React.FC<StressOverlayProps> = ({ stressData }) => {
  // Create a plane geometry that we'll color based on stress data
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 4, stressData.length - 1, 1);
    
    // Assign colors to vertices based on stress data
    const colors = [];
    const colorObj = new THREE.Color();
    
    // For each vertex in the plane (stressData.length columns, 2 rows)
    for (let i = 0; i <= 1; i++) {
      for (let j = 0; j < stressData.length; j++) {
        const val = stressData[j];
        // Green (0) -> Yellow (0.5) -> Red (1)
        if (val < 0.5) {
          colorObj.lerpColors(new THREE.Color('#22c55e'), new THREE.Color('#f59e0b'), val * 2);
        } else {
          colorObj.lerpColors(new THREE.Color('#f59e0b'), new THREE.Color('#ef4444'), (val - 0.5) * 2);
        }
        colors.push(colorObj.r, colorObj.g, colorObj.b);
      }
    }
    
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [stressData]);

  return (
    <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        vertexColors
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};

export default StressOverlay;
