import { cn } from '@/lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-stone-200 animate-pulse',
        className,
      )}
      aria-hidden="true"
    />
  );
}
