import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink-800/40 bg-ink-900/95 px-2 py-1 text-[11px] font-medium text-white shadow-pop backdrop-blur dark:border-white/10 dark:bg-ink-50/95 dark:text-ink-900"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
