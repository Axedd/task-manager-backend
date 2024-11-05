// controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserRepository } from '../repositories/UserRepository';
import db from '../models/db';
import { AuthRequest } from '../middleware/authMiddleware';

// Inject AuthService instance when initializing the controller
const authService = new AuthService(new UserRepository(db));
const userRepository = new UserRepository(db);

export const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await authService.registerUser(username, password);
        res.status(201).json({
            message: 'User registered successfully',
            userId: user.userId,
            username: user.username,
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Username already exists') {
            return res.status(409).json({ error: error.message });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const result = await authService.loginUser(username, password);
        console.log('Attempting to log in user:', username, password);
        console.log(result.token)
        res.cookie('token', result.token, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3 * 60 * 60 * 1000,
        })

        res.status(200).json({
            message: 'Login successful',
            user: result.user, // Include user info in the response
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({ error: error.message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUserPublicInformation = async (req: Request, res: Response) => {
    const { username } = req.params;

    try {
        const userInfo = await userRepository.getUserPublicInformation(username);
        if (!userInfo) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error fetching user public information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const userPublicInfo = async (req: AuthRequest, res: Response) => {
    try {
        return res.json({id: req.user!.id, username: req.user!.username }); // Send user info
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};