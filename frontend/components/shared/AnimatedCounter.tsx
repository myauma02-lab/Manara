'use client';
// components/shared/AnimatedCounter.tsx
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Props { end: number; suffix?: string; duration?: number; }

export default function AnimatedCounter({ end, suffix = '', duration = 2000 }: Props) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      setCount(Math.floor(eased * end));
      if (progress >= 1) { setCount(end); clearInterval(timer); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}
