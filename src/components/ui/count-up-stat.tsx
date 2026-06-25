'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

function parseStatValue(raw: string) {
  const suffix = raw.replace(/[\d,.\s]/g, '');
  const target = Number.parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
  return { target, suffix };
}

function formatStatNumber(value: number) {
  return Math.round(value).toLocaleString();
}

type CountUpStatProps = {
  value: string;
  className?: string;
  /** Animation duration in seconds — vary per stat so they don't finish together. */
  duration?: number;
};

export function CountUpStat({ value, className, duration = 1.6 }: CountUpStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const { target, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(() => `0${suffix}`);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, target, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => setDisplay(`${formatStatNumber(v)}${suffix}`),
    });

    return () => controls.stop();
  }, [duration, isInView, suffix, target]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
