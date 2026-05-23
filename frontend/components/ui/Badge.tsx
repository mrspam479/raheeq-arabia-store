import * as React from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'emerald' | 'saffron' | 'ivory' | 'red';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald text-white',
  saffron: 'bg-saffron text-emerald',
  ivory: 'bg-white text-emerald border border-emerald/12 shadow-sm',
  red: 'bg-red-100 text-red-700',
};

export function Badge({ variant = 'emerald', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-tajawal font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
