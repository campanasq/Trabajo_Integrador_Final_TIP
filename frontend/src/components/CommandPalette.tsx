import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Search,
  Sun,
  Tags,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cn';

interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  onSelect: () => void;
  group: string;
  keywords?: string;
  hidden?: boolean;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const go = (to: string) => () => {
    navigate(to);
    onClose();
  };

  const items: CommandItem[] = useMemo(() => [
    { id: 'dash', label: 'Ir a Dashboard', icon: LayoutDashboard, onSelect: go('/dashboard'), group: 'Navegación' },
    { id: 'prod', label: 'Ir a Productos', icon: Package, onSelect: go('/products'), group: 'Navegación' },
    { id: 'cat', label: 'Ir a Categorías', icon: Tags, onSelect: go('/categories'), group: 'Navegación' },
    { id: 'usr', label: 'Ir a Usuarios', icon: Users, onSelect: go('/users'), group: 'Navegación', hidden: !isAdmin },
    { id: 'me', label: 'Mi perfil', icon: User, onSelect: go('/profile'), group: 'Navegación' },
    { id: 'theme', label: theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro', icon: theme === 'dark' ? Sun : Moon, onSelect: () => { toggle(); onClose(); }, group: 'Apariencia' },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut, onSelect: () => { logout(); navigate('/login'); onClose(); }, group: 'Cuenta' },
  ].filter((i) => !i.hidden), [isAdmin, theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => (i.label + ' ' + (i.keywords ?? '')).toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => { setActive(0); }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); filtered[active]?.onSelect(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, active, onClose]);

  // groups
  const groups = useMemo(() => {
    const g: Record<string, CommandItem[]> = {};
    filtered.forEach((i) => {
      (g[i.group] ||= []).push(i);
    });
    return g;
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[14vh]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink-950/55 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-pop before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-brand-400/60 before:to-transparent dark:border-ink-800 dark:bg-ink-900 dark:before:via-brand-400/40"
          >
            <div className="flex items-center gap-2.5 border-b border-ink-100 px-4 dark:border-ink-800">
              <Search size={16} className="text-ink-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscá comandos, páginas, productos…"
                className="h-12 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-ink-50"
              />
              <kbd className="hidden rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 sm:block dark:border-ink-700 dark:bg-ink-800 dark:text-ink-400">
                ESC
              </kbd>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-ink-500 dark:text-ink-400">
                  No se encontraron resultados
                </div>
              ) : (
                Object.entries(groups).map(([group, list]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500">
                      {group}
                    </div>
                    {list.map((item) => {
                      const idx = filtered.indexOf(item);
                      const isActive = idx === active;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={item.onSelect}
                          className={cn(
                            'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium tracking-tight transition-all duration-150',
                            isActive
                              ? 'bg-gradient-to-r from-brand-50 to-brand-50/40 text-brand-700 ring-1 ring-inset ring-brand-200/60 dark:from-brand-500/15 dark:to-brand-500/5 dark:text-brand-300 dark:ring-brand-500/25'
                              : 'text-ink-700 hover:bg-ink-50/70 dark:text-ink-200 dark:hover:bg-ink-800/50',
                          )}
                        >
                          <Icon size={15} className={cn('transition-transform duration-200', isActive && 'scale-110')} />
                          <span className="flex-1">{item.label}</span>
                          <ArrowRight size={14} className={cn('translate-x-0 opacity-0 transition-all duration-200', isActive && 'translate-x-0 opacity-90')} />
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between border-t border-ink-100 px-4 py-2 text-[11px] text-ink-400 dark:border-ink-800 dark:text-ink-500">
              <div className="flex items-center gap-3">
                <span><kbd className="rounded border border-ink-200 bg-ink-50 px-1 py-0.5 dark:border-ink-700 dark:bg-ink-800">↑↓</kbd> navegar</span>
                <span><kbd className="rounded border border-ink-200 bg-ink-50 px-1 py-0.5 dark:border-ink-700 dark:bg-ink-800">↵</kbd> seleccionar</span>
              </div>
              <span>StockPro · Cmd Palette</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
