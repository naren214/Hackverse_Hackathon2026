import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CursorEffects: React.FC = () => {
  const [sparks, setSparks] = useState<{ id: number, x: number, y: number }[]>([]);
  const sparkId = useRef(0);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = sparkId.current++;
      setSparks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== id));
      }, 600);
    };

    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <>
      {/* Click Sparks */}
      <AnimatePresence>
        {sparks.map(spark => (
          <div
            key={spark.id}
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{ transform: `translate(${spark.x}px, ${spark.y}px)` }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute origin-left rounded-full"
                style={{ 
                  height: 2,
                  width: 14,
                  backgroundColor: '#60A5FA', // blue-400
                  transform: `rotate(${(i * 360) / 8}deg)`,
                  marginTop: -1,
                }}
                initial={{ 
                  x: 5, 
                  opacity: 1, 
                  scaleX: 1 
                }}
                animate={{ 
                  x: 35,
                  opacity: 0,
                  scaleX: 0
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeOut" 
                }}
              />
            ))}
          </div>
        ))}
      </AnimatePresence>
    </>
  );
};
