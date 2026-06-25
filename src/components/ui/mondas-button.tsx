'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ButtonLoader } from '@/components/common/Loaders';

type MondasButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'outline';
};

export const MondasButton = forwardRef<HTMLButtonElement, MondasButtonProps>(
  ({ loading, variant = 'primary', className, children, disabled, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(variant === 'primary' ? 'btn-mondas' : 'btn-mondas-outline', className)}
        {...props}
      >
        {loading ? <ButtonLoader /> : children}
      </button>
    );
  },
);

MondasButton.displayName = 'MondasButton';
