import { cn } from '@/lib/cn';
import { formatNumber } from '@/lib/price';

interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
}

const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };

export function StarRating({
  value,
  max = 5,
  size = 'md',
  className,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const fill = Math.min(1, Math.max(0, value - i));
    return fill;
  });

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {stars.map((fill, i) => (
        <svg
          key={i}
          className={cn(sizeMap[size])}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          {fill === 1 ? (
            <path
              d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78L10 1z"
              fill="#C9943F"
            />
          ) : fill > 0 ? (
            <>
              <defs>
                <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset={`${fill * 100}%`} stopColor="#C9943F" />
                  <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path
                d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78L10 1z"
                fill={`url(#half-${i})`}
              />
            </>
          ) : (
            <path
              d="M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.31L10 13.27l-4.78 2.52.91-5.31L2.27 6.62l5.34-.78L10 1z"
              fill="#E5E7EB"
            />
          )}
        </svg>
      ))}
      {showValue && (
        <span className="font-tajawal text-sm font-semibold text-charcoal">
          {value.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="font-tajawal text-sm text-charcoal/60">
          ({formatNumber(reviewCount)})
        </span>
      )}
    </div>
  );
}
