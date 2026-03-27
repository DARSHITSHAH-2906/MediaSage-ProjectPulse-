import { TaskRepository } from '../repositories/task.repository.js';
import { Task } from '../models/task.model.js';
import { ProjectRepository } from '../repositories/project.repository.js';

export class TaskService {
    private taskRepository: TaskRepository;
    private projectRepository: ProjectRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
        this.projectRepository = new ProjectRepository();
    }

    async createTask(projectId: number, title: string, description?: string, priority?: string, dueDate?: Date): Promise<Task> {
        const project = await this.projectRepository.getProjectById(projectId);
        if (!project) throw new Error('Project not found');
        return this.taskRepository.createTask(projectId, title, description, priority, dueDate);
    }

    async getTasksByProject(projectId: number, page: number, limit: number, status?: string, sortStr?: string): Promise<{ tasks: Task[], total: number, page: number, totalPages: number }> {
        const project = await this.projectRepository.getProjectById(projectId);
        if (!project) throw new Error('Project not found');

        const offset = (page - 1) * limit;
        const { tasks, total } = await this.taskRepository.getTasksByProject(projectId, limit, offset, status, sortStr);

        return {
            tasks,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
        const task = await this.taskRepository.updateTask(taskId, updates);
        if (!task) throw new Error('Task not found');
        return task;
    }

    async deleteTask(taskId: number): Promise<void> {
        const success = await this.taskRepository.deleteTask(taskId);
        if (!success) throw new Error('Task not found');
    }
}
