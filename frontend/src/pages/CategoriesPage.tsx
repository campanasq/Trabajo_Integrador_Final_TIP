import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Plus, Tag, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { categoriesApi } from '../api';
import { Category } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { Input, Textarea, Label, Field } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';

export default function CategoriesPage() {
  const { isAdmin } = useAuth();
  const { success, error: tError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try { const r = await categoriesApi.getAll(); setCategories(r.data.data || []); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', description: '' }); setError(''); setOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description || '' }); setError(''); setOpen(true); };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) {
        await categoriesApi.update(editing.id, form);
        success('Categoría actualizada');
      } else {
        await categoriesApi.create(form);
        success('Categoría creada');
      }
      setOpen(false);
      await load();
    } catch (err) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (deleteId == null) return;
    setDeleting(true);
    try {
      await categoriesApi.delete(deleteId);
      success('Categoría eliminada');
      setDeleteId(null);
      await load();
    } catch (err) {
      tError('No se pudo eliminar', (err as { response?: { data?: { message?: string } } })?.response?.data?.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout
      title="Categorías"
      description={isAdmin ? 'Organizá el catálogo agrupando productos en categorías.' : 'Categorías disponibles en el catálogo.'}
      actions={isAdmin && <Button leftIcon={<Plus size={14} />} onClick={openNew}>Nueva categoría</Button>}
    >
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-5">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-2 h-3 w-48" />
              <Skeleton className="mt-4 h-3 w-16" />
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={24} />}
          title="Sin categorías aún"
          description="Creá tu primera categoría para empezar a organizar productos"
          action={isAdmin && <Button leftIcon={<Plus size={14} />} onClick={openNew}>Crear categoría</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="hover-lift group relative overflow-hidden p-5">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand-100 to-transparent opacity-60 dark:from-brand-500/10" />
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20">
                      <Tag size={16} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold tracking-tight text-ink-900 dark:text-ink-50">{c.name}</h3>
                      <div className="font-mono text-[11px] text-ink-400 dark:text-ink-500">#{c.id}</div>
                    </div>
                  </div>
                  <Badge tone="brand">{c._count?.products ?? 0} productos</Badge>
                </div>

                {c.description && (
                  <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">{c.description}</p>
                )}

                {isAdmin && (
                  <div className="mt-4 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <Button variant="secondary" size="sm" leftIcon={<Edit2 size={12} />} onClick={() => openEdit(c)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-danger-600 hover:bg-danger-50 dark:text-danger-300 dark:hover:bg-danger-500/10" leftIcon={<Trash2 size={12} />} onClick={() => setDeleteId(c.id)}>
                      Eliminar
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
        description={editing ? `#${editing.id}` : 'Definí un nombre y una descripción opcional'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button form="cat-form" type="submit" loading={saving}>
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        {error && (
          <div className="mb-3 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-300">
            {error}
          </div>
        )}
        <form id="cat-form" onSubmit={submit} className="space-y-4">
          <Field>
            <Label htmlFor="c-name">Nombre</Label>
            <Input id="c-name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field>
            <Label htmlFor="c-desc">Descripción</Label>
            <Textarea id="c-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={onDelete}
        title="Eliminar categoría"
        description="Solo se puede eliminar si no tiene productos asociados."
        danger
        loading={deleting}
        confirmLabel="Sí, eliminar"
      />
    </Layout>
  );
}
