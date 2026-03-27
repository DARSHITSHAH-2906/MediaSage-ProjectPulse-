import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { TokenService } from '../services/token.service.js';

export class AuthController {
    private authService: AuthService;
    private tokenService: TokenService;

    constructor() {
        this.authService = new AuthService();
        this.tokenService = new TokenService();
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            const { user, token } = await this.authService.register(name, email, password);
            
            this.tokenService.setTokenCookie(res, token);
            
            res.status(201).json({ message: 'User registered successfully', user });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const { user, token } = await this.authService.login(email, password);
            
            this.tokenService.setTokenCookie(res, token);

            res.status(200).json({ message: 'Login successful', user });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    logout = async (req: Request, res: Response) => {
        this.tokenService.clearTokenCookie(res);
        res.status(200).json({ message: 'Logout successful' });
    }

    verify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userRef = (req as any).user;
            console.log(userRef);
            if (!userRef || !userRef.id) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const user = await this.authService.getUserById(userRef.id);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error: any) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    };
}
