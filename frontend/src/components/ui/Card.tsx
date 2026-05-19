import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Subtle radial gradient + sheen for that premium SaaS surface. Defaults to true. */
  premium?: boolean;
  /** Adds soft hover lift + accent ring. */
  interactive?: boolean;
}

export function Card({ className, premium = true, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card',
        'dark:border-ink-800/80 dark:bg-ink-900/50 dark:shadow-none',
        premium && [
          'before:pointer-events-none before:absolute before:inset-0 before:-z-0',
          'before:bg-[radial-gradient(120%_80%_at_0%_0%,rgba(37,99,235,0.035),transparent_55%)]',
          'before:opacity-100',
          'dark:before:bg-[radial-gradient(140%_90%_at_0%_0%,rgba(79,140,255,0.07),transparent_55%)]',
          'after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px',
          'after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent',
          'dark:after:via-white/8',
        ],
        interactive && 'hover-lift cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('relative flex items-start justify-between gap-4 px-5 pb-3 pt-5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        'text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50',
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mt-0.5 text-sm text-ink-500 dark:text-ink-400', className)}>{children}</p>
  );
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('relative px-5 pb-5 pt-2', className)}>{children}</div>;
}
