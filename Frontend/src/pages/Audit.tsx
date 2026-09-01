import React, { useState, useMemo, useEffect } from 'react';
import { inspectionsApi } from '../api/inspections.api';
import { Inspection } from '../types/common.types';
import { InspectionLog } from '../components/audit/InspectionLog';
import { ComplianceCards } from '../components/audit/ComplianceCards';
import { Download, FileText, Loader } from 'lucide-react';
import { toast } from 'sonner';

export const Audit: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCompliance, setFilterCompliance] = useState<string>('all');
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    inspectionsApi.getInspections()
      .then(data => setInspections(data))
      .catch(err => console.error('Failed to load inspections:', err));
  }, []);

  const filteredInspections = useMemo(() => {
    return inspections.filter(i => {
      const matchType = filterType === 'all' || i.type === filterType;
      const matchCompliance = filterCompliance === 'all' || i.compliance === filterCompliance;
      return matchType && matchCompliance;
    });
  }, [inspections, filterType, filterCompliance]);

  const handleExport = async (format: 'pdf' | 'csv') => {
    try {
      if (format === 'csv') {
        setIsExportingCsv(true);
        const headers = ['Structure,Date,Type,Compliance,Inspector,Notes'];
        const rows = filteredInspections.map(i => 
          `"${i.structureName}","${new Date(i.date).toLocaleDateString()}","${i.type}","${i.compliance}","${i.inspector}","${i.notes || ''}"`
        );
        const csvContent = headers.concat(rows).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('CSV exported successfully');
      } else {
        setIsExportingPdf(true);
        const query = `?type=${filterType}&compliance=${filterCompliance}`;
        const blob = await inspectionsApi.exportPdf(query);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('PDF exported successfully');
      }
    } catch (err) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExportingCsv(false);
      setIsExportingPdf(false);
    }
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
            disabled={isExportingCsv}
            className="flex items-center space-x-2 bg-t-hover hover:bg-t-border border border-t-border text-t-text px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isExportingCsv ? <Loader className="animate-spin" size={16} /> : <Download size={16} />}
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExportingPdf}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            {isExportingPdf ? <Loader className="animate-spin" size={16} /> : <FileText size={16} />}
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <ComplianceCards inspections={inspections} />

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
