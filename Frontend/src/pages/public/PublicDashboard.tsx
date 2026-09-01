import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { publicApi } from '../../api/public.api';
import { Structure } from '../../types/structure.types';
import { Badge } from '../../components/common/Badge';

export const PublicDashboard: React.FC = () => {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    publicApi.getStructures()
      .then(data => setStructures(data))
      .catch(err => console.error('Failed to load structures:', err));
  }, []);

  const filtered = structures.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const getStatusColor = (status: string) => {
    if (status === 'Good') return 'green';
    if (status === 'Fair') return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Public Infrastructure Portal</h1>
          <p className="text-t-muted">Transparency and open data for public safety.</p>
        </div>
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search structures..." 
            className="w-full bg-t-card border border-t-border rounded-lg pl-10 pr-4 py-2 text-t-text focus:outline-none focus:border-blue-500 transition-colors"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-t-muted" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(structure => (
          <Link key={structure.id} to={`/public/structures/${structure.id}`} className="bg-t-card border border-t-border rounded-xl p-5 hover:border-blue-500/50 transition-colors block cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-t-text group-hover:text-blue-400 transition-colors">{structure.name}</h3>
                <p className="text-sm text-t-muted capitalize">{structure.type}</p>
              </div>
              <Badge label={structure.status as string} variant={getStatusColor(structure.status as string) as any} />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-sm text-t-text">
                <MapPin size={16} className="text-t-muted mt-0.5 shrink-0" />
                <span>{structure.location?.address}, {structure.location?.city}</span>
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-t-muted">
            No structures found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
