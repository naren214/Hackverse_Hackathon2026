import { useEffect, useState } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';

export const useAnimatedCounter = (targetValue: number, duration: number = 1) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, targetValue, { duration });
    return controls.stop;
  }, [targetValue, duration, count]);

  useEffect(() => {
    return rounded.on('change', (v) => setValue(v));
  }, [rounded]);

  return value.toString();
};
