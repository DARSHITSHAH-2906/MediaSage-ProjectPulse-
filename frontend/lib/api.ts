import axios from 'axios';
import type {
  Project,
  Task,
  PaginatedResponse,
  CreateProjectInput,
  CreateTaskInput,
  UpdateTaskInput,
  TaskStatus,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If session expired or token invalid, clear persisted auth and redirect
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        // Only redirect if not already on an auth page
        const pathname = window.location.pathname;
        if (pathname !== '/login' && pathname !== '/signup') {
          window.location.href = '/login';
        }
      }
    }
    let message = 'An error occurred';
    if (error.response?.data?.error) {
      message = error.response.data.error;
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(message);
  }
);

// ---- AUTH ----
export const registerUser = async (data: any) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.get('/auth/logout');
  return res.data;
};

export const getUser = async () => {
  const res = await api.get('/auth/verify');
  return res.data.user;
};

// ---- PROJECTS ----
export const getProjects = async (
  page = 1,
  limit = 9
): Promise<PaginatedResponse<Project>> => {
  const res = await api.get(`/projects?page=${page}&limit=${limit}`);
  return {
    data: res.data.projects || [],
    total: res.data.total || 0,
    page: res.data.page || page,
    limit,
    total_pages: res.data.totalPages || 1,
  };
};

export const getProject = async (id: string): Promise<Project> => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const createProject = async (data: CreateProjectInput): Promise<Project> => {
  const res = await api.post('/projects', data);
  return res.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// ---- TASKS ----
export const getTasks = async (
  projectId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: TaskStatus | 'all';
    sort?: 'due_date' | 'created_at';
    order?: 'asc' | 'desc';
  }
): Promise<PaginatedResponse<Task>> => {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);

  const res = await api.get(`/projects/${projectId}/tasks?${query.toString()}`);
  return {
    data: res.data.tasks || [],
    total: res.data.total || 0,
    page: res.data.page || (params?.page || 1),
    limit: params?.limit || 10,
    total_pages: res.data.totalPages || 1,
  };
};

export const createTask = async (
  projectId: string,
  data: CreateTaskInput
): Promise<Task> => {
  const res = await api.post(`/projects/${projectId}/tasks`, data);
  return res.data;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskInput
): Promise<Task> => {
  const res = await api.put(`/tasks/${taskId}`, data);
  return res.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};
