import express from 'express';
const router = express.Router();
import { 
    signOn, 
    profile, 
    confirm, 
    authenticate,
    forgotPassword,
    checkToken,
    newPassword
} from "../controllers/userController.js"
import checkAuth from '../middleware/authMiddleware.js';

// Public
router.post('/', signOn);
router.get('/confirm/:token', confirm);
router.post('/login', authenticate);
router.post('/forgot-password', forgotPassword);
router.route('/forgot-password/:token').get(checkToken).post(newPassword);

// Private
router.get('/profile', checkAuth, profile);

export default router;