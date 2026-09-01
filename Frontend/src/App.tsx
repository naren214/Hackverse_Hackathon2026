import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AnimatePresence } from 'framer-motion';

const AppLayout = React.lazy(() => import('./components/layout/AppLayout'));
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Infrastructure = React.lazy(() => import('./pages/Infrastructure'));
const InfrastructureDetail = React.lazy(() => import('./pages/InfrastructureDetail'));
const Sensors = React.lazy(() => import('./pages/Sensors'));
const Alerts = React.lazy(() => import('./pages/Alerts'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Kanban = React.lazy(() => import('./pages/Kanban'));
const Audit = React.lazy(() => import('./pages/Audit'));
const Settings = React.lazy(() => import('./pages/Settings'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-t-bg text-primary-500">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster theme="dark" position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/infrastructure/:id" element={<InfrastructureDetail />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
