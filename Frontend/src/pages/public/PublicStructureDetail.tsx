import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Ruler, CheckCircle } from 'lucide-react';
import { publicApi } from '../../api/public.api';
import { Structure } from '../../types/structure.types';
import { Badge } from '../../components/common/Badge';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import BridgeModel from '../../components/digital-twin/BridgeModel';
import { toast } from 'sonner';

export const PublicStructureDetail: React.FC = () => {
  const { id } = useParams();
  const [structure, setStructure] = useState<Structure | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (!id) return;
    publicApi.getStructure(id)
      .then(data => setStructure(data))
      .catch(err => console.error('Failed to load structure:', err));
  }, [id]);

  const handleInspectRequest = async () => {
    if (!id || !structure) return;
    try {
      setIsRequesting(true);
      const res = await publicApi.getInspectionStatus(id);
      if (res.scheduled && !res.escalated) {
        toast.info(`An inspection for ${structure.name} is already scheduled for ${new Date(res.date!).toLocaleDateString()}.`);
      } else if (res.escalated) {
        toast.success(`Public demand threshold reached! An inspection for ${structure.name} has been auto-scheduled for ${new Date(res.date!).toLocaleDateString()}.`, { duration: 5000 });
      } else {
        toast.success(`Request logged. This is request #${res.requestCount} of 100 needed to trigger a mandatory inspection.`);
      }
    } catch (err) {
      toast.error('Failed to check inspection status.');
    } finally {
      setIsRequesting(false);
    }
  };

  if (!structure) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/public" className="inline-flex items-center space-x-2 text-t-muted hover:text-t-text transition-colors">
        <ArrowLeft size={16} />
        <span>Back to Portal</span>
      </Link>

      <div className="bg-t-card border border-t-border rounded-xl p-6 md:p-8 flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-t-text">{structure.name}</h1>
            <Badge label={structure.status} variant={structure.status === 'healthy' ? 'success' : structure.status === 'warning' ? 'warning' : 'danger'} />
          </div>
          <div className="flex items-center text-t-muted mb-6">
            <MapPin size={16} className="mr-1" />
            <span>{structure.location?.address}, {structure.location?.city}</span>
          </div>

          <div className="flex flex-wrap gap-6 mt-4">
            {structure.buildYear && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-t-hover flex items-center justify-center border border-t-border">
                  <Calendar className="w-5 h-5 text-t-text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-t-muted uppercase tracking-wider">Built</p>
                  <p className="font-semibold text-t-text">{structure.buildYear}</p>
                </div>
              </div>
            )}
            {structure.length && (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-t-hover flex items-center justify-center border border-t-border">
                  <Ruler className="w-5 h-5 text-t-text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-t-muted uppercase tracking-wider">Length</p>
                  <p className="font-semibold text-t-text">{structure.length}m</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-t-border pt-6 lg:pt-0 lg:pl-8">
          <button 
            onClick={handleInspectRequest}
            disabled={isRequesting}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <CheckCircle size={18} />
            <span>Inspect</span>
          </button>
        </div>
      </div>

      <div className="bg-t-card border border-t-border rounded-xl p-6 h-[500px]">
        <h2 className="text-lg font-semibold text-t-text mb-4">Live 3D Digital Twin</h2>
        <div className="w-full h-[400px] bg-[#0f111a] rounded-lg border border-t-border overflow-hidden">
          <Canvas camera={{ position: [20, 15, 30], fov: 45 }}>
            <color attach="background" args={['#0f111a']} />
            <fog attach="fog" args={['#0f111a', 30, 100]} />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <directionalLight position={[-10, 10, -5]} intensity={0.5} />
            <Grid 
              position={[0, -0.01, 0]} 
              args={[100, 100]} 
              cellSize={2} 
              cellThickness={1} 
              cellColor="#1e2235" 
              sectionSize={10} 
              sectionThickness={1.5} 
              sectionColor="#2a2f4c" 
              fadeDistance={50} 
            />
            
            <BridgeModel structure={structure} sensors={[]} />
            <Suspense fallback={null}>
                <Environment preset="city" />
              </Suspense>
              
              {/* Fallback lighting in case Environment hangs or fails */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <directionalLight position={[-10, 10, -5]} intensity={0.5} />
              
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxPolarAngle={Math.PI / 2}
                minDistance={10}
                maxDistance={100}
              />
            </Canvas>
        </div>
      </div>
    </div>
  );
};
