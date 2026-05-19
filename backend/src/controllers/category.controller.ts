import { Response } from 'express';
import { categoryService } from '../services/category.service';
import { AuthRequest } from '../types';

export const categoryController = {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await categoryService.getAll();
      res.json({ success: true, data: categories });
    } catch (err: unknown) {
      res.status(500).json({ success: false, message: 'Error al obtener categorías' });
    }
  },

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const cat = await categoryService.getById(Number(req.params.id));
      res.json({ success: true, data: cat });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(404).json({ success: false, message });
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const cat = await categoryService.create(req.body);
      res.status(201).json({ success: true, data: cat, message: 'Categoría creada' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(400).json({ success: false, message });
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const cat = await categoryService.update(Number(req.params.id), req.body);
      res.json({ success: true, data: cat, message: 'Categoría actualizada' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(400).json({ success: false, message });
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await categoryService.delete(Number(req.params.id));
      res.json({ success: true, message: 'Categoría eliminada' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error';
      res.status(400).json({ success: false, message });
    }
  },
};
