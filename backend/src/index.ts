import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { db } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: [process.env.DEVELOPMENT_FRONTEND_URL as string, process.env.PRODUCTION_FRONTEND_URL as string],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', date: new Date().toDateString() });
});

const startServer = async () => {
    try {
        await db.initDatabase();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
