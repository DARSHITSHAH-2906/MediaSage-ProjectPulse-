import { Request, Response } from 'express';
import { TaskService } from '../services/task.service.js';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    createTask = async (req: Request, res: Response) => {
        try {
            const projectId = parseInt(req.params.project_id as string);
            const { title, description, priority, due_date } = req.body;
            const task = await this.taskService.createTask(projectId, title, description, priority, due_date ? new Date(due_date) : undefined);
            res.status(201).json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getTasks = async (req: Request, res: Response) => {
        try {
            const projectId = parseInt(req.params.project_id as string);
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string;
            const sort = req.query.sort as string; // 'asc' or 'desc' for due_date
            
            const data = await this.taskService.getTasksByProject(projectId, page, limit, status, sort);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    updateTask = async (req: Request, res: Response) => {
        try {
            const taskId = parseInt(req.params.id as string);
            const task = await this.taskService.updateTask(taskId, req.body);
            res.status(200).json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    deleteTask = async (req: Request, res: Response) => {
        try {
            const taskId = parseInt(req.params.id as string);
            await this.taskService.deleteTask(taskId);
            res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };
}
