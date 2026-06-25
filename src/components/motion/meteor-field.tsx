'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const METEOR_ANGLE = 38;
const HEAD_SIZE = 6;

type ActiveMeteor = {
  id: number;
  delay: number;
  maxTail: number;
  duration: number;
  startX: number;
  startY: number;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createBurst(count: number, burstId: number): ActiveMeteor[] {
  const order = shuffle(Array.from({ length: count }, (_, i) => i));
  return order.map((rank, i) => ({
    id: burstId * 100 + i,
    delay: rank * randomBetween(0.65, 1.5),
    maxTail: randomBetween(100, 200),
    duration: randomBetween(5, 8.5),
    startX: randomBetween(-5, 15),
    startY: randomBetween(-5, 12),
  }));
}

type MeteorStreakProps = {
  maxTail: number;
  duration: number;
};

/**
 * Dot leads; tail grows backward (away from travel) with fixed layout — no flex shift.
 */
function MeteorStreak({ maxTail, duration }: MeteorStreakProps) {
  const times = [0, 0.15, 0.4, 0.75, 0.95, 1];
  const trackWidth = maxTail + HEAD_SIZE + 8;

  return (
    <div
      className="relative"
      style={{
        width: trackWidth,
        height: HEAD_SIZE + 8,
        transform: `rotate(${METEOR_ANGLE}deg)`,
      }}
    >
      {/* Tail trails behind the dot (grows leftward from the head) */}
      <motion.div
        className="absolute top-1/2 h-[2px] -translate-y-1/2"
        style={{
          right: HEAD_SIZE * 0.5,
          originX: 1,
          originY: 0.5,
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: [0, 0, maxTail * 0.4, maxTail * 0.85, maxTail, maxTail * 0.5],
          opacity: [0, 0, 0.45, 0.8, 1, 0],
        }}
        transition={{ duration, ease: 'easeIn', times }}
      >
        <div
          className="h-full w-full"
          style={{
            background:
              'linear-gradient(to left, rgba(245,245,244,0.55) 0%, rgba(245,245,244,0.3) 22%, rgba(184,148,79,0.12) 50%, transparent 100%)',
            clipPath: 'polygon(100% 45%, 0 0, 0 100%, 100% 55%)',
          }}
        />
      </motion.div>

      {/* Head — fixed size so nothing shifts */}
      <motion.div
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full"
        style={{
          width: HEAD_SIZE,
          height: HEAD_SIZE,
          background:
            'radial-gradient(circle at 35% 35%, #ffffff 0%, rgba(255,255,255,0.92) 55%, rgba(184,148,79,0.45) 100%)',
        }}
        animate={{
          boxShadow: [
            '0 0 4px 1px rgba(255,255,255,0.2)',
            '0 0 12px 4px rgba(255,255,255,0.5)',
            '0 0 20px 7px rgba(255,255,255,0.7), 0 0 36px 12px rgba(184,148,79,0.28)',
            '0 0 22px 8px rgba(255,255,255,0.65), 0 0 40px 14px rgba(184,148,79,0.38)',
            '0 0 10px 3px rgba(255,255,255,0.35)',
            '0 0 4px 1px rgba(255,255,255,0.1)',
          ],
        }}
        transition={{ duration, ease: 'easeIn', times }}
      />
    </div>
  );
}

export function MeteorField() {
  const [meteors, setMeteors] = useState<ActiveMeteor[]>([]);
  const burstIdRef = useRef(0);

  const spawnBurst = useCallback(() => {
    const count = randomInt(1, 3);
    const burstId = ++burstIdRef.current;
    const batch = createBurst(count, burstId);
    setMeteors(batch);

    const maxEnd = Math.max(...batch.map((m) => m.delay + m.duration)) * 1000 + 800;
    window.setTimeout(() => setMeteors([]), maxEnd);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const wait = randomBetween(16000, 32000);
      return window.setTimeout(() => {
        if (Math.random() < 0.55) spawnBurst();
        timer = schedule();
      }, wait);
    };

    let timer = schedule();
    return () => clearTimeout(timer);
  }, [spawnBurst]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      <AnimatePresence>
        {meteors.map((m) => (
          <motion.div
            key={m.id}
            className="absolute will-change-transform"
            style={{ left: 0, top: 0 }}
            initial={{
              opacity: 0,
              x: `calc(-10vw + ${m.startX}px)`,
              y: `calc(-10vh + ${m.startY}px)`,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [`calc(-10vw + ${m.startX}px)`, `calc(105vw + ${m.startX}px)`],
              y: [`calc(-10vh + ${m.startY}px)`, `calc(105vh + ${m.startY}px)`],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: m.duration,
              delay: m.delay,
              ease: 'linear',
              times: [0, 0.06, 0.92, 1],
            }}
          >
            <MeteorStreak maxTail={m.maxTail} duration={m.duration} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
