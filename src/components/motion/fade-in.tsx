'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { fadeInUp, scrollViewport } from '@/lib/animations';
import { cn } from '@/lib/utils';

type FadeInProps = HTMLMotionProps<'div'> & {
  delay?: number;
};

export function FadeIn({ className, children, delay = 0, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
