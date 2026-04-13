import api from './api';
import { Task, TaskRequest, TaskStatus, Comment, Subtask } from '../types/task';

export const taskService = {
  // Get all tasks with optional filters
  getTasks: async (params?: {
    status?: TaskStatus;
    priority?: string;
    projectId?: string;
  }): Promise<Task[]> => {
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task
  createTask: async (taskRequest: TaskRequest): Promise<Task> => {
    const response = await api.post<Task>('/tasks', taskRequest);
    return response.data;
  },

  // Update a task (full update)
  updateTask: async (id: string, taskRequest: TaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, taskRequest);
    return response.data;
  },

  // Update task status only
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // Update task position
  updateTaskPosition: async (id: string, position: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/position`, { position });
    return response.data;
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Subtask operations
  addSubtask: async (taskId: string, title: string): Promise<Subtask> => {
    const response = await api.post<Subtask>(`/tasks/${taskId}/subtasks`, { title });
    return response.data;
  },

  toggleSubtask: async (taskId: string, subtaskId: string): Promise<Subtask> => {
    const response = await api.put<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    return response.data;
  },

  deleteSubtask: async (taskId: string, subtaskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
  },

  // Comment operations
  addComment: async (taskId: string, content: string): Promise<Comment> => {
    const response = await api.post<Comment>(`/tasks/${taskId}/comments`, { content });
    return response.data;
  },

  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};

export default taskService;
