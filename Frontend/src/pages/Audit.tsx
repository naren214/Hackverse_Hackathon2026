import React, { useState, useMemo } from 'react';
import { mockInspections } from '../utils/mockData';
import { InspectionLog } from '../components/audit/InspectionLog';
import { ComplianceCards } from '../components/audit/ComplianceCards';
import { Download, FileText } from 'lucide-react';

export const Audit: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCompliance, setFilterCompliance] = useState<string>('all');

  const filteredInspections = useMemo(() => {
    return mockInspections.filter(i => {
      const matchType = filterType === 'all' || i.type === filterType;
      const matchCompliance = filterCompliance === 'all' || i.compliance === filterCompliance;
      return matchType && matchCompliance;
    });
  }, [filterType, filterCompliance]);

  const handleExport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting compliance report as ${format.toUpperCase()}...`);
    // Mock export functionality
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Audit & Compliance</h1>
          <p className="text-t-muted">Inspection history and structural compliance tracking</p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => handleExport('csv')}
            className="flex items-center space-x-2 bg-t-hover hover:bg-t-border border border-t-border text-t-text px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <FileText size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <ComplianceCards inspections={mockInspections} />

      <div className="bg-t-card p-4 rounded-xl border border-t-border flex gap-4">
        <select 
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-t-hover border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 block w-48 p-2.5 outline-none"
        >
          <option value="all">All Inspection Types</option>
          <option value="manual">Manual</option>
          <option value="ai">AI Automated</option>
          <option value="scheduled">Scheduled Routine</option>
        </select>

        <select 
          value={filterCompliance}
          onChange={e => setFilterCompliance(e.target.value)}
          className="bg-t-hover border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 block w-48 p-2.5 outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="pass">Passed</option>
          <option value="fail">Failed</option>
          <option value="review">Needs Review</option>
        </select>
      </div>

      <InspectionLog inspections={filteredInspections} />
    </div>
  );
};

export default Audit;
