import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatCardProps {
  label: string;
  value: number;
  icon?: ReactNode;
  tone?: 'brand' | 'danger' | 'success' | 'warning';
  prefix?: string;
  suffix?: string;
  trend?: number;
  hint?: string;
  delay?: number;
}

const toneRadial = {
  brand: 'bg-[radial-gradient(120%_80%_at_100%_0%,rgba(37,99,235,0.14),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(79,140,255,0.22),transparent_55%)]',
  danger: 'bg-[radial-gradient(120%_80%_at_100%_0%,rgba(239,68,68,0.12),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(248,113,113,0.20),transparent_55%)]',
  success: 'bg-[radial-gradient(120%_80%_at_100%_0%,rgba(16,185,129,0.12),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(52,211,153,0.18),transparent_55%)]',
  warning: 'bg-[radial-gradient(120%_80%_at_100%_0%,rgba(245,158,11,0.14),transparent_55%)] dark:bg-[radial-gradient(120%_80%_at_100%_0%,rgba(251,191,36,0.20),transparent_55%)]',
};

const iconBox = {
  brand: 'text-brand-600 bg-brand-50 ring-brand-200/60 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/25',
  danger: 'text-danger-600 bg-danger-50 ring-danger-200/60 dark:bg-danger-500/15 dark:text-danger-300 dark:ring-danger-500/25',
  success: 'text-emerald-600 bg-emerald-50 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/25',
  warning: 'text-amber-600 bg-amber-50 ring-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25',
};

function useAnimatedNumber(target: number, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(from + (target - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export function StatCard({ label, value, icon, tone = 'brand', prefix, suffix, trend, hint, delay = 0 }: StatCardProps) {
  const animated = useAnimatedNumber(value);
  const display = Number.isInteger(value) ? Math.round(animated).toLocaleString('es-AR') : animated.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white p-5',
        'shadow-card transition-[box-shadow,border-color] duration-300 ease-out-soft',
        'hover:shadow-card-hover hover:border-ink-300/80',
        'dark:border-ink-800/80 dark:bg-ink-900/60 dark:hover:border-ink-700',
      )}
    >
      {/* radial accent glow */}
      <div className={cn('pointer-events-none absolute inset-0 -z-0', toneRadial[tone])} />
      {/* top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/10" />
      {/* hover beam */}
      <div className="pointer-events-none absolute -inset-px -z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-10 -top-1 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
      </div>

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
            {label}
          </div>
          <div className="mt-2 font-display text-[28px] font-bold leading-none tracking-tight text-ink-900 dark:text-ink-50 sm:text-[30px]">
            {prefix}
            <span className="tabular-nums">{display}</span>
            {suffix}
          </div>
          {hint && (
            <div className="mt-2 text-xs text-ink-500 dark:text-ink-400">{hint}</div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
              'transition-transform duration-300 ease-out-soft group-hover:scale-[1.06] group-hover:rotate-[-2deg]',
              iconBox[tone],
            )}
          >
            {icon}
          </div>
        )}
      </div>
      {typeof trend === 'number' && (
        <div className="relative mt-4 flex items-center gap-2 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold ring-1 ring-inset',
              trend >= 0
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/25'
                : 'bg-danger-50 text-danger-700 ring-danger-200/60 dark:bg-danger-500/10 dark:text-danger-300 dark:ring-danger-500/25',
            )}
          >
            {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-ink-500 dark:text-ink-400">vs mes anterior</span>
        </div>
      )}
    </motion.div>
  );
}
