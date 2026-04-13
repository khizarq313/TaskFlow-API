import { useState, useEffect, useCallback } from 'react';
import { Task, TaskRequest, TaskStatus, TaskPriority } from '../types/task';
import taskService from '../services/taskService';
import { mockTasks } from '../mocks/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (taskRequest: TaskRequest) => Promise<Task>;
  updateTask: (id: string, taskRequest: TaskRequest) => Promise<Task>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useTasks = (filters?: {
  status?: TaskStatus;
  priority?: string;
  projectId?: string;
}): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        let filteredTasks = [...mockTasks];

        if (filters?.status) {
          filteredTasks = filteredTasks.filter((task) => task.status === filters.status);
        }
        if (filters?.priority) {
          filteredTasks = filteredTasks.filter((task) => task.priority === filters.priority);
        }
        if (filters?.projectId) {
          filteredTasks = filteredTasks.filter((task) => task.projectId === filters.projectId);
        }

        setTasks(filteredTasks);
      } else {
        const data = await taskService.getTasks(filters);
        setTasks(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskRequest: TaskRequest): Promise<Task> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskRequest.title,
          description: taskRequest.description || null,
          status: taskRequest.status || TaskStatus.TODO,
          priority: taskRequest.priority || TaskPriority.MEDIUM,
          projectId: taskRequest.projectId || null,
          projectName: taskRequest.projectId ? 'Mock Project' : null,
          assigneeId: 'mock-uid-12345',
          assigneeName: 'Dev User',
          assigneeAvatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          dueDate: taskRequest.dueDate || null,
          position: tasks.length,
          subtaskCompleted: 0,
          subtaskTotal: 0,
          commentCount: 0,
          completedAt: null,
          subtasks: [],
          comments: [],
        };
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } else {
        const newTask = await taskService.createTask(taskRequest);
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: string, taskRequest: TaskRequest): Promise<Task> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const updatedTask: Task = {
          ...tasks.find((t) => t.id === id)!,
          ...taskRequest,
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
        return updatedTask;
      } else {
        const updatedTask = await taskService.updateTask(id, taskRequest);
        setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
        return updatedTask;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const task = tasks.find((t) => t.id === id);
        if (!task) {
          throw new Error('Task not found');
        }
        const updatedTask: Task = {
          ...task,
          status,
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
        return updatedTask;
      } else {
        const updatedTask = await taskService.updateTaskStatus(id, status);
        setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
        return updatedTask;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task status';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    refetch,
  };
};

export default useTasks;
