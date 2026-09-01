import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { ClipboardCheck } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Inspection } from '../../types/common.types';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Link } from 'react-router-dom';

const RecentInspections: React.FC<{ timeRange?: string }> = ({ timeRange }) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    const query = timeRange ? `?timeRange=${timeRange}` : '';
    apiClient.get<Inspection[]>(`/inspections${query}`)
      .then(data => setInspections(data.slice(0, 5)))
      .catch(err => console.error('Failed to load inspections:', err));
  }, [timeRange]);

  const getComplianceVariant = (compliance: string) => {
    switch(compliance) {
      case 'pass': return 'success';
      case 'fail': return 'danger';
      case 'review': return 'warning';
      default: return 'neutral';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'none': return 'text-t-muted';
      case 'minor': return 'text-green-500';
      case 'moderate': return 'text-amber-500';
      case 'severe': return 'text-red-500';
      default: return 'text-t-muted';
    }
  };

  return (
    <Card 
      title="Recent Inspections" 
      icon={ClipboardCheck}
      headerAction={
        <Link to="/audit" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          View All
        </Link>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="text-t-muted border-b border-t-border">
              <th className="pb-3 font-medium px-4">Date</th>
              <th className="pb-3 font-medium px-4">Structure</th>
              <th className="pb-3 font-medium px-4">Type</th>
              <th className="pb-3 font-medium px-4">Findings Summary</th>
              <th className="pb-3 font-medium px-4">Severity</th>
              <th className="pb-3 font-medium px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-t-border">
            {inspections.map((insp) => (
              <tr key={insp.id} className="hover:bg-t-hover transition-colors group cursor-pointer">
                <td className="py-3 px-4 text-t-text-secondary">{formatDate(insp.date)}</td>
                <td className="py-3 px-4 text-t-text font-medium">{insp.structureName}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 text-xs rounded bg-t-hover text-t-text-secondary border border-t-border uppercase tracking-wider">
                    {insp.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-t-muted truncate max-w-[250px]">{insp.findings}</td>
                <td className="py-3 px-4">
                  <span className={`capitalize ${getSeverityColor(insp.severity)}`}>{insp.severity}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <Badge label={insp.compliance.toUpperCase()} variant={getComplianceVariant(insp.compliance)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export { RecentInspections };
export default RecentInspections;
