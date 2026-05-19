import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  User,
  LogOut,
  Boxes,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/cn';
import { Avatar } from './ui/Avatar';
import { Badge } from './ui/Badge';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

const main: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/categories', label: 'Categorías', icon: Tags },
];

const admin: NavItem[] = [
  { to: '/users', label: 'Usuarios', icon: Users, adminOnly: true },
];

const account: NavItem[] = [{ to: '/profile', label: 'Mi perfil', icon: User }];

function Item({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        cn(
          'group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium tracking-tight',
          'transition-all duration-200 ease-out-soft',
          isActive
            ? 'text-brand-700 dark:text-brand-200'
            : 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800/50 dark:hover:text-ink-50',
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* active background pill (shared layout for smooth transition) */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bg"
              className="absolute inset-0 -z-0 rounded-lg bg-gradient-to-r from-brand-50 to-brand-50/40 ring-1 ring-inset ring-brand-200/60 dark:from-brand-500/15 dark:to-brand-500/5 dark:ring-brand-500/25"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            />
          )}
          {/* active left indicator */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute -left-3 h-5 w-[3px] rounded-r-full bg-gradient-to-b from-brand-400 to-brand-600 shadow-[0_0_10px_rgba(37,99,235,0.5)] dark:from-brand-300 dark:to-brand-500"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <Icon
            size={16}
            className={cn(
              'relative z-10 shrink-0 transition-all duration-200',
              isActive ? 'text-brand-600 dark:text-brand-300' : 'opacity-90 group-hover:scale-[1.06]',
            )}
            strokeWidth={isActive ? 2.4 : 2}
          />
          <span className="relative z-10">{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400 dark:text-ink-500">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen w-[252px] shrink-0 flex-col lg:flex',
        'border-r border-ink-200/70 bg-white/75 backdrop-blur-2xl',
        'dark:border-ink-800/70 dark:bg-ink-950/60',
        // very subtle inner edge glow on dark
        'dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.02)]',
      )}
    >
      {/* ambient highlight at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink-300/40 to-transparent dark:via-white/8" />

      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_4px_12px_-2px_rgba(37,99,235,0.4)]">
          <Boxes size={18} strokeWidth={2.4} />
          <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-bold tracking-tight text-ink-900 dark:text-ink-50">
            Stock<span className="gradient-text">Pro</span>
          </div>
          <div className="text-[10px] font-medium text-ink-400 dark:text-ink-500">v2.0 · TIF 2026</div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        <Section title="Principal">
          {main.map((i) => <Item key={i.to} item={i} />)}
        </Section>
        {isAdmin && (
          <Section title="Administración">
            {admin.map((i) => <Item key={i.to} item={i} />)}
          </Section>
        )}
        <Section title="Cuenta">
          {account.map((i) => <Item key={i.to} item={i} />)}
        </Section>
      </nav>

      <div className="relative p-3">
        <div className="divider-soft mb-3" />
        <button
          onClick={() => navigate('/profile')}
          className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all duration-200 hover:bg-ink-100/70 dark:hover:bg-ink-800/50"
        >
          <Avatar name={user?.name} size="sm" tone={isAdmin ? 'danger' : 'brand'} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {user?.name}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Badge tone={isAdmin ? 'admin' : 'brand'} dot pulse>
                {isAdmin ? 'Admin' : 'User'}
              </Badge>
            </div>
          </div>
        </button>
        <button
          onClick={logout}
          className="mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-ink-500 transition-all duration-200 hover:bg-danger-50 hover:text-danger-600 active:scale-[0.99] dark:text-ink-400 dark:hover:bg-danger-500/10 dark:hover:text-danger-300"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
