import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const PageLoader = () => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: 0 }}
    exit={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg-page pointer-events-none"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-primary font-medium tracking-widest uppercase text-sm">Olea</span>
    </div>
  </motion.div>
);

export const ButtonLoader = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'size-4 animate-spin rounded-full border-2 border-current border-t-transparent',
      className,
    )}
    role="status"
    aria-label="Loading"
  />
);
