import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Wrench, Ruler, Activity, ShieldCheck } from 'lucide-react';
import { structuresApi } from '../api/structures.api';
import { sensorsApi } from '../api/sensors.api';
import { apiClient } from '../api/client';
import { Structure } from '../types/structure.types';
import { Sensor } from '../types/sensor.types';
import { Inspection } from '../types/common.types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { HealthGauge } from '../components/common/HealthGauge';
import { formatDate } from '../utils/formatters';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import BridgeModel from '../components/digital-twin/BridgeModel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import { Modal } from '../components/common/Modal';
import { toast } from 'sonner';

const InfrastructureDetail: React.FC = () => {
  const { id } = useParams();
  const [structure, setStructure] = useState<Structure | null>(null);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    if (!id) return;
    structuresApi.getStructure(id)
      .then(data => setStructure(data))
      .catch(err => console.error('Failed to load structure:', err));
    sensorsApi.getSensors({ structureId: id })
      .then(data => setSensors(data))
      .catch(err => console.error('Failed to load sensors:', err));
    apiClient.get<Inspection[]>(`/inspections?structureId=${id}`)
      .then(data => setInspections(data))
      .catch(err => console.error('Failed to load inspections:', err));
  }, [id]);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleType, setScheduleType] = useState('manual');
  const [isScheduling, setIsScheduling] = useState(false);

  const handleGenerateReport = async () => {
    if (!structure) return;
    try {
      setIsGeneratingReport(true);
      const blob = await structuresApi.generateReport(structure.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `structure-report-${structure.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Ensure we have toast from sonner. Assuming toast is globally imported or we can just console.log if toast isn't imported.
      toast.success('Report generated successfully');
    } catch (err) {
      console.error('Failed to generate report:', err);
      toast.error('Failed to generate report');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleScheduleInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!structure) return;
    try {
      setIsScheduling(true);
      await apiClient.post('/inspections/schedule', {
        structureId: structure.id,
        structureName: structure.name,
        date: new Date(scheduleDate).toISOString(),
        type: scheduleType,
      });
      setIsScheduleModalOpen(false);
      toast.success('Inspection scheduled successfully');
      // optionally fetch inspections again
    } catch (err) {
      console.error('Failed to schedule:', err);
      toast.error('Failed to schedule inspection');
    } finally {
      setIsScheduling(false);
    }
  };
  
  const [activeTab, setActiveTab] = useState('digital-twin');

  if (!structure) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-t-bg text-primary-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'digital-twin', label: 'Digital Twin' },
    { id: 'sensors', label: 'Sensors' },
    { id: 'history', label: 'History' },
    { id: 'inspections', label: 'Inspections' },
  ];

  const generateHistoryData = () => {
    const data = [];
    for(let i=0; i<30; i++) {
      data.push({
        date: `Day ${i+1}`,
        vibration: 20 + Math.random() * 10,
        strain: 15 + Math.random() * 20,
        temperature: 25 + Math.random() * 5
      });
    }
    return data;
  };
  const historyData = generateHistoryData();

  return (
    <div className="min-h-screen bg-t-bg text-t-text pb-12">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 pt-6 space-y-6">
        
        <Link to="/infrastructure" className="inline-flex items-center gap-2 text-sm text-t-muted hover:text-t-text transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Infrastructure
        </Link>

        {/* Header */}
        <div className="bg-t-card border border-t-border rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 justify-between relative z-10">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Badge label={structure.type.toUpperCase()} variant="neutral" />
                <Badge 
                  label={structure.status.toUpperCase()} 
                  variant={structure.status === 'healthy' ? 'success' : structure.status === 'warning' ? 'warning' : 'danger'}
                  pulse={structure.status === 'critical'}
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-t-text tracking-tight">{structure.name}</h1>
              <p className="text-t-muted flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-blue-500" /> {structure.location.address}, {structure.location.city}, {structure.location.state}
              </p>
              
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-t-hover flex items-center justify-center border border-t-border">
                    <Calendar className="w-5 h-5 text-t-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-t-muted uppercase tracking-wider">Build Year</p>
                    <p className="font-semibold text-t-text">{structure.buildYear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-t-hover flex items-center justify-center border border-t-border">
                    <Wrench className="w-5 h-5 text-t-text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-t-muted uppercase tracking-wider">Material</p>
                    <p className="font-semibold text-t-text capitalize">{structure.material}</p>
                  </div>
                </div>
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

            <div className="flex flex-col items-center lg:items-end gap-6 border-t lg:border-t-0 lg:border-l border-t-border pt-6 lg:pt-0 lg:pl-8">
              <div className="text-center lg:text-right">
                <p className="text-sm text-t-muted mb-2">Overall Health Score</p>
                <HealthGauge score={structure.healthScore} size="lg" showLabel />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                >
                  Schedule Inspection
                </button>
                <button 
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 px-4 py-2 bg-t-hover hover:bg-t-border border border-t-border text-t-text rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {isGeneratingReport ? <div className="w-4 h-4 border-2 border-t-text border-t-transparent rounded-full animate-spin"></div> : null}
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-t-border gap-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-blue-500' : 'text-t-muted hover:text-t-text'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'digital-twin' && (
            <Card className="p-0 overflow-hidden border border-t-border rounded-2xl h-[600px] relative">
              <div className="absolute top-4 left-4 z-10 bg-t-card/80 backdrop-blur-md p-3 rounded-lg border border-t-border text-xs text-t-text-secondary pointer-events-none">
                <p className="font-semibold text-t-text mb-1">Interactive 3D Model</p>
                <p>Drag to rotate, scroll to zoom</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" /> Healthy Section
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Warning Section
                </div>
              </div>
              <Canvas camera={{ position: [15, 10, 20], fov: 45 }} className="w-full h-full bg-t-bg">
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                
                <BridgeModel healthScore={structure.healthScore} sensors={sensors} />
                
                <Grid args={[100, 100]} cellColor="#1e293b" sectionColor="#334155" fadeDistance={50} position={[0, -5, 0]} />
                <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={40} autoRotate={true} autoRotateSpeed={0.5} />
                <Suspense fallback={null}>
                  <Environment preset="city" />
                </Suspense>
              </Canvas>
            </Card>
          )}

          {activeTab === 'sensors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sensors.map(sensor => (
                <Card key={sensor.id} className="border border-t-border hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${sensor.status === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-t-text">{sensor.name}</h3>
                        <p className="text-xs text-t-muted capitalize">{sensor.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-t-muted">{Number(sensor.battery.toFixed(2))}%</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${sensor.status === 'online' ? 'bg-green-500' : sensor.status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'}`} />
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-3xl font-bold text-t-text tracking-tight">{sensor.value.toFixed(2)}</span>
                      <span className="text-sm text-t-muted ml-1">{sensor.unit}</span>
                    </div>
                  </div>
                  <div className="w-full bg-t-hover h-1.5 rounded-full overflow-hidden mt-4">
                    <div 
                      className={`h-full ${sensor.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                      style={{ width: `${(sensor.value / sensor.threshold.max) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-t-muted mt-1">
                    <span>Min: {sensor.threshold.min}</span>
                    <span>Max: {sensor.threshold.max}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <Card title="Historical Sensor Data" className="h-[500px]">
              <div className="w-full h-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="date" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--color-text)' }}
                    />
                    <Line type="monotone" dataKey="vibration" stroke="#3B82F6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="strain" stroke="#8B5CF6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="temperature" stroke="#F59E0B" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {activeTab === 'inspections' && (
            <div className="space-y-6">
              {inspections.map((insp, index) => (
                <div key={insp.id} className="flex gap-4 relative">
                  {index !== inspections.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-24px] w-0.5 bg-t-hover" />
                  )}
                  <div className="w-10 h-10 rounded-full bg-t-card border-2 border-blue-500/30 flex items-center justify-center shrink-0 z-10">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <Card className="flex-1 border border-t-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-t-text">{formatDate(insp.date)}</h4>
                        <p className="text-sm text-t-muted">Inspector: {insp.inspector} | Type: <span className="uppercase">{insp.type}</span></p>
                      </div>
                      <Badge 
                        label={insp.compliance.toUpperCase()} 
                        variant={insp.compliance === 'pass' ? 'success' : insp.compliance === 'review' ? 'warning' : 'danger'} 
                      />
                    </div>
                    <p className="text-t-text-secondary text-sm mt-3 bg-t-hover p-3 rounded-lg border border-t-border">
                      {insp.findings}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Schedule Inspection">
        <form onSubmit={handleScheduleInspection} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Date</label>
            <input required type="date" className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                   value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Inspection Type</label>
            <select className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                    value={scheduleType} onChange={e => setScheduleType(e.target.value)}>
              <option value="manual">Manual / Visual</option>
              <option value="ai">AI / Drone</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsScheduleModalOpen(false)} className="px-4 py-2 bg-t-hover border border-t-border rounded-lg text-t-text hover:bg-t-border transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isScheduling} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
              {isScheduling ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default InfrastructureDetail;
