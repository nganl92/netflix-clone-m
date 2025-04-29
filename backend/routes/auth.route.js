import express from 'express';
import { signup, login, logout, authCheck } from '../controllers/auth.controller.js';
import { protectRoute }from '../middleware/protectRoute.js'
const router = express.Router(); // Đã khởi tạo đúng

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// nếu người dùng không đăng nhập or token không hợp lệ thì 
// protectRoute (middleware) sẽ chặn lại và trả về 401 -> người dùng đang không đăng nhập
router.get ('/authCheck',protectRoute, authCheck);

export default router;
