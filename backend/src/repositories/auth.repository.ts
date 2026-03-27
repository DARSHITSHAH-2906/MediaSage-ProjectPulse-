import { db } from '../config/db.js';
import { User } from '../models/user.model.js';

export class AuthRepository {
    async createUser(name: string, email: string, passwordHash: string): Promise<User> {
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
            [name, email, passwordHash]
        );
        return result.rows[0];
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length ? result.rows[0] : null;
    }

    async findUserById(id: number): Promise<User | null> {
        const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }
}
