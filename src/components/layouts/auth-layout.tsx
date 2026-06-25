'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { scaleIn } from '@/lib/animations';
import { Logo } from '@/components/common/Logo';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-page px-6 py-12">
      <motion.div variants={scaleIn} initial="hidden" animate="visible" className="mb-10">
        <Link href="/">
          <Logo />
        </Link>
      </motion.div>
      <motion.div
        variants={scaleIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );
}
