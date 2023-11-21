import express from 'express';
const router = express.Router();
import { registerController, loginController, userController, refreshController, productController } from '../controller/index.js';
import auth from '../middlewares/auth.js'

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/me', auth, userController.me)
router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout)
router.post('/products', productController.store);

export default router;