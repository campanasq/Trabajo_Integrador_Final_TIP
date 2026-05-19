import { cn } from '../../lib/cn';
import { initials as toInitials } from '../../lib/format';

interface AvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'danger' | 'neutral';
  className?: string;
}

const sizes = {
  xs: 'h-7 w-7 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
};

const tones = {
  brand:
    'bg-gradient-to-br from-brand-400 via-brand-600 to-brand-800 text-white ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_8px_-2px_rgba(37,99,235,0.4)] ' +
    'ring-white dark:ring-ink-900',
  danger:
    'bg-gradient-to-br from-danger-300 via-danger-500 to-danger-700 text-white ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_8px_-2px_rgba(239,68,68,0.4)] ' +
    'ring-white dark:ring-ink-900',
  neutral:
    'bg-gradient-to-br from-ink-200 via-ink-300 to-ink-400 text-ink-800 ' +
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ' +
    'ring-white dark:from-ink-700 dark:via-ink-800 dark:to-ink-900 dark:text-ink-100 dark:ring-ink-900',
};

export function Avatar({ name, size = 'md', tone = 'brand', className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-bold tracking-tight ring-2',
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {toInitials(name)}
    </span>
  );
}
