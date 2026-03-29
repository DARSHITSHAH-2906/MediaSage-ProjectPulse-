export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  task_count?: number;
  completed_count?: number;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
}
