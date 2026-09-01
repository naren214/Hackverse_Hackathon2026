import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, List as ListIcon, Activity, AlertTriangle, XCircle } from 'lucide-react';
import { Sensor } from '../types/sensor.types';
import { sensorsApi } from '../api/sensors.api';
import { SensorGrid } from '../components/sensors/SensorGrid';
import { SensorDetailModal } from '../components/sensors/SensorDetailModal';
import { StatCard } from '../components/common/StatCard';
import { DataTable } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { SearchInput } from '../components/common/SearchInput';

export const Sensors: React.FC = () => {
  const [allSensors, setAllSensors] = useState<Sensor[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    sensorsApi.getSensors()
      .then(data => setAllSensors(data))
      .catch(err => console.error('Failed to load sensors:', err));
  }, []);

  const stats = useMemo(() => {
    return {
      total: allSensors.length,
      online: allSensors.filter(s => s.status === 'online').length,
      warning: allSensors.filter(s => s.status === 'warning').length,
      offline: allSensors.filter(s => s.status === 'offline').length,
    };
  }, [allSensors]);

  const filteredSensors = useMemo(() => {
    return allSensors.filter(sensor => {
      const matchesSearch = sensor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sensor.structureName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || sensor.status === statusFilter;
      const matchesType = typeFilter === 'all' || sensor.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [allSensors, searchQuery, statusFilter, typeFilter]);

  const tableColumns = [
    { key: 'name', label: 'Sensor Name', render: (item: Sensor) => <span className="font-medium text-t-text">{item.name}</span> },
    { key: 'type', label: 'Type', render: (item: Sensor) => <span className="capitalize text-t-text-secondary">{item.type}</span> },
    { key: 'structureName', label: 'Structure', render: (item: Sensor) => <span className="text-t-text-secondary">{item.structureName}</span> },
    { key: 'value', label: 'Current Value', render: (item: Sensor) => <span className="font-mono text-t-text">{item.value.toFixed(2)} {item.unit}</span> },
    { key: 'status', label: 'Status', render: (item: Sensor) => (
      <Badge 
        label={item.status} 
        variant={item.status === 'online' ? 'success' : item.status === 'warning' ? 'warning' : 'danger'} 
      />
    )},
    { key: 'battery', label: 'Battery', render: (item: Sensor) => (
      <div className="flex items-center space-x-2 w-24">
        <div className="h-1.5 w-full bg-t-border rounded-full overflow-hidden">
          <div className={`h-full ${item.battery > 60 ? 'bg-green-500' : item.battery > 30 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${item.battery}%` }} />
        </div>
        <span className="text-xs text-t-muted">{Number(item.battery.toFixed(2))}%</span>
      </div>
    )},
    { key: 'lastReading', label: 'Last Update', render: (item: Sensor) => <span className="text-t-muted text-sm">{new Date(item.lastReading).toLocaleTimeString()}</span> },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Sensor Network</h1>
          <p className="text-t-muted">Monitor all deployed sensors</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-t-card p-1 rounded-lg border border-t-border">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md flex items-center transition-colors ${viewMode === 'grid' ? 'bg-t-border text-t-text' : 'text-t-muted hover:text-t-text'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md flex items-center transition-colors ${viewMode === 'table' ? 'bg-t-border text-t-text' : 'text-t-muted hover:text-t-text'}`}
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Sensors" value={stats.total} icon={LayoutGrid} color="blue" />
        <StatCard title="Online" value={stats.online} trend={{ value: 98, isPositive: true }} icon={Activity} color="green" />
        <StatCard title="Warning" value={stats.warning} icon={AlertTriangle} color="amber" />
        <StatCard title="Offline" value={stats.offline} icon={XCircle} color="red" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-t-card p-4 rounded-xl border border-t-border">
        <div className="flex-1">
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search sensors or structures..." 
          />
        </div>
        <div className="flex space-x-4">
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-t-hover border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
          >
            <option value="all">All Types</option>
            <option value="vibration">Vibration</option>
            <option value="strain">Strain</option>
            <option value="temperature">Temperature</option>
            <option value="displacement">Displacement</option>
            <option value="tilt">Tilt</option>
            <option value="humidity">Humidity</option>
            <option value="corrosion">Corrosion</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-t-hover border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <SensorGrid sensors={filteredSensors} onSensorClick={setSelectedSensor} />
        ) : (
          <div className="bg-t-card border border-t-border rounded-xl overflow-hidden">
            <DataTable 
              columns={tableColumns} 
              data={filteredSensors} 
              onRowClick={setSelectedSensor}
            />
          </div>
        )}
      </motion.div>

      <SensorDetailModal 
        sensor={selectedSensor} 
        isOpen={!!selectedSensor} 
        onClose={() => setSelectedSensor(null)} 
      />
    </div>
  );
};

export default Sensors;
