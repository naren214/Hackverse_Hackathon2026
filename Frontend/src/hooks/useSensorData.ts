import { useWebSocket } from './useWebSocket';

export const useSensorData = (structureId?: string) => {
  const { sensors, isConnected } = useWebSocket();
  
  const filteredSensors = structureId 
    ? sensors.filter(s => s.structureId === structureId)
    : sensors;

  return {
    sensors: filteredSensors,
    isConnected
  };
};
