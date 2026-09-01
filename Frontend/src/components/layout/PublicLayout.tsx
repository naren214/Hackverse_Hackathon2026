import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Shield, Building2 } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-t-bg text-t-text flex flex-col">
      <header className="h-16 bg-t-sidebar border-b border-t-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl text-t-text">StructureAI Public</span>
        </div>
        <div>
          <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-t-hover hover:bg-t-border border border-t-border rounded-lg text-sm font-medium transition-colors">
            <Shield size={16} />
            <span>Government/Staff Login</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>
      
      <footer className="border-t border-t-border py-6 text-center text-t-muted text-sm mt-auto">
        &copy; {new Date().getFullYear()} StructureAI Public Dashboard. Official data portal.
      </footer>
    </div>
  );
};
