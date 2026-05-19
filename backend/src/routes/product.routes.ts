import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { productSchema, updateProductSchema } from '../services/product.service';

const router = Router();

// Todos los usuarios autenticados pueden ver productos
router.get('/', authenticate, productController.getAll);
router.get('/stats', authenticate, requireAdmin, productController.getStats);
router.get('/:id', authenticate, productController.getById);

// Solo admins pueden crear, actualizar y eliminar
router.post('/', authenticate, requireAdmin, validate(productSchema), productController.create);
router.put('/:id', authenticate, requireAdmin, validate(updateProductSchema), productController.update);
router.delete('/:id', authenticate, requireAdmin, productController.delete);

export default router;
