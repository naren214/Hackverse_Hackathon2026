import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Inspection } from '../../types/common.types';
import { Badge } from '../common/Badge';
import { ChevronDown, ChevronUp, FileText, Clock, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

interface InspectionLogProps {
  inspections: Inspection[];
}

export const InspectionLog: React.FC<InspectionLogProps> = ({ inspections }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (inspections.length === 0) {
    return <div className="text-center p-8 text-t-muted">No inspections found matching the criteria.</div>;
  }

  return (
    <div className="bg-t-card border border-t-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-t-muted uppercase bg-t-hover border-b border-t-border">
            <tr>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Structure</th>
              <th className="px-6 py-4 font-medium">Inspector</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Compliance</th>
              <th className="px-6 py-4 font-medium">Severity</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-t-border">
            {inspections.map((inspection) => (
              <React.Fragment key={inspection.id}>
                <tr 
                  onClick={() => toggleExpand(inspection.id)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-t-text-secondary">
                    {new Date(inspection.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-t-text">
                    {inspection.structureName}
                  </td>
                  <td className="px-6 py-4 text-t-text-secondary">
                    {inspection.inspector}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="primary" label={inspection.type} />
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={inspection.compliance === 'pass' ? 'success' : inspection.compliance === 'fail' ? 'danger' : 'warning'} label={inspection.compliance} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "capitalize font-medium",
                      inspection.severity === 'none' ? 'text-green-400' :
                      inspection.severity === 'minor' ? 'text-blue-400' :
                      inspection.severity === 'moderate' ? 'text-amber-400' : 'text-red-400'
                    )}>
                      {inspection.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-t-muted hover:text-t-text transition-colors">
                      {expandedId === inspection.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedId === inspection.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-t-hover/50"
                    >
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-t-muted mb-1 flex items-center"><FileText size={14} className="mr-1"/> Findings</h4>
                              <p className="text-t-text text-sm leading-relaxed">{inspection.findings}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-t-muted mb-1">Additional Notes</h4>
                              <p className="text-t-text-secondary text-sm leading-relaxed">{inspection.notes}</p>
                            </div>
                          </div>
                          <div className="space-y-4 border-l border-t-border pl-6">
                            <div>
                              <h4 className="text-sm font-medium text-t-muted mb-1 flex items-center"><Clock size={14} className="mr-1"/> Duration</h4>
                              <p className="text-t-text font-mono text-sm">{inspection.duration}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-t-muted mb-2 flex items-center"><ImageIcon size={14} className="mr-1"/> Attached Images</h4>
                              <div className="flex gap-2">
                                {inspection.images.map((img: string, idx: number) => (
                                  <div key={idx} className="w-16 h-16 bg-t-card border border-t-border rounded-lg overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-xs text-t-text">View</div>
                                    <img src={img} alt={`Finding ${idx+1}`} className="w-full h-full object-cover opacity-60" />
                                  </div>
                                ))}
                                {inspection.images.length === 0 && <span className="text-sm text-t-muted">No images attached</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionLog;
