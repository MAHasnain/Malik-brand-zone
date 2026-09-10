import { Router } from 'express';
import { addToCart, validateCart, removeFromCart, clearCart, getCart, updateCartItemQuantity } from '../controllers/cartController';

const router = Router();

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/update-qty', updateCartItemQuantity)
router.post('/validate', validateCart);
router.post('/remove', removeFromCart);
router.post('/clear', clearCart);

export default router;