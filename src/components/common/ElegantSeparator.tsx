'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { scrollViewport } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface ElegantSeparatorProps {
  className?: string;
  icon?: React.ReactNode;
  bg?: string;
}

export const ElegantSeparator: React.FC<ElegantSeparatorProps> = ({ className, icon, bg = 'bg-bg-page' }) => {
  return (
    <div className={cn('relative z-10 flex h-0 w-full items-center justify-center', className)}>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={scrollViewport}
        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={cn('relative z-10 px-6', bg)}
        >
          <div className={cn('flex h-10 w-10 rotate-45 items-center justify-center border border-primary/20', bg)}>
            <div className="-rotate-45 text-primary/60">{icon}</div>
          </div>
        </motion.div>
      )}

      {!icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={scrollViewport}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={cn('z-10 flex gap-2 px-8', bg)}
        >
          <div className="h-1 w-1 rounded-full bg-primary/40" />
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/60" />
          <div className="h-1 w-1 rounded-full bg-primary/40" />
        </motion.div>
      )}
    </div>
  );
};
