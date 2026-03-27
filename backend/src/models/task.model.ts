export interface Task {
    id: number;
    project_id: number;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date?: Date;
    created_at?: Date;
}
