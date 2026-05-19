import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { categorySchema } from '../services/category.service';

const router = Router();

router.get('/', authenticate, categoryController.getAll);
router.get('/:id', authenticate, categoryController.getById);
router.post('/', authenticate, requireAdmin, validate(categorySchema), categoryController.create);
router.put('/:id', authenticate, requireAdmin, categoryController.update);
router.delete('/:id', authenticate, requireAdmin, categoryController.delete);

export default router;
