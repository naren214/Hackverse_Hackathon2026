import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { alertsApi } from '../api/alerts.api';
import { Alert } from '../types/alert.types';
import { AlertList } from '../components/alerts/AlertList';
import { AlertDetailDrawer } from '../components/alerts/AlertDetailDrawer';
import { StatCard } from '../components/common/StatCard';
import { SearchInput } from '../components/common/SearchInput';
import { motion } from 'framer-motion';

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  useEffect(() => {
    alertsApi.getAlerts()
      .then(data => setAlerts(data))
      .catch(err => console.error('Failed to load alerts:', err));
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const stats = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
      warning: alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length,
      new: alerts.filter(a => a.status === 'new').length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            alert.structureName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || alert.severity === activeTab;
      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      
      return matchesSearch && matchesTab && matchesStatus;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, searchQuery, activeTab, statusFilter]);

  const handleAcknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'acknowledged' } : null);
    }
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => prev ? { ...prev, status: 'resolved' } : null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-t-text mb-1">Alert Center</h1>
        <p className="text-t-muted">Manage and respond to infrastructure alerts</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Alerts" value={stats.total} icon={AlertTriangle} color="blue" />
        <StatCard 
          title="Critical Unresolved" 
          value={stats.critical} 
          icon={AlertTriangle}
          color="red" 
          trend={{ value: 12, isPositive: false }} 
        />
        <StatCard title="Warning Unresolved" value={stats.warning} icon={AlertTriangle} color="amber" />
        <StatCard title="New Alerts" value={stats.new} icon={AlertTriangle} color="blue" />
      </div>

      <div className="bg-t-card border border-t-border rounded-xl overflow-hidden">
        <div className="border-b border-t-border px-4 flex overflow-x-auto custom-scrollbar">
          {(['all', 'critical', 'warning', 'info'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-4 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                activeTab === tab ? 'text-t-text' : 'text-t-muted hover:text-t-text-secondary'
              }`}
            >
              {tab}
              {tab !== 'all' && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  tab === 'critical' ? 'bg-red-500/20 text-red-400' :
                  tab === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {alerts.filter(a => a.severity === tab).length}
                </span>
              )}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-col sm:flex-row gap-4 border-b border-t-border bg-t-hover/50">
          <div className="flex-1">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search alerts by message or structure..." 
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-t-card border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="p-4 md:p-6 bg-t-card">
          <AlertList 
            alerts={filteredAlerts}
            onAcknowledge={handleAcknowledge}
            onResolve={handleResolve}
            onAlertClick={setSelectedAlert}
          />
        </div>
      </div>

      <AlertDetailDrawer
        alert={selectedAlert}
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={handleAcknowledge}
        onResolve={handleResolve}
      />
    </div>
  );
};

export default Alerts;
