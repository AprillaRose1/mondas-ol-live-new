import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'footer';
}

/** Mondas logo — always white, independent of accent theme */
export const Logo: React.FC<LogoProps> = ({ className, variant = 'default' }) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex origin-left flex-col items-start transition-transform duration-500 ease-out group-hover:scale-105',
        className,
      )}
    >
      <div
        className={cn('bg-white', variant === 'default' ? 'h-6 w-24' : 'h-9 w-36')}
        style={{
          maskImage: "url('/logo.png')",
          WebkitMaskImage: "url('/logo.png')",
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'left center',
          WebkitMaskPosition: 'left center',
        }}
        aria-label="Mondas OL"
      />
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mt-[3px] block whitespace-nowrap text-left font-serif text-[7px] font-normal uppercase leading-none tracking-[0.3em] text-white/75',
        )}
      >
        {t('common.logo_slogan')}
      </motion.span>
    </div>
  );
};
