import api from './api';
import { Project, ProjectRequest } from '../types/project';

export const projectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  // Get a single project by ID
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Create a new project
  createProject: async (projectRequest: ProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', projectRequest);
    return response.data;
  },

  // Delete a project
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

export default projectService;
