import { Router } from 'express';
import { login, logout, refreshAccessToken } from '../controllers/authController';
import { protectAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);

router.post('/logout', protectAdmin, logout);

export default router;