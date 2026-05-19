import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Package,
  TrendingUp,
  Users as UsersIcon,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { productsApi, usersApi } from '../api';
import { Product, ProductStats, UserStats } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { StatSkeleton } from '../components/ui/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { formatDate, formatNumber } from '../lib/format';
import { useTheme } from '../context/ThemeContext';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const { theme } = useTheme();
  const [productStats, setProductStats] = useState<ProductStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const reqs: Promise<unknown>[] = [productsApi.getAll({ active: true })];
        if (isAdmin) reqs.push(productsApi.getStats(), usersApi.getStats());
        const results = await Promise.all(reqs);
        const prods = (results[0] as { data: { data?: Product[] } }).data.data ?? [];
        setProducts(prods);
        if (isAdmin) {
          setProductStats((results[1] as { data: { data?: ProductStats } }).data.data ?? null);
          setUserStats((results[2] as { data: { data?: UserStats } }).data.data ?? null);
        } else {
          setProductStats({ totalProducts: prods.length, totalStock: 0, lowStock: 0, byCategory: [] });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const trend = Array.from({ length: 12 }).map((_, i) => ({
    label: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i],
    stock: Math.round(40 + Math.sin(i / 1.8) * 22 + i * 3 + Math.random() * 6),
    productos: Math.round(8 + i * 1.4 + Math.random() * 3),
  }));

  const byCategory = (productStats?.byCategory ?? []).map((c) => ({
    name: c.name.length > 10 ? c.name.slice(0, 9) + '…' : c.name,
    productos: c._count.products,
  }));

  const lowStock = products.filter((p) => p.stock <= 10).slice(0, 5);

  const axisColor = theme === 'dark' ? '#6b7896' : '#94a0b8';
  const gridColor = theme === 'dark' ? '#1c2747' : '#eef0f5';
  const tooltipBg = theme === 'dark' ? 'rgba(14,23,48,0.95)' : 'rgba(255,255,255,0.98)';
  const tooltipBorder = theme === 'dark' ? '#2a385e' : '#e0e4ec';
  const tooltipText = theme === 'dark' ? '#f1f5fb' : '#0b1220';

  return (
    <Layout
      title={`${greeting}, ${user?.name?.split(' ')[0] ?? ''}`}
      description={
        isAdmin
          ? 'Resumen general del sistema. Métricas, actividad y alertas a un vistazo.'
          : 'Tu panel personal. Explorá el catálogo y mantenete al día.'
      }
      actions={
        <Badge tone={isAdmin ? 'admin' : 'brand'} dot pulse>
          {isAdmin ? 'Modo administrador' : 'Modo usuario'}
        </Badge>
      }
    >
      {/* Stats */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {loading ? (
          Array.from({ length: isAdmin ? 4 : 2 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Productos activos"
              value={productStats?.totalProducts ?? 0}
              icon={<Package size={18} />}
              tone="brand"
              trend={4.2}
              hint="En el catálogo"
              delay={0}
            />
            {isAdmin && (
              <>
                <StatCard
                  label="Stock total"
                  value={productStats?.totalStock ?? 0}
                  icon={<Boxes size={18} />}
                  tone="success"
                  trend={2.1}
                  hint="Unidades disponibles"
                  delay={0.06}
                />
                <StatCard
                  label="Stock crítico"
                  value={productStats?.lowStock ?? 0}
                  icon={<AlertTriangle size={18} />}
                  tone="warning"
                  trend={-1.4}
                  hint="Productos con ≤ 10 unidades"
                  delay={0.12}
                />
                <StatCard
                  label="Usuarios"
                  value={userStats?.totalUsers ?? 0}
                  icon={<UsersIcon size={18} />}
                  tone="danger"
                  hint={`${userStats?.admins ?? 0} admins · ${userStats?.regularUsers ?? 0} users`}
                  delay={0.18}
                />
              </>
            )}
          </>
        )}
      </motion.div>

      {/* Main analytics row */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        <motion.div variants={sectionVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Evolución del inventario</CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  Stock y productos del último año
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-ink-500 dark:text-ink-400">
                  <span className="h-2 w-2 rounded-full bg-brand-600 shadow-[0_0_0_3px_rgba(37,99,235,0.16)]" />
                  Stock
                </span>
                <span className="flex items-center gap-1.5 text-ink-500 dark:text-ink-400">
                  <span className="h-2 w-2 rounded-full bg-danger-500 shadow-[0_0_0_3px_rgba(239,68,68,0.16)]" />
                  Productos
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.45} />
                        <stop offset="60%" stopColor="#3b82f6" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                        <stop offset="60%" stopColor="#ef4444" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="line1" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                      <linearGradient id="line2" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={gridColor} strokeDasharray="2 6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke={axisColor}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={4}
                    />
                    <YAxis
                      stroke={axisColor}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <RTooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${tooltipBorder}`,
                        background: tooltipBg,
                        color: tooltipText,
                        fontSize: 12,
                        padding: '10px 12px',
                        backdropFilter: 'blur(12px)',
                        boxShadow:
                          theme === 'dark'
                            ? '0 12px 32px -8px rgba(0,0,0,0.5), 0 4px 12px -2px rgba(0,0,0,0.3)'
                            : '0 12px 32px -8px rgba(15,23,42,0.18), 0 4px 12px -2px rgba(15,23,42,0.08)',
                      }}
                      labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                      cursor={{ stroke: theme === 'dark' ? '#2a385e' : '#cbd5e1', strokeDasharray: '3 3' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="stock"
                      stroke="url(#line1)"
                      strokeWidth={2.2}
                      fill="url(#g1)"
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Area
                      type="monotone"
                      dataKey="productos"
                      stroke="url(#line2)"
                      strokeWidth={2.2}
                      fill="url(#g2)"
                      animationDuration={1400}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Por categoría</CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  Distribución de productos
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {byCategory.length === 0 ? (
                <div className="flex h-56 items-center justify-center text-sm text-ink-500 dark:text-ink-400">
                  Sin datos suficientes
                </div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byCategory} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="barG" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.85} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={gridColor} strokeDasharray="2 6" vertical={false} />
                      <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} dy={4} />
                      <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} width={28} />
                      <RTooltip
                        cursor={{ fill: theme === 'dark' ? 'rgba(79,140,255,0.08)' : 'rgba(37,99,235,0.06)' }}
                        contentStyle={{
                          borderRadius: 12,
                          border: `1px solid ${tooltipBorder}`,
                          background: tooltipBg,
                          color: tooltipText,
                          fontSize: 12,
                          padding: '8px 10px',
                          backdropFilter: 'blur(12px)',
                          boxShadow:
                            theme === 'dark'
                              ? '0 12px 32px -8px rgba(0,0,0,0.5)'
                              : '0 12px 32px -8px rgba(15,23,42,0.18)',
                        }}
                      />
                      <Bar
                        dataKey="productos"
                        fill="url(#barG)"
                        radius={[8, 8, 2, 2]}
                        animationDuration={1100}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Secondary row */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Stock crítico */}
        <motion.div variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-600 ring-1 ring-amber-200/60 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25">
                    <AlertTriangle size={13} />
                  </span>
                  Stock crítico
                </CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  Productos que requieren reposición
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {lowStock.length === 0 ? (
                <div className="rounded-xl border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-500 dark:border-ink-800 dark:text-ink-400">
                  Todo bajo control
                </div>
              ) : (
                <ul className="space-y-2">
                  {lowStock.map((p, idx) => {
                    const pct = Math.min(100, (p.stock / 10) * 100);
                    const isOut = p.stock === 0;
                    const isCrit = p.stock < 5;
                    return (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative overflow-hidden rounded-xl border border-ink-200/70 bg-white p-3 transition-all duration-200 hover:border-ink-300 hover:shadow-soft dark:border-ink-800/70 dark:bg-ink-900/40 dark:hover:border-ink-700"
                      >
                        {isOut && (
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_0%_50%,rgba(239,68,68,0.07),transparent_55%)]" />
                        )}
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">
                              {p.name}
                            </div>
                            <div className="text-xs text-ink-500 dark:text-ink-400">{p.category.name}</div>
                          </div>
                          <Badge tone={isOut ? 'danger' : 'warning'} dot pulse={isOut}>
                            {p.stock} u.
                          </Badge>
                        </div>
                        <div className="relative mt-2.5 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800/80">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 + idx * 0.05 }}
                            className={
                              isOut
                                ? 'h-full bg-gradient-to-r from-danger-400 to-danger-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                                : isCrit
                                ? 'h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                : 'h-full bg-gradient-to-r from-brand-400 to-brand-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
                            }
                          />
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Actividad reciente — premium timeline */}
        <motion.div variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600 ring-1 ring-brand-200/60 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/25">
                    <Activity size={13} />
                  </span>
                  Actividad reciente
                </CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  Movimientos del sistema
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-5 pl-6">
                {/* connector line — gradient fade */}
                <div className="absolute left-[9px] top-1.5 h-[calc(100%-12px)] w-px bg-gradient-to-b from-ink-200 via-ink-200 to-transparent dark:from-ink-700 dark:via-ink-700/60 dark:to-transparent" />
                {[
                  { color: 'brand', glow: 'rgba(59,130,246,0.45)', title: 'Nuevo producto creado', meta: 'hace 2h', sub: 'Smartphone XL · admin' },
                  { color: 'emerald', glow: 'rgba(16,185,129,0.45)', title: 'Stock actualizado', meta: 'hace 4h', sub: '+120 unidades' },
                  { color: 'amber', glow: 'rgba(245,158,11,0.45)', title: 'Alerta de stock crítico', meta: 'ayer', sub: 'Auriculares BT · 3 u.' },
                  { color: 'danger', glow: 'rgba(239,68,68,0.45)', title: 'Producto eliminado', meta: 'hace 2 días', sub: 'Cable USB v1' },
                ].map((e, i) => {
                  const dotColor =
                    e.color === 'brand'
                      ? 'bg-brand-500'
                      : e.color === 'emerald'
                      ? 'bg-emerald-500'
                      : e.color === 'amber'
                      ? 'bg-amber-500'
                      : 'bg-danger-500';
                  return (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                      className="relative"
                    >
                      {/* dot */}
                      <span
                        className={`absolute -left-[18px] top-1 flex h-3 w-3 items-center justify-center rounded-full ${dotColor} ring-4 ring-white dark:ring-ink-900`}
                        style={{ boxShadow: `0 0 0 4px ${e.glow}1f, 0 0 12px ${e.glow}` }}
                      >
                        <span className={`h-1 w-1 rounded-full bg-white/80`} />
                      </span>
                      <div className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">{e.title}</div>
                      <div className="text-xs text-ink-500 dark:text-ink-400">{e.sub}</div>
                      <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-ink-400 dark:text-ink-500">{e.meta}</div>
                    </motion.li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <motion.div variants={sectionVariants}>
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="relative flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/25">
                    <TrendingUp size={13} />
                  </span>
                  {isAdmin ? 'Usuarios recientes' : 'Accesos rápidos'}
                </CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  {isAdmin ? 'Últimas altas del sistema' : 'Acciones que podés hacer'}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <ul className="space-y-2.5">
                  {(userStats?.recentUsers ?? []).slice(0, 5).map((u, i) => (
                    <motion.li
                      key={u.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="group flex items-center gap-3 rounded-xl border border-ink-200/70 bg-white/60 p-2.5 transition-all duration-200 hover:-translate-y-px hover:border-ink-300 hover:shadow-soft dark:border-ink-800/70 dark:bg-ink-900/30 dark:hover:border-ink-700"
                    >
                      <Avatar name={u.name} size="sm" tone={u.role === 'ADMIN' ? 'danger' : 'brand'} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">{u.name}</div>
                        <div className="truncate text-xs text-ink-500 dark:text-ink-400">{u.email}</div>
                      </div>
                      <Badge tone={u.role === 'ADMIN' ? 'admin' : 'brand'}>{u.role}</Badge>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-2">
                  {[
                    { href: '/products', icon: Package, title: 'Ver productos', sub: 'Explorá el catálogo' },
                    { href: '/categories', icon: Boxes, title: 'Ver categorías', sub: 'Organización del catálogo' },
                  ].map((a, i) => {
                    const Icon = a.icon;
                    return (
                      <motion.a
                        key={a.href}
                        href={a.href}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="group flex items-center justify-between rounded-xl border border-ink-200/70 bg-white/60 p-3 transition-all duration-200 hover:-translate-y-px hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-[0_8px_24px_-8px_rgba(37,99,235,0.18)] dark:border-ink-800/70 dark:bg-ink-900/30 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-white text-brand-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-brand-100 transition-transform duration-200 group-hover:scale-[1.05] dark:from-brand-500/15 dark:to-ink-900 dark:text-brand-300 dark:ring-brand-500/25">
                            <Icon size={16} />
                          </span>
                          <div>
                            <div className="text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">{a.title}</div>
                            <div className="text-xs text-ink-500 dark:text-ink-400">{a.sub}</div>
                          </div>
                        </div>
                        <ArrowUpRight size={16} className="text-ink-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                      </motion.a>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {productStats?.byCategory && productStats.byCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Card className="mt-6">
            <CardHeader>
              <div>
                <CardTitle>Detalle por categoría</CardTitle>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  Cantidad de productos por categoría registrada
                </p>
              </div>
              <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-semibold text-ink-600 dark:bg-ink-800/70 dark:text-ink-300">
                {productStats.byCategory.length} categorías · {formatNumber(productStats.totalProducts)} productos
              </span>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {productStats.byCategory.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="group flex items-center justify-between rounded-xl border border-ink-200/70 bg-white/60 px-3.5 py-3 transition-all duration-200 hover:-translate-y-px hover:border-brand-300 hover:bg-brand-50/30 hover:shadow-soft dark:border-ink-800/70 dark:bg-ink-900/30 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold tracking-tight text-ink-900 dark:text-ink-50">{c.name}</div>
                      {c.description && (
                        <div className="truncate text-xs text-ink-500 dark:text-ink-400">{c.description}</div>
                      )}
                    </div>
                    <Badge tone="brand">{c._count.products}</Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="mt-6 flex items-center gap-2 text-[11px] text-ink-400 dark:text-ink-500">
        <span className="h-1 w-1 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.2)]" />
        Última actualización: {formatDate(new Date())}
      </div>
    </Layout>
  );
}
