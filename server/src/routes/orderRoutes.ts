import { Router } from 'express';
import { createOrder, getAllOrders, getOrderByCustomId, updateOrderStatus } from '../controllers/orderController';
import { protectAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public Routes
router.post('/', createOrder);
router.get('/track/:orderId', getOrderByCustomId);

// Admin Protected Routes
router.get('/', protectAdmin, getAllOrders);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;