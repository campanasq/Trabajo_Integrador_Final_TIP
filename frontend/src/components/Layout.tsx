import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from './CommandPalette';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

export default function Layout({ children, title, description, actions }: LayoutProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="bg-app-grid min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="relative min-h-screen min-w-0 flex-1 px-6 pb-14">
          <TopBar onOpenPalette={() => setPaletteOpen(true)} />

          {(title || actions) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                {title && (
                  <h1 className="font-display text-[26px] font-bold tracking-tight text-ink-900 dark:text-ink-50 sm:text-[30px]">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink-500 dark:text-ink-400">
                    {description}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </motion.div>
          )}

          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
