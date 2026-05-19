import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, Command, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './ui/Avatar';
import { Tooltip } from './ui/Tooltip';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Productos',
  categories: 'Categorías',
  users: 'Usuarios',
  profile: 'Mi perfil',
};

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  return (
    <nav className="flex items-center gap-1.5 text-sm tracking-tight">
      <span className="text-ink-400 dark:text-ink-500">StockPro</span>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-ink-300 dark:text-ink-600" />
          <span
            className={
              i === parts.length - 1
                ? 'font-semibold text-ink-900 dark:text-ink-50'
                : 'text-ink-500 dark:text-ink-400'
            }
          >
            {labels[p] ?? p}
          </span>
        </span>
      ))}
    </nav>
  );
}

const iconBtn =
  'group flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200/80 bg-white/80 text-ink-600 ' +
  'shadow-xs transition-all duration-200 ease-out-soft ' +
  'hover:-translate-y-px hover:bg-white hover:text-ink-900 hover:border-ink-300 hover:shadow-soft ' +
  'active:scale-[0.96] active:translate-y-0 ' +
  'dark:border-ink-800 dark:bg-ink-900/70 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-50 dark:hover:border-ink-700';

export function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { theme, toggle } = useTheme();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 -mx-6 mb-6 border-b border-ink-200/60 bg-white/70 px-6 backdrop-blur-2xl dark:border-ink-800/70 dark:bg-ink-950/55">
      {/* premium hairline bottom */}
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-ink-200/80 to-transparent dark:via-ink-700/60" />

      <div className="flex h-16 items-center justify-between gap-4">
        <Breadcrumbs />

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className={
              'group hidden h-9 items-center gap-2.5 rounded-lg border border-ink-200/80 bg-white/80 px-3 text-sm text-ink-500 ' +
              'shadow-xs transition-all duration-200 ease-out-soft ' +
              'hover:-translate-y-px hover:bg-white hover:text-ink-700 hover:border-ink-300 hover:shadow-soft ' +
              'sm:flex dark:border-ink-800 dark:bg-ink-900/70 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100 dark:hover:border-ink-700'
            }
          >
            <Search size={14} className="text-ink-400 transition-colors duration-200 group-hover:text-brand-500 dark:text-ink-500" />
            <span className="pr-12">Buscar en StockPro…</span>
            <kbd className="flex items-center gap-0.5 rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500 shadow-[inset_0_-1px_0_rgba(15,23,42,0.06)] dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300">
              <Command size={10} /> K
            </kbd>
          </button>

          <Tooltip label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            <button onClick={toggle} aria-label="Cambiar tema" className={iconBtn}>
              <span className="transition-transform duration-300 ease-out-soft group-hover:rotate-12">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </span>
            </button>
          </Tooltip>

          <Tooltip label="Notificaciones">
            <button className={iconBtn + ' relative'}>
              <Bell size={15} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute right-2 top-2 flex h-2 w-2">
                <span className="absolute inset-0 animate-subtle-pulse rounded-full bg-danger-500 opacity-75" />
                <span className="relative h-2 w-2 rounded-full bg-danger-500 ring-2 ring-white dark:ring-ink-950" />
              </span>
            </button>
          </Tooltip>

          <button
            onClick={() => navigate('/profile')}
            className="ml-1 flex items-center gap-2 rounded-lg p-1 transition-all duration-200 hover:bg-ink-100/60 active:scale-[0.97] dark:hover:bg-ink-800/60"
          >
            <Avatar name={user?.name} size="sm" tone={isAdmin ? 'danger' : 'brand'} />
          </button>
        </div>
      </div>
    </header>
  );
}
