/**
 * رحيق Logo component.
 * Layout: [Saffron Gold seal] + [رحيق Tajawal Bold] + [Raheeq Arabia Cormorant italic]
 * Sizes: sm (header) | md (default) | lg (footer/hero)
 */
import { cn } from '@/lib/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light';
  className?: string;
  hideSubline?: boolean;
}

const sizeMap = {
  sm: { circle: 32, font: 'text-xl', sub: 'text-[10px]' },
  md: { circle: 40, font: 'text-2xl', sub: 'text-xs' },
  lg: { circle: 56, font: 'text-3xl', sub: 'text-sm' },
};

export function Logo({
  size = 'md',
  variant = 'default',
  className,
  hideSubline = false,
}: LogoProps) {
  const { circle, font, sub } = sizeMap[size];
  const wordmarkColor = variant === 'light' ? 'text-ivory' : 'text-emerald';
  const subColor = variant === 'light' ? 'text-ivory/70' : 'text-charcoal/60';

  return (
    <div className={cn('flex items-center gap-2.5', className)} aria-label="رحيق Raheeq Arabia">
      {/* Decorative saffron seal. The wordmark keeps the single visible ر. */}
      <div
        className="rounded-full bg-saffron flex items-center justify-center shrink-0 shadow-[0_8px_18px_rgba(216,166,76,0.24)]"
        style={{ width: circle, height: circle }}
        aria-hidden="true"
      >
        <span className="block h-1/2 w-1/2 rounded-full border-2 border-emerald/70 bg-ivory/45" />
      </div>

      <div className="flex flex-col leading-tight">
        <span
          className={cn('font-tajawal font-bold leading-none tracking-tight', font, wordmarkColor)}
        >
          رحيق
        </span>
        {!hideSubline && (
          <span
            className={cn(
              'font-cormorant italic leading-none tracking-wide',
              sub,
              subColor,
            )}
          >
            Raheeq Arabia
          </span>
        )}
      </div>
    </div>
  );
}
