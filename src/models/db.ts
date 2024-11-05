import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

class Database {
    private pool: Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST!,
            port: parseInt(process.env.DB_PORT!, 10),
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_NAME!,
            waitForConnections: true,
            connectionLimit: 10, // Set an appropriate connection limit
            queueLimit: 0,
        });
    }

    getPool(): Pool {
        return this.pool;
    }
}

export default new Database().getPool();
