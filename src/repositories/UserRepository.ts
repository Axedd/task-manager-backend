import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { AuthUser } from '../models/user';

export class UserRepository {
    constructor(private db: Pool) {}

    async findByUsername(username: string): Promise<AuthUser | null> {
        const [users] = await this.db.query<AuthUser[]>(
            'SELECT id, username, password FROM users WHERE username = ?',
            [username]
        );
        return users.length > 0 ? users[0] : null;
    }

    async createUser(username: string, password: string): Promise<number> {
        const [result] = await this.db.query<ResultSetHeader>(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, password]
        );
        return result.insertId;
    }

    async getUserPublicInformation(username: string): Promise<{ id: number; username: string } | null> {
        const [users] = await this.db.query<RowDataPacket[]>(
            'SELECT id, username FROM users WHERE username = ?',
            [username]
        );

        // Cast the result to the expected type
        const user = users as { id: number; username: string }[];

        return user.length > 0 ? user[0] : null;
    }
}