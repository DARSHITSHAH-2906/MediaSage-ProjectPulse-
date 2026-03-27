import { db } from '../config/db.js';
import { Project } from '../models/project.model.js';

export class ProjectRepository {
    async createProject(name: string, userId: number, description?: string): Promise<Project> {
        const result = await db.query(
            'INSERT INTO projects (name, description, user_id) VALUES ($1, $2, $3) RETURNING *',
            [name, description, userId]
        );
        return result.rows[0];
    }

    async getProjects(limit: number, offset: number, userId: number): Promise<{ projects: Project[], total: number }> {
        const countResult = await db.query('SELECT COUNT(*) FROM projects where user_id = $1', [userId]);
        const total = parseInt(countResult.rows[0].count);

        const result = await db.query(
            `SELECT p.*,
                COUNT(t.id)::int as task_count,
                COUNT(t.id) FILTER (WHERE t.status = 'done')::int as completed_count
             FROM projects p
             LEFT JOIN tasks t ON p.id = t.project_id
             WHERE p.user_id = $3
             GROUP BY p.id
             ORDER BY p.created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset, userId]
        );
        
        return { projects: result.rows, total };
    }

    async getProjectById(id: number): Promise<Project | null> {
        const result = await db.query(
            `SELECT p.*,
                COUNT(t.id)::int as task_count,
                COUNT(t.id) FILTER (WHERE t.status = 'done')::int as completed_count
             FROM projects p
             LEFT JOIN tasks t ON p.id = t.project_id
             WHERE p.id = $1
             GROUP BY p.id`, 
            [id]
        );
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteProject(id: number): Promise<boolean> {
        const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    }
}
