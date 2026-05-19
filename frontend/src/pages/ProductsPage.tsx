import { useEffect, useMemo, useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit2,
  Grid3x3,
  ImageIcon,
  List,
  Package as PackageIcon,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsApi, categoriesApi } from '../api';
import { Product, Category, ProductFormData } from '../types';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea, Label, Field } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Skeleton, TableRowSkeleton } from '../components/ui/Skeleton';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Tooltip } from '../components/ui/Tooltip';
import { formatCurrency } from '../lib/format';
import { cn } from '../lib/cn';

const emptyForm: ProductFormData = {
  name: '', description: '', price: 0, stock: 0, categoryId: 0, imageUrl: '', active: true,
};

const PAGE_SIZE = 8;

function ProductModal({
  open, product, categories, onClose, onSave,
}: {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
}) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl || '',
        active: product.active,
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [product, open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) { setError('Seleccioná una categoría'); return; }
    setLoading(true);
    try { await onSave(form); onClose(); }
    catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al guardar');
    } finally { setLoading(false); }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product ? 'Editar producto' : 'Nuevo producto'}
      description={product ? `ID #${product.id}` : 'Completá los datos del nuevo producto'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="product-form" loading={loading}>
            {product ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </>
      }
    >
      {error && (
        <div className="mb-3 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300">
          {error}
        </div>
      )}
      <form id="product-form" onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <Label htmlFor="p-name">Nombre</Label>
          <Input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
        </Field>
        <Field>
          <Label htmlFor="p-price">Precio</Label>
          <Input id="p-price" type="number" step="0.01" min={0} value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required />
        </Field>
        <Field>
          <Label htmlFor="p-stock">Stock</Label>
          <Input id="p-stock" type="number" min={0} value={form.stock}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="p-cat">Categoría</Label>
          <Select id="p-cat" value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })} required>
            <option value={0}>Seleccionar…</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="p-desc">Descripción</Label>
          <Textarea id="p-desc" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="p-img">URL de imagen</Label>
          <Input id="p-img" type="url" placeholder="https://…" value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 p-3 transition hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800/60">
            <input
              type="checkbox" checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-brand-600"
            />
            <div>
              <div className="text-sm font-semibold text-ink-900 dark:text-ink-50">Producto activo</div>
              <div className="text-xs text-ink-500 dark:text-ink-400">Visible en el catálogo público</div>
            </div>
          </label>
        </div>
      </form>
    </Modal>
  );
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<number | undefined>();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive' | 'low'>('all');
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [page, setPage] = useState(1);
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        productsApi.getAll({ categoryId: filterCat, search: search || undefined }),
        categoriesApi.getAll(),
      ]);
      setProducts(p.data.data || []);
      setCategories(c.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filterCat]);

  const filtered = useMemo(() => {
    let r = products;
    if (activeFilter === 'active') r = r.filter((p) => p.active);
    else if (activeFilter === 'inactive') r = r.filter((p) => !p.active);
    else if (activeFilter === 'low') r = r.filter((p) => p.stock <= 10);
    return r;
  }, [products, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { setPage(1); }, [activeFilter, search, filterCat]);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = async (data: ProductFormData) => {
    if (editProduct) {
      await productsApi.update(editProduct.id, data);
      success('Producto actualizado', `"${data.name}" se guardó correctamente`);
    } else {
      await productsApi.create(data);
      success('Producto creado', `"${data.name}" se agregó al catálogo`);
    }
    await load();
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      await productsApi.delete(deleteId);
      success('Producto eliminado');
      setDeleteId(null);
      await load();
    } catch (err) {
      toastError('No se pudo eliminar', (err as { response?: { data?: { message?: string } } })?.response?.data?.message);
    } finally {
      setDeleting(false);
    }
  };

  const exportCsv = () => {
    const headers = ['id', 'name', 'category', 'price', 'stock', 'active'];
    const rows = filtered.map((p) => [p.id, p.name, p.category.name, p.price, p.stock, p.active]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'productos.csv'; a.click();
    URL.revokeObjectURL(url);
    success('Exportación lista', 'productos.csv');
  };

  return (
    <Layout
      title="Productos"
      description={isAdmin ? 'Gestioná el catálogo completo del sistema' : 'Explorá el catálogo disponible'}
      actions={
        <>
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />} onClick={exportCsv}>
            Exportar
          </Button>
          <div className="hidden h-6 w-px bg-ink-200 dark:bg-ink-800 sm:block" />
          <div className="inline-flex items-center rounded-lg border border-ink-200 bg-white p-0.5 dark:border-ink-800 dark:bg-ink-900">
            <button
              onClick={() => setView('table')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md transition',
                view === 'table' ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'text-ink-500',
              )}
              aria-label="Vista tabla"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md transition',
                view === 'grid' ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'text-ink-500',
              )}
              aria-label="Vista grilla"
            >
              <Grid3x3 size={14} />
            </button>
          </div>
          {isAdmin && (
            <Button leftIcon={<Plus size={14} />} onClick={() => setEditProduct(null)}>
              Nuevo producto
            </Button>
          )}
        </>
      }
    >
      {/* Filters bar */}
      <Card className="p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <form
            onSubmit={(e) => { e.preventDefault(); load(); }}
            className="flex-1"
          >
            <Input
              leftIcon={<Search size={15} />}
              placeholder="Buscar por nombre, descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rightIcon={
                search && (
                  <button type="button" onClick={() => { setSearch(''); load(); }}>
                    <X size={14} />
                  </button>
                )
              }
            />
          </form>
          <Select
            className="sm:w-56"
            value={filterCat ?? ''}
            onChange={(e) => setFilterCat(e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>

        {/* Quick filters */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todos', count: products.length },
            { id: 'active', label: 'Activos', count: products.filter((p) => p.active).length },
            { id: 'inactive', label: 'Inactivos', count: products.filter((p) => !p.active).length },
            { id: 'low', label: 'Stock bajo', count: products.filter((p) => p.stock <= 10).length },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={cn(
                'inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold tracking-tight transition-all duration-200 ease-out-soft',
                activeFilter === f.id
                  ? 'bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-[0_4px_12px_-3px_rgba(37,99,235,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]'
                  : 'bg-ink-100/70 text-ink-600 ring-1 ring-inset ring-ink-200/60 hover:-translate-y-px hover:bg-ink-100 hover:text-ink-800 hover:ring-ink-300 dark:bg-ink-800/60 dark:text-ink-300 dark:ring-ink-700/60 dark:hover:bg-ink-800 dark:hover:text-ink-100',
              )}
            >
              {f.label}
              <span className={cn(
                'rounded-full px-1.5 text-[10px] font-bold tabular-nums',
                activeFilter === f.id ? 'bg-white/25 text-white' : 'bg-white text-ink-600 dark:bg-ink-900 dark:text-ink-300',
              )}>{f.count}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Content */}
      <div className="mt-4">
        {loading ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}
                </tbody>
              </table>
            </Card>
          )
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<PackageIcon size={24} />}
            title="No se encontraron productos"
            description="Probá ajustar los filtros o creá tu primer producto"
            action={isAdmin ? <Button leftIcon={<Plus size={14} />} onClick={() => setEditProduct(null)}>Crear producto</Button> : undefined}
          />
        ) : view === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {pageRows.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Card className="hover-lift group overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-50 to-ink-100 dark:from-ink-800 dark:to-ink-900">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-300 dark:text-ink-700">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className="absolute left-3 top-3">
                        <Badge tone={p.active ? 'success' : 'neutral'} dot>
                          {p.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      {p.stock <= 10 && (
                        <div className="absolute right-3 top-3">
                          <Badge tone={p.stock === 0 ? 'danger' : 'warning'}>
                            {p.stock === 0 ? 'Sin stock' : `${p.stock} u.`}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                        {p.category.name}
                      </div>
                      <h3 className="mt-1 truncate text-sm font-semibold text-ink-900 dark:text-ink-50">{p.name}</h3>
                      {p.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-ink-500 dark:text-ink-400">{p.description}</p>
                      )}
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-xl font-bold text-ink-900 dark:text-ink-50">{formatCurrency(p.price)}</div>
                          <div className="text-[11px] text-ink-500 dark:text-ink-400">{p.stock} unidades</div>
                        </div>
                        {isAdmin && (
                          <div className="flex gap-1">
                            <Tooltip label="Editar">
                              <button onClick={() => setEditProduct(p)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-ink-600 transition hover:bg-ink-50 dark:border-ink-800 dark:text-ink-300 dark:hover:bg-ink-800">
                                <Edit2 size={13} />
                              </button>
                            </Tooltip>
                            <Tooltip label="Eliminar">
                              <button onClick={() => setDeleteId(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 text-danger-600 transition hover:border-danger-200 hover:bg-danger-50 dark:border-ink-800 dark:hover:bg-danger-500/10">
                                <Trash2 size={13} />
                              </button>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Card className="overflow-hidden">
            <div className="max-h-[640px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-ink-50/85 backdrop-blur-md dark:bg-ink-900/85">
                  <tr className="text-left text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                    <th className="px-4 py-3 font-semibold">Producto</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 text-right font-semibold">Precio</th>
                    <th className="px-4 py-3 font-semibold">Stock</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    {isAdmin && <th className="px-4 py-3 text-right font-semibold">Acciones</th>}
                  </tr>
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="p-0">
                      <div className="h-px bg-gradient-to-r from-transparent via-ink-200/80 to-transparent dark:via-ink-700/70" />
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((p, i) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="group/row relative border-b border-ink-100/80 transition-colors duration-200 hover:bg-gradient-to-r hover:from-brand-50/40 hover:via-white hover:to-transparent dark:border-ink-800/50 dark:hover:from-brand-500/8 dark:hover:via-ink-900/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-ink-50 to-ink-100 ring-1 ring-inset ring-ink-200/60 dark:from-ink-800 dark:to-ink-900 dark:ring-ink-700/60">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover/row:scale-105" />
                            ) : (
                              <ImageIcon size={16} className="text-ink-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-semibold tracking-tight text-ink-900 dark:text-ink-50">{p.name}</div>
                            {p.description && (
                              <div className="truncate text-xs text-ink-500 dark:text-ink-400">
                                {p.description.slice(0, 60)}{p.description.length > 60 ? '…' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><Badge tone="brand">{p.category.name}</Badge></td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold tabular-nums text-ink-900 dark:text-ink-50">
                        {formatCurrency(p.price)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                            <div
                              className={cn(
                                'h-full transition-all duration-500',
                                p.stock === 0
                                  ? 'bg-gradient-to-r from-danger-400 to-danger-600 shadow-[0_0_8px_rgba(239,68,68,0.45)]'
                                  : p.stock <= 10
                                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                  : 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.35)]',
                              )}
                              style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                            />
                          </div>
                          <span className={cn(
                            'font-mono text-xs font-semibold tabular-nums',
                            p.stock === 0 ? 'text-danger-600 dark:text-danger-400' :
                            p.stock <= 10 ? 'text-amber-600 dark:text-amber-400' : 'text-ink-700 dark:text-ink-200',
                          )}>{p.stock}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone={p.active ? 'success' : 'neutral'} dot pulse={p.active}>
                          {p.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3.5">
                          <div className="flex justify-end gap-1 opacity-70 transition-opacity duration-200 group-hover/row:opacity-100">
                            <button
                              onClick={() => setEditProduct(p)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-all duration-150 hover:bg-brand-50 hover:text-brand-600 active:scale-95 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 transition-all duration-150 hover:bg-danger-50 hover:text-danger-600 active:scale-95 dark:hover:bg-danger-500/10 dark:hover:text-danger-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="relative flex items-center justify-between border-t border-ink-100 bg-ink-50/30 px-4 py-3 dark:border-ink-800 dark:bg-ink-950/30">
              <div className="text-xs text-ink-500 dark:text-ink-400">
                Mostrando <strong className="font-semibold text-ink-700 dark:text-ink-200">{(page - 1) * PAGE_SIZE + 1}</strong>–
                <strong className="font-semibold text-ink-700 dark:text-ink-200">{Math.min(filtered.length, page * PAGE_SIZE)}</strong> de{' '}
                <strong className="font-semibold text-ink-700 dark:text-ink-200">{filtered.length}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-500 shadow-xs transition-all duration-150 hover:-translate-y-px hover:border-ink-300 hover:bg-ink-50 hover:text-ink-700 disabled:opacity-40 disabled:hover:translate-y-0 dark:border-ink-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                >
                  <ChevronLeft size={14} />
                </button>
                <div className="rounded-md bg-ink-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink-700 dark:bg-ink-800/70 dark:text-ink-200">
                  {page} <span className="text-ink-400">/</span> {totalPages}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-500 shadow-xs transition-all duration-150 hover:-translate-y-px hover:border-ink-300 hover:bg-ink-50 hover:text-ink-700 disabled:opacity-40 disabled:hover:translate-y-0 dark:border-ink-700 dark:bg-ink-900 dark:hover:bg-ink-800 dark:hover:text-ink-100"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <ProductModal
        open={editProduct !== undefined}
        product={editProduct ?? null}
        categories={categories}
        onClose={() => setEditProduct(undefined)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar producto"
        description="Esta acción es permanente y no se puede deshacer."
        confirmLabel="Sí, eliminar"
        danger
        loading={deleting}
      />
    </Layout>
  );
}
