import React, { useState } from 'react';
import { User, Bell, Sliders, Monitor, Info, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile'|'notifications'|'thresholds'|'system'|'about'>('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'thresholds', label: 'Thresholds', icon: <Sliders size={18} /> },
    { id: 'system', label: 'System', icon: <Monitor size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ] as const;

  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-80px)]">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Settings</h1>
          <p className="text-t-muted">Manage your account and system preferences</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-500/10 text-blue-400' 
                  : 'text-t-muted hover:bg-t-card hover:text-t-text'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-t-card border border-t-border rounded-xl p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-xl font-semibold text-t-text mb-4">Profile Information</h2>
                <div className="flex items-center space-x-6 mb-8">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full bg-t-hover border border-t-border"
                  />
                  <div>
                    <button className="bg-t-hover hover:bg-t-border border border-t-border text-t-text px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2">
                      Change Avatar
                    </button>
                    <p className="text-xs text-t-muted">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-t-muted mb-2">Full Name</label>
                    <input type="text" defaultValue="Admin User" className="w-full bg-t-hover border border-t-border rounded-lg px-4 py-2.5 text-t-text outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-t-muted mb-2">Role</label>
                    <input type="text" defaultValue="System Administrator" disabled className="w-full bg-t-card border border-t-border rounded-lg px-4 py-2.5 text-t-muted cursor-not-allowed" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-t-muted mb-2">Email Address</label>
                    <input type="email" defaultValue="admin@shm-dashboard.com" className="w-full bg-t-hover border border-t-border rounded-lg px-4 py-2.5 text-t-text outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 max-w-2xl">
                <h2 className="text-xl font-semibold text-t-text mb-2">Notification Preferences</h2>
                <p className="text-t-muted text-sm mb-6">Choose how and when you want to be notified.</p>
                
                <div className="space-y-6">
                  {[
                    { title: 'Email Alerts', desc: 'Receive daily summary emails', active: true },
                    { title: 'Push Notifications', desc: 'Receive real-time push notifications', active: false },
                    { title: 'Critical Alerts Only', desc: 'Only notify for critical structural issues', active: true },
                    { title: 'Weekly Reports', desc: 'Receive weekly AI generated reports', active: true }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-t-hover rounded-xl border border-t-border">
                      <div>
                        <h4 className="text-t-text font-medium">{item.title}</h4>
                        <p className="text-t-muted text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                        <div className="w-11 h-6 bg-t-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 border border-t-border"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-8 max-w-2xl">
                <h2 className="text-xl font-semibold text-t-text mb-6">System Preferences</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-t-muted mb-2">Theme</label>
                    <select className="w-full bg-t-hover border border-t-border rounded-lg px-4 py-2.5 text-t-text outline-none focus:border-blue-500">
                      <option>Dark Mode (Default)</option>
                      <option>Light Mode</option>
                      <option>System Default</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-t-muted mb-2">Unit System</label>
                    <select className="w-full bg-t-hover border border-t-border rounded-lg px-4 py-2.5 text-t-text outline-none focus:border-blue-500">
                      <option>Metric (SI)</option>
                      <option>Imperial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-t-muted mb-2">Data Refresh Interval</label>
                    <select className="w-full bg-t-hover border border-t-border rounded-lg px-4 py-2.5 text-t-text outline-none focus:border-blue-500">
                      <option>Real-time (WebSocket)</option>
                      <option>Every 1 minute</option>
                      <option>Every 5 minutes</option>
                      <option>Every 15 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'thresholds' || activeTab === 'about') && (
              <div className="flex flex-col items-center justify-center py-20 text-t-muted">
                <Info size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl text-t-text font-medium mb-2">Section Under Development</h3>
                <p>This settings panel is currently being updated.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
