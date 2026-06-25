import React from 'react';
import { cn } from '@/lib/utils';

interface GlobalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * A standardized Global Button component 
 * demonstrated the use of centralized CSS variables.
 */
export const GlobalButton: React.FC<GlobalButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  loading,
  ...props 
}) => {
  const variants = {
    primary: "bg-[var(--btn-primary)] text-[var(--btn-text)] hover:brightness-110",
    secondary: "bg-bg-card text-text-main border border-border-subtle hover:bg-bg-page",
    outline: "bg-transparent text-[var(--btn-primary)] border border-brand-primary hover:bg-brand-primary hover:text-brand-foreground",
    ghost: "bg-transparent text-text-muted hover:bg-bg-card hover:text-text-main",
  };

  const sizes = {
    sm: "px-4 py-1.5 text-[10px]",
    md: "px-8 py-3 text-xs",
    lg: "px-12 py-4 text-sm",
  };

  return (
    <button
      className={cn(
        "font-bold uppercase tracking-widest transition-all duration-300",
        variants[variant],
        sizes[size],
        loading && "opacity-70 cursor-wait",
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {loading && (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </div>
    </button>
  );
};
