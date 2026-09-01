import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CursorEffects: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringTarget, setIsHoveringTarget] = useState(false);
  const [sparks, setSparks] = useState<{ id: number, x: number, y: number }[]>([]);
  const sparkId = useRef(0);

  useEffect(() => {
    // Add global style to hide default cursor
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, input, select, [role="button"], .cursor-pointer');
      setIsHoveringTarget(!!isClickable);
    };

    const handleClick = (e: MouseEvent) => {
      const id = sparkId.current++;
      setSparks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== id));
      }, 600);
    };

    window.addEventListener('mousemove', updateMousePos);
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousemove', updateMousePos);
      window.removeEventListener('mousedown', handleClick);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Target Cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
        }}
        transition={{
          type: 'tween',
          ease: 'linear',
          duration: 0
        }}
      >
        <div className="relative w-8 h-8 flex items-center justify-center">
          <motion.div 
            className="w-1.5 h-1.5 bg-red-500 rounded-full absolute"
            animate={{ opacity: isHoveringTarget ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{ 
              rotate: isHoveringTarget ? 45 : 0,
              scale: isHoveringTarget ? 1.2 : 0.6,
              opacity: isHoveringTarget ? 1 : 0.3,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t-[1.5px] border-l-[1.5px] border-red-500 rounded-tl-sm" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-[1.5px] border-r-[1.5px] border-red-500 rounded-tr-sm" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-[1.5px] border-l-[1.5px] border-red-500 rounded-bl-sm" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-[1.5px] border-r-[1.5px] border-red-500 rounded-br-sm" />
          </motion.div>
        </div>
      </motion.div>

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
                  backgroundColor: i % 2 === 0 ? '#EF4444' : '#3B82F6', // Alternate Spidey Red and Blue
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
