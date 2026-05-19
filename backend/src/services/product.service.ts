import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(200),
  description: z.string().max(1000).optional(),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  categoryId: z.number().int().positive('Categoría inválida'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  active: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const productService = {
  async getAll(filters?: { categoryId?: number; active?: boolean; search?: string }) {
    return prisma.product.findMany({
      where: {
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.active !== undefined && { active: filters.active }),
        ...(filters?.search && { name: { contains: filters.search } }),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: number) {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) throw new Error('Producto no encontrado');
    return product;
  },

  async create(data: ProductInput) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new Error('Categoría no encontrada');
    return prisma.product.create({ data, include: { category: true } });
  },

  async update(id: number, data: UpdateProductInput) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('Producto no encontrado');
    if (data.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
      if (!category) throw new Error('Categoría no encontrada');
    }
    return prisma.product.update({ where: { id }, data, include: { category: true } });
  },

  async delete(id: number) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new Error('Producto no encontrado');
    return prisma.product.delete({ where: { id } });
  },

  async getStats() {
    const [totalProducts, totalStock, lowStock, byCategory] = await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({ _sum: { stock: true } }),
      prisma.product.count({ where: { stock: { lte: 10 } } }),
      prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    ]);
    return { totalProducts, totalStock: totalStock._sum.stock ?? 0, lowStock, byCategory };
  },
};
