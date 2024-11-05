import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../models/db';
import { registerUser, login, getUserPublicInformation, userPublicInfo } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', login)
router.get('/user/:username', getUserPublicInformation);
router.get('/me', authMiddleware, userPublicInfo);


export default router;