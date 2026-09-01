import React, { createContext, useContext, useState, useEffect } from 'react';

export type TimeRangeValue = '1m' | '3m' | '6m' | '1y';

interface TimeRangeContextType {
  timeRange: TimeRangeValue;
  setTimeRange: (v: TimeRangeValue) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export const TimeRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(() => {
    const saved = localStorage.getItem('structureai_time_range');
    return (saved as TimeRangeValue) || '6m';
  });

  useEffect(() => {
    localStorage.setItem('structureai_time_range', timeRange);
  }, [timeRange]);

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  );
};

export const useTimeRange = () => {
  const context = useContext(TimeRangeContext);
  if (context === undefined) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider');
  }
  return context;
};
