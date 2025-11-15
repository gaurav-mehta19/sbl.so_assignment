import { Task } from '@/lib/api';

// Helper function to filter and sort tasks
export const getFilteredTasks = (
  tasks: Task[],
  filter: {
    status: 'all' | 'pending' | 'processing' | 'completed' | 'failed';
    sortBy: 'createdAt' | 'status';
    sortOrder: 'asc' | 'desc';
  }
) => {
  let filtered = tasks;

  // Filter by status
  if (filter.status !== 'all') {
    filtered = filtered.filter((task) => task.status === filter.status);
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (filter.sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filter.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      // Sort by status
      const statusOrder = { pending: 1, processing: 2, completed: 3, failed: 4 };
      const orderA = statusOrder[a.status];
      const orderB = statusOrder[b.status];
      return filter.sortOrder === 'asc' ? orderA - orderB : orderB - orderA;
    }
  });

  return sorted;
};

// Helper function to get task statistics
export const getTaskStats = (tasks: Task[]) => {
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    processing: tasks.filter((t) => t.status === 'processing').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    failed: tasks.filter((t) => t.status === 'failed').length,
  };
};
