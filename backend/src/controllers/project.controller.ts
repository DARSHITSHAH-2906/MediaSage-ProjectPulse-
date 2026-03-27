import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service.js';

export class ProjectController {
    private projectService: ProjectService;

    constructor() {
        this.projectService = new ProjectService();
    }

    createProject = async (req: Request, res: Response) => {
        try {
            const userID = parseInt((req as any).user.id);
            const { name, description } = req.body;
            const project = await this.projectService.createProject(name, userID, description);
            res.status(201).json(project);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getProjects = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const userId = parseInt((req as any).user.id);
            const data = await this.projectService.getProjects(page, limit, userId);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getProjectById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            const project = await this.projectService.getProjectById(id);
            res.status(200).json(project);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    deleteProject = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            await this.projectService.deleteProject(id);
            res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };
}
