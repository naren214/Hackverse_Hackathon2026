import React, { createContext, useState, useEffect } from 'react';
import { Sensor } from '../types/sensor.types';
import { Notification } from '../types/common.types';
import { sensorsApi } from '../api/sensors.api';
import { apiClient } from '../api/client';
import { getToken } from '../api/client';

interface SensorUpdate {
  id: string;
  structureId: string;
  value: number;
  lastReading: string;
  newHistoryPoint: { time: string; value: number };
}

interface WebSocketContextType {
  sensors: Sensor[];
  notifications: Notification[];
  isConnected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Load initial data from API
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    sensorsApi.getSensors()
      .then(data => setSensors(data))
      .catch(err => console.error('Failed to load sensors:', err));

    apiClient.get<Notification[]>('/notifications')
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to load notifications:', err));
  }, []);

  // Connect to Socket.IO for real-time updates
  useEffect(() => {
    let socket: any = null;
    let cleanup = false;

    const connectSocket = async () => {
      try {
        // Dynamically import socket.io-client
        const { io } = await import('socket.io-client');
        if (cleanup) return;

        socket = io('http://localhost:5001', {
          auth: { token: getToken() },
          transports: ['websocket', 'polling']
        });

        socket.on('connect', () => {
          console.log('🔌 WebSocket connected');
          setIsConnected(true);
        });

        socket.on('disconnect', () => {
          console.log('🔌 WebSocket disconnected');
          setIsConnected(false);
        });

        socket.on('sensor:update', (updates: SensorUpdate[]) => {
          setSensors(prevSensors => prevSensors.map(sensor => {
            const update = updates.find(u => u.id === sensor.id);
            if (!update) return sensor;
            const newHistory = [...sensor.history.slice(1), update.newHistoryPoint];
            return {
              ...sensor,
              value: update.value,
              lastReading: update.lastReading,
              history: newHistory
            };
          }));
        });

        socket.on('alert:new', (alert: any) => {
          const notification: Notification = {
            id: `n_${Date.now()}`,
            title: `Alert: ${alert.severity}`,
            message: alert.message,
            type: 'alert',
            timestamp: alert.timestamp,
            read: false
          };
          setNotifications(prev => [notification, ...prev]);
        });

        socket.on('notification:new', (notification: Notification) => {
          setNotifications(prev => [notification, ...prev]);
        });

      } catch (err) {
        console.warn('Socket.IO not available, using polling fallback');
        // Fallback: poll sensors every 5 seconds
        const interval = setInterval(async () => {
          try {
            const data = await sensorsApi.getSensors();
            setSensors(data);
          } catch (e) {
            // silently fail
          }
        }, 5000);

        setIsConnected(true);

        return () => clearInterval(interval);
      }
    };

    connectSocket();

    return () => {
      cleanup = true;
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ sensors, notifications, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
