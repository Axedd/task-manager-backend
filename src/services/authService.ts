import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { AuthUser, DecodedToken } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export class AuthService {
    constructor(private userRepository: UserRepository) {}

    async registerUser(username: string, password: string) {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await this.userRepository.createUser(username, hashedPassword);
        
        return { userId, username };
    }

    async loginUser(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '3h',
        });

        return { token, user: { id: user.id, username: user.username } };
    }

    async validateToken(token: string): Promise<DecodedToken> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    return reject(new Error('Invalid token'));
                }
                // Cast decoded to DecodedToken
                resolve(decoded as DecodedToken);
            });
        });
    }
}