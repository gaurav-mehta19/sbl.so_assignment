import { create } from 'zustand';
import { Task } from '@/lib/api';

interface TaskFormState {
  url: string;
  question: string;
  setUrl: (url: string) => void;
  setQuestion: (question: string) => void;
  clearForm: () => void;
}

interface CurrentTaskState {
  task: Task | null;
  isLoading: boolean;
  error: string | null;
  setTask: (task: Task | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

interface TasksListState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: {
    status: 'all' | 'pending' | 'processing' | 'completed' | 'failed';
    sortBy: 'createdAt' | 'status';
    sortOrder: 'asc' | 'desc';
  };
  setTasks: (tasks: Task[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<TasksListState['filter']>) => void;
  resetFilter: () => void;
}

interface TaskCreationState {
  isCreating: boolean;
  setIsCreating: (isCreating: boolean) => void;
}

export const useTaskFormStore = create<TaskFormState>((set) => ({
  url: '',
  question: '',
  setUrl: (url) => set({ url }),
  setQuestion: (question) => set({ question }),
  clearForm: () => set({ url: '', question: '' }),
}));

export const useCurrentTaskStore = create<CurrentTaskState>((set) => ({
  task: null,
  isLoading: false,
  error: null,
  setTask: (task) => set({ task }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));

export const useTasksListStore = create<TasksListState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: {
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  setTasks: (tasks) => set({ tasks }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
  resetFilter: () => set({ filter: { status: 'all', sortBy: 'createdAt', sortOrder: 'desc' } }),
}));

export const useTaskCreationStore = create<TaskCreationState>((set) => ({
  isCreating: false,
  setIsCreating: (isCreating) => set({ isCreating }),
}));
