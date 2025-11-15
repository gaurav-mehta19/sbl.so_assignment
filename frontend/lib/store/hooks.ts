import { useTaskFormStore, useCurrentTaskStore, useTasksListStore, useTaskCreationStore } from './atoms';
import { getFilteredTasks, getTaskStats } from './selectors';

// Form hooks
export const useTaskForm = () => {
  const { url, question, setUrl, setQuestion, clearForm } = useTaskFormStore();
  
  return {
    formData: { url, question },
    updateUrl: setUrl,
    updateQuestion: setQuestion,
    clearForm,
  };
};

// Task creation hooks
export const useTaskCreation = () => {
  const { isCreating, setIsCreating } = useTaskCreationStore();
  
  return {
    isCreating,
    setIsCreating,
  };
};

// Current task hooks
export const useCurrentTask = () => {
  const { task, isLoading, error, setTask, setIsLoading, setError } = useCurrentTaskStore();
  
  return {
    task,
    setTask,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};

// Tasks list hooks
export const useTasks = () => {
  const { tasks, isLoading, error, filter, setTasks, setIsLoading, setError, setFilter } = useTasksListStore();
  
  const filteredTasks = getFilteredTasks(tasks, filter);
  const stats = getTaskStats(tasks);
  
  return {
    tasks,
    setTasks,
    filteredTasks,
    isLoading,
    setIsLoading,
    error,
    setError,
    stats,
    filter,
    setFilter,
  };
};

// Filter hooks
export const useTasksFilter = () => {
  const { filter, setFilter, resetFilter } = useTasksListStore();
  
  const setStatus = (status: typeof filter.status) => {
    setFilter({ status });
  };
  
  const setSortBy = (sortBy: typeof filter.sortBy) => {
    setFilter({ sortBy });
  };
  
  const setSortOrder = (sortOrder: typeof filter.sortOrder) => {
    setFilter({ sortOrder });
  };
  
  return {
    filter,
    setFilter,
    setStatus,
    setSortBy,
    setSortOrder,
    resetFilter,
  };
};
