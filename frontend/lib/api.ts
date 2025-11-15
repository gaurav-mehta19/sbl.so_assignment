import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sbl-so-assignment.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Task {
  id: number;
  url: string;
  question: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scrapedContent?: string | null;
  aiAnswer: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTaskRequest {
  url: string;
  question: string;
}

export interface CreateTaskResponse {
  message: string;
  task: Task;
  id: number;
}

export interface GetTaskResponse {
  task: Task;
}

export interface GetTasksResponse {
  tasks: Task[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export const taskService = {
  createTask: async (data: CreateTaskRequest): Promise<Task> => {
    const response = await apiClient.post<CreateTaskResponse>('/api/tasks', data);
    return response.data.task;
  },

  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<GetTaskResponse>(`/api/tasks/${id}`);
    return response.data.task;
  },

  getTasks: async (limit = 50, offset = 0): Promise<GetTasksResponse> => {
    const response = await apiClient.get<GetTasksResponse>('/api/tasks', {
      params: { limit, offset },
    });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/tasks/${id}`);
  },
};
