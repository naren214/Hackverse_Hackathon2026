import React, { createContext, useState, useEffect } from 'react';
import { Sensor } from '../types/sensor.types';
import { Notification } from '../types/common.types';
import { mockSensors, mockNotifications, generateRealtimeValue } from '../utils/mockData';

interface WebSocketContextType {
  sensors: Sensor[];
  notifications: Notification[];
  isConnected: boolean;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [isConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prevSensors => prevSensors.map(sensor => {
        if (sensor.status === 'offline') return sensor;
        const newValue = generateRealtimeValue(sensor.value, sensor.value * 0.1);
        const newHistory = [...sensor.history.slice(1), { time: new Date().toISOString(), value: newValue }];
        return { ...sensor, value: newValue, history: newHistory, lastReading: new Date().toISOString() };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebSocketContext.Provider value={{ sensors, notifications, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
