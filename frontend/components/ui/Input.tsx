import * as React from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-tajawal font-medium text-emerald"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-12 w-full rounded-xl border px-4 text-base font-tajawal text-charcoal',
            'bg-ivory placeholder:text-charcoal/40 transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-emerald focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-stone-300 hover:border-emerald/50',
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 font-tajawal" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-charcoal/60 font-tajawal">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
