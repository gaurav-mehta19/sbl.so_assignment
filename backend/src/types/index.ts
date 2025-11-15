// Global type definitions for the application

export interface CreateTaskRequest {
  url: string;
  question: string;
}

export interface TaskResponse {
  id: number;
  url: string;
  question: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  aiAnswer?: string | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  tasks: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}
