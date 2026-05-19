import { HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'brand' | 'danger' | 'success' | 'warning' | 'neutral' | 'admin';

const tones: Record<Tone, string> = {
  brand:
    'bg-brand-50 text-brand-700 ring-brand-200/60 ' +
    'dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/25',
  danger:
    'bg-danger-50 text-danger-700 ring-danger-200/60 ' +
    'dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/25',
  success:
    'bg-emerald-50 text-emerald-700 ring-emerald-200/60 ' +
    'dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25',
  warning:
    'bg-amber-50 text-amber-800 ring-amber-200/60 ' +
    'dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/25',
  neutral:
    'bg-ink-100 text-ink-700 ring-ink-200/60 ' +
    'dark:bg-ink-800/70 dark:text-ink-200 dark:ring-ink-700/70',
  admin:
    'bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-danger-500/10 text-brand-700 ring-brand-200/70 ' +
    'dark:text-brand-300 dark:ring-brand-500/25',
};

const dotTones: Record<Tone, string> = {
  brand: 'bg-brand-500 shadow-[0_0_0_3px_rgba(37,99,235,0.18)] dark:shadow-[0_0_0_3px_rgba(79,140,255,0.28)]',
  danger: 'bg-danger-500 shadow-[0_0_0_3px_rgba(239,68,68,0.18)]',
  success: 'bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]',
  warning: 'bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.22)]',
  neutral: 'bg-ink-400',
  admin: 'bg-brand-500 shadow-[0_0_0_3px_rgba(37,99,235,0.18)]',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({ tone = 'neutral', className, children, dot, pulse, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset',
        'tracking-tight',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span className={cn('absolute inset-0 rounded-full opacity-75 animate-subtle-pulse', dotTones[tone])} />
          )}
          <span className={cn('relative h-1.5 w-1.5 rounded-full', dotTones[tone])} />
        </span>
      )}
      {children}
    </span>
  );
}
