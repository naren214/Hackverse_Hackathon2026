import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin } from 'lucide-react';
import { mockStructures } from '../utils/mockData';
import { Card } from '../components/common/Card';
import { HealthGauge } from '../components/common/HealthGauge';
import { Badge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { Link } from 'react-router-dom';

const Infrastructure: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Health Score');

  const filteredStructures = mockStructures.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || s.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'Health Score') return a.healthScore - b.healthScore;
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Last Inspection') return new Date(b.lastInspection).getTime() - new Date(a.lastInspection).getTime();
    return 0;
  });

  const healthyCount = mockStructures.filter(s => s.status === 'healthy').length;
  const warningCount = mockStructures.filter(s => s.status === 'warning').length;
  const criticalCount = mockStructures.filter(s => s.status === 'critical').length;

  const getBorderColor = (status: string) => {
    if (status === 'healthy') return 'border-t-green-500';
    if (status === 'warning') return 'border-t-amber-500';
    return 'border-t-red-500';
  };

  return (
    <div className="min-h-screen bg-t-bg text-t-text p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-2">Infrastructure</h1>
          <p className="text-t-muted">Monitor all structures</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-t-card border border-t-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-t-muted" />
            <input 
              type="text"
              placeholder="Search structures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-t-hover border border-t-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select 
              className="bg-t-hover border border-t-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option>Bridge</option>
              <option>Building</option>
              <option>Flyover</option>
            </select>
            <select 
              className="bg-t-hover border border-t-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Healthy</option>
              <option>Warning</option>
              <option>Critical</option>
            </select>
            <select 
              className="bg-t-hover border border-t-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Health Score</option>
              <option>Name</option>
              <option>Last Inspection</option>
            </select>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm">
          <div className="bg-t-hover border border-t-border px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="text-t-muted">Total:</span> <span className="font-semibold">{mockStructures.length}</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-green-500 font-semibold">{healthyCount} Healthy</span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-500 font-semibold">{warningCount} Warning</span>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-semibold">{criticalCount} Critical</span>
          </div>
        </div>

        {/* Grid */}
        {filteredStructures.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial="hidden" animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {filteredStructures.map(struct => (
              <motion.div key={struct.id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                <Card className={`relative border-t-4 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 ${getBorderColor(struct.status)}`} hoverable>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-t-hover rounded-lg border border-t-border">
                        <Building2 className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-t-text">{struct.name}</h3>
                        <p className="text-xs text-t-muted flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {struct.location.city}, {struct.location.state}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      label={struct.status.toUpperCase()} 
                      variant={struct.status === 'healthy' ? 'success' : struct.status === 'warning' ? 'warning' : 'danger'}
                      pulse={struct.status === 'critical'}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center py-4 border-y border-t-border my-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-t-muted mb-1">Health Score</span>
                      <HealthGauge score={struct.healthScore} size="md" showLabel />
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="text-right">
                        <span className="text-xs text-t-muted block">Sensors Online</span>
                        <span className="font-semibold text-t-text">{struct.activeSensors} / {struct.sensorCount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-t-muted block">Last Inspection</span>
                        <span className="font-semibold text-t-text">{formatDate(struct.lastInspection)}</span>
                      </div>
                    </div>
                  </div>

                  <Link 
                    to={`/infrastructure/${struct.id}`}
                    className="block w-full py-2.5 text-center text-sm font-medium bg-t-hover hover:bg-blue-600 border border-t-border hover:border-blue-500 rounded-lg transition-all"
                  >
                    View Details
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-t-card rounded-xl border border-t-border">
            <Search className="w-12 h-12 text-t-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-t-text-secondary">No structures found</h3>
            <p className="text-t-muted mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Infrastructure;
