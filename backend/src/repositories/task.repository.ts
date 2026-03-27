import { db } from '../config/db.js';
import { Task } from '../models/task.model.js';

export class TaskRepository {
    async createTask(projectId: number, title: string, description: string | undefined, priority: string = 'medium', dueDate: Date | undefined): Promise<Task> {
        const result = await db.query(
            `INSERT INTO tasks (project_id, title, description, priority, due_date) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [projectId, title, description, priority, dueDate]
        );
        return result.rows[0];
    }

    async getTasksByProject(projectId: number, limit: number, offset: number, status?: string, sortStr?: string): Promise<{ tasks: Task[], total: number }> {
        let countQuery = 'SELECT COUNT(*) FROM tasks WHERE project_id = $1';
        let queryParams: any[] = [projectId];
        let paramCount = 1;

        if (status) {
            paramCount++;
            countQuery += ` AND status = $${paramCount}`;
            queryParams.push(status);
        }

        const countResult = await db.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].count);

        let selectQuery = `SELECT * FROM tasks WHERE project_id = $1`;
        if (status) {
            selectQuery += ` AND status = $2`;
        }

        let orderClause = 'ORDER BY created_at DESC';
        if (sortStr === 'asc') {
            orderClause = 'ORDER BY due_date ASC NULLS LAST';
        } else if (sortStr === 'desc') {
            orderClause = 'ORDER BY due_date DESC NULLS LAST';
        }

        selectQuery += ` ${orderClause} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
        queryParams.push(limit, offset);

        const result = await db.query(selectQuery, queryParams);
        return { tasks: result.rows, total };
    }

    async getTaskById(id: number): Promise<Task | null> {
        const result = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
        return result.rows.length ? result.rows[0] : null;
    }

    async updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
        const fields = [];
        const values = [];
        let i = 1;
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                fields.push(`${key} = $${i}`);
                values.push(value);
                i++;
            }
        }

        if (fields.length === 0) return this.getTaskById(id);

        values.push(id);
        const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`;
        const result = await db.query(query, values);
        return result.rows.length ? result.rows[0] : null;
    }

    async deleteTask(id: number): Promise<boolean> {
        const result = await db.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    }
}
