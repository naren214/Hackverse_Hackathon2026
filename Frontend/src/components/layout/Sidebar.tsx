import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Shield, LayoutDashboard, Building2, Activity, Bell, 
  BarChart3, Kanban, ClipboardCheck, Settings, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import { SidebarContext } from '../../context/SidebarContext';

const navGroups = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]
  },
  {
    label: 'Monitoring',
    items: [
      { name: 'Infrastructure', path: '/infrastructure', icon: Building2 },
      { name: 'Sensors', path: '/sensors', icon: Activity },
      { name: 'Alerts', path: '/alerts', icon: Bell }
    ]
  },
  {
    label: 'Operations',
    items: [
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Maintenance', path: '/kanban', icon: Kanban },
      { name: 'Audit Log', path: '/audit', icon: ClipboardCheck }
    ]
  },
  {
    label: 'System',
    items: [{ name: 'Settings', path: '/settings', icon: Settings }]
  }
];

export const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useContext(SidebarContext);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-full bg-t-card/80 backdrop-blur-xl border-r border-t-border flex flex-col shrink-0 relative z-20 transition-all duration-300 shadow-xl"
    >
      <div className="flex items-center h-16 px-6 mb-6 border-b border-t-border">
        <Shield className="w-8 h-8 text-[#3B82F6] shrink-0" />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="ml-3 font-bold text-xl tracking-wide bg-gradient-to-r from-red-500 to-spidey-blue bg-clip-text text-transparent"
          >
            StructureAI
          </motion.span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 scrollbar-none">
        {navGroups.map((group, idx) => (
          <div key={group.label}>
            {!isCollapsed && (
              <h3 className="px-2 text-xs font-semibold text-t-muted uppercase tracking-wider mb-2">
                {group.label}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={clsx(
                        'flex items-center px-2 py-2.5 rounded-lg transition-all duration-300 group relative',
                        isActive 
                          ? 'bg-gradient-to-r from-[#3B82F6]/20 to-transparent text-t-text' 
                          : 'text-t-muted hover:bg-t-hover hover:text-t-text'
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute left-0 top-0 bottom-0 w-1 bg-[#3B82F6] rounded-r-full"
                        />
                      )}
                      <item.icon className={clsx("w-5 h-5 shrink-0", isActive ? "text-[#3B82F6]" : "group-hover:text-blue-400")} />
                      {!isCollapsed && (
                        <span className="ml-3 font-medium whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {idx < navGroups.length - 1 && !isCollapsed && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-t-border to-transparent my-4" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-t-border">
        <div className={clsx("flex items-center", isCollapsed ? "justify-center" : "px-2")}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-spidey-blue flex items-center justify-center shrink-0 border border-t-border shadow-[0_0_10px_rgba(239,68,68,0.5)]">
            <span className="font-bold text-white text-sm">NA</span>
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-t-text truncate">Government</p>
              <p className="text-xs text-t-muted truncate">admin@structureai.gov</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-t-border border border-t-border rounded-full flex items-center justify-center text-t-text hover:bg-[#3B82F6] transition-colors shadow-lg z-30"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};

export default Sidebar;
