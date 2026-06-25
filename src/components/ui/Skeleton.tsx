import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-border-subtle/20 rounded-md",
        className
      )}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-2 h-2 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const TestimonialSkeleton = () => {
  return (
    <div className="space-y-4 p-8 border border-border-subtle bg-bg-card">
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-3 h-3" />
        ))}
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
};
