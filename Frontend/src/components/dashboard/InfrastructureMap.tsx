import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Globe } from 'lucide-react';
import { structuresApi } from '../../api/structures.api';
import { Structure } from '../../types/structure.types';
import { Card } from '../common/Card';
import { HealthGauge } from '../common/HealthGauge';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

const createCustomIcon = (status: string) => {
  let colorClass = 'bg-green-500';
  let pulseClass = '';

  if (status === 'warning') {
    colorClass = 'bg-amber-500';
  } else if (status === 'critical') {
    colorClass = 'bg-red-500';
    pulseClass = 'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-red-400';
  }

  const html = `
    <div class="relative flex items-center justify-center w-4 h-4">
      ${pulseClass ? `<span class="${pulseClass}"></span>` : ''}
      <span class="relative inline-flex rounded-full h-3 w-3 ${colorClass} shadow-[0_0_8px_rgba(0,0,0,0.8)] border border-t-border"></span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-icon',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

const InfrastructureMap: React.FC = () => {
  const [structures, setStructures] = useState<Structure[]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    structuresApi.getStructures()
      .then(data => setStructures(data))
      .catch(err => console.error('Failed to load structures:', err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    
    // Delayed resize to ensure layout settles after animation
    const timer = setTimeout(handleResize, 300);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Card 
      title="Infrastructure Map" 
      icon={Globe} 
      className="h-[450px] flex flex-col"
      noPadding
    >
      <div className="w-full h-full relative rounded-b-xl overflow-hidden">
        <MapContainer
          ref={mapRef}
          center={[22.5, 78.5]}
          zoom={4.5}
          className="absolute inset-0 w-full h-full z-0 bg-t-bg"
          zoomControl={false}
          whenReady={() => {
            setTimeout(() => mapRef.current?.invalidateSize(), 0);
          }}
        >
          <TileLayer
            url="https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {structures.map((struct) => (
            <Marker
              key={struct.id}
              position={[struct.location.lat, struct.location.lng]}
              icon={createCustomIcon(struct.status)}
            >
              <Popup className="dark-popup">
                <div className="p-3 bg-t-card text-t-text border border-t-border rounded-lg min-w-[200px]">
                  <h3 className="font-bold text-lg mb-1">{struct.name}</h3>
                  <p className="text-xs text-t-muted mb-3">{struct.location.city}, {struct.location.state}</p>
                  <div className="flex justify-between items-center mb-3">
                    <HealthGauge score={struct.healthScore} size="sm" showLabel />
                    <Badge 
                      label={struct.status.toUpperCase()} 
                      variant={struct.status === 'healthy' ? 'success' : struct.status === 'warning' ? 'warning' : 'danger'} 
                    />
                  </div>
                  <div className="text-xs text-t-text-secondary mb-4">
                    Sensors: <span className="font-semibold">{struct.activeSensors}/{struct.sensorCount}</span> Active
                  </div>
                  <Link 
                    to={`/infrastructure/${struct.id}`}
                    className="block w-full py-1.5 text-center text-sm bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-t-card/80 backdrop-blur-md border border-t-border p-3 rounded-lg z-[1000] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-t-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></span> Healthy
          </div>
          <div className="flex items-center gap-2 text-xs text-t-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_5px_#f59e0b]"></span> Warning
          </div>
          <div className="flex items-center gap-2 text-xs text-t-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444] animate-pulse"></span> Critical
          </div>
        </div>
      </div>
      
      <style>{`
        .dark-popup .leaflet-popup-content-wrapper,
        .dark-popup .leaflet-popup-tip {
          background: #1A1D27;
          border: 1px solid rgba(255,255,255,0.1);
          color: #f1f5f9;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        }
        .dark-popup .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #94a3b8;
          padding: 8px;
        }
      `}</style>
    </Card>
  );
};

export { InfrastructureMap };
export default InfrastructureMap;
