import {NextFunction, Request, Response} from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthService } from "../services/authService";
import { UserRepository } from "../repositories/UserRepository";
import db from "../models/db";
import { DecodedToken } from "../models/user";

const userRepository = new UserRepository(db)
const authService = new AuthService(userRepository)

export interface AuthRequest extends Request  {
    user?: DecodedToken;
} 

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
    
        const user = await authService.validateToken(token);

        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (error) {
        // Handle potential errors
        res.status(401).json({ message: "Unauthorized" });
    }
    
}
