import { Response } from 'express';
import { productService } from '../services/product.service';
import { AuthRequest } from '../types';

export const productController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { categoryId, active, search } = req.query;
      const filters = {
        categoryId: categoryId ? Number(categoryId) : undefined,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        search: search as string | undefined,
      };
      const products = await productService.getAll(filters);
      res.json({ success: true, data: products });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener productos';
      res.status(500).json({ success: false, message });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await productService.getById(Number(req.params.id));
      res.json({ success: true, data: product });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(404).json({ success: false, message });
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: product, message: 'Producto creado exitosamente' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      res.status(400).json({ success: false, message });
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const product = await productService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: product, message: 'Producto actualizado' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar';
      res.status(400).json({ success: false, message });
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await productService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Producto eliminado' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al eliminar';
      res.status(400).json({ success: false, message });
    }
  },

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await productService.getStats();
      res.json({ success: true, data: stats });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(500).json({ success: false, message });
    }
  },
};
