import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository.js';
import { User } from '../models/user.model.js';
import { TokenService } from './token.service.js';

export class AuthService {
    private authRepository: AuthRepository;
    private tokenService: TokenService;

    constructor() {
        this.authRepository = new AuthRepository();
        this.tokenService = new TokenService();
    }

    async register(name: string, email: string, passwordPlain: string): Promise<{ user: User, token: string }> {
        const existingUser = await this.authRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlain, salt);
        const user = await this.authRepository.createUser(name, email, passwordHash);
        
        const token = this.tokenService.generateToken({ id: String(user.id), email: user.email });
        const { password, ...userWithoutPassword } = user;
        
        return { user: userWithoutPassword as User, token };
    }

    async login(email: string, passwordPlain: string): Promise<{ user: User, token: string }> {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user || !user.password) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(passwordPlain, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = this.tokenService.generateToken({ id: String(user.id), email: user.email });
        const { password, ...userWithoutPassword } = user;
        
        return { user: userWithoutPassword as User, token };
    }

    async getUserById(id: number): Promise<User | null> {
        return this.authRepository.findUserById(id);
    }
}
