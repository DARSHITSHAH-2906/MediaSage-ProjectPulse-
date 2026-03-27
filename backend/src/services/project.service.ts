import { ProjectRepository } from '../repositories/project.repository.js';
import { Project } from '../models/project.model.js';

export class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async createProject(name: string, userId: number, description?: string): Promise<Project> {
        return this.projectRepository.createProject(name, userId, description);
    }

    async getProjects(page: number, limit: number, userId: number): Promise<{ projects: Project[], total: number, page: number, totalPages: number }> {
        const offset = (page - 1) * limit;
        const { projects, total } = await this.projectRepository.getProjects(limit, offset, userId);
        return {
            projects,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getProjectById(id: number): Promise<Project> {
        const project = await this.projectRepository.getProjectById(id);
        if (!project) throw new Error('Project not found');
        return project;
    }

    async deleteProject(id: number): Promise<void> {
        const success = await this.projectRepository.deleteProject(id);
        if (!success) throw new Error('Project not found');
    }
}
