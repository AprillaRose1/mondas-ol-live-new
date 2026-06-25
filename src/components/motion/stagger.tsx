'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { staggerContainer, scrollViewport } from '@/lib/animations';
import { cn } from '@/lib/utils';

export function Stagger({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
