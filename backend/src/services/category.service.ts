import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const categorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const categoryService = {
  async getAll() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  },

  async getById(id: number) {
    const cat = await prisma.category.findUnique({ where: { id }, include: { products: true } });
    if (!cat) throw new Error('Categoría no encontrada');
    return cat;
  },

  async create(data: CategoryInput) {
    const existing = await prisma.category.findUnique({ where: { name: data.name } });
    if (existing) throw new Error('Ya existe una categoría con ese nombre');
    return prisma.category.create({ data });
  },

  async update(id: number, data: Partial<CategoryInput>) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Categoría no encontrada');
    return prisma.category.update({ where: { id }, data });
  },

  async delete(id: number) {
    const existing = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
    if (!existing) throw new Error('Categoría no encontrada');
    if (existing._count.products > 0) throw new Error('No se puede eliminar una categoría con productos asociados');
    return prisma.category.delete({ where: { id } });
  },
};
