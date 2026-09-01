import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { SearchInput } from '../common/SearchInput';
import { ThemeToggle } from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


import { formatRelativeTime } from '../../utils/formatters';

import { useWebSocket } from '../../hooks/useWebSocket';

export const TopBar: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [search, setSearch] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { notifications } = useWebSocket();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfile(false);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-t-bg/80 backdrop-blur-xl border-b border-t-border shrink-0 shadow-sm">
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-t-muted">Home</span>
        {pathnames.map((path, _index) => (
          <React.Fragment key={path}>
            <span className="text-t-muted">/</span>
            <span className="text-t-text capitalize font-medium">
              {path}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center space-x-6">
        <div className="w-64">
          <SearchInput 
            value={search} 
            onChange={setSearch} 
            placeholder="Search resources... (Ctrl+K)" 
          />
        </div>

        <ThemeToggle />

        <div className="relative">
          <button 
            className="relative p-2 rounded-lg text-t-muted hover:bg-t-hover hover:text-t-text transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-72 bg-t-card border border-t-border rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-3 border-b border-t-border font-semibold text-t-text">Notifications</div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-t-muted text-sm">No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 hover:bg-t-hover transition-colors border-b border-t-border last:border-0 cursor-pointer">
                        <p className="text-sm text-t-text font-medium">{n.title}</p>
                        <p className="text-xs text-t-muted mt-1">{n.message}</p>
                        <p className="text-xs text-t-muted mt-2">{formatRelativeTime(n.timestamp)}</p>
                      </div>
                    ))
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-spidey-blue hover:ring-2 hover:ring-red-500 hover:ring-offset-2 hover:ring-offset-t-bg transition-all"
          >
            <span className="text-xs font-bold text-white">GOV</span>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-t-card border border-t-border rounded-xl shadow-xl overflow-hidden py-1"
              >
                <button className="flex items-center w-full px-4 py-2 text-sm text-t-text hover:bg-t-hover">
                  <User className="w-4 h-4 mr-2" /> Profile
                </button>
                <button className="flex items-center w-full px-4 py-2 text-sm text-t-text hover:bg-t-hover">
                  <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                </button>
                <div className="h-px bg-t-hover my-1" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-[#EF4444] hover:bg-[#EF4444]/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
