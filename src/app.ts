import express, { Request, Response } from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import { AuthService } from './services/authService';
import { UserRepository } from './repositories/UserRepository';
import db from './models/db';
import cookieParser from 'cookie-parser';




const app = express();

const userRepository = new UserRepository(db);
const authService = new AuthService(userRepository);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', taskRoutes); // Use task routes under /api path
app.use('/api/auth', authRoutes)




export default app;