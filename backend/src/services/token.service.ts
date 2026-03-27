import jwt from 'jsonwebtoken';
import { Response } from 'express';
import {config} from 'dotenv';

config();

export class TokenService {
    generateToken(payload: { id: string; email: string }): string {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
    }

    setTokenCookie(res: Response, token: string): void {
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: parseInt(process.env.JWT_MAX_AGE as string)
        });
    }

    clearTokenCookie(res: Response): void {
        res.clearCookie('token');
    }
}
