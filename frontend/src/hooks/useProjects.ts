import { useState, useEffect, useCallback } from 'react';
import { Project, ProjectRequest } from '../types/project';
import projectService from '../services/projectService';
import { mockProjects } from '../mocks/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  createProject: (projectRequest: ProjectRequest) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useProjects = (): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (USE_MOCK) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 400));
        setProjects(mockProjects);
      } else {
        const data = await projectService.getProjects();
        setProjects(data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectRequest: ProjectRequest): Promise<Project> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newProject: Project = {
          id: `proj-${Date.now()}`,
          name: projectRequest.name,
          description: projectRequest.description || '',
          ownerId: 'mock-uid-12345',
          ownerName: 'Dev User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          memberCount: 1,
          taskCount: 0,
        };
        setProjects((prev) => [...prev, newProject]);
        return newProject;
      } else {
        const newProject = await projectService.createProject(projectRequest);
        setProjects((prev) => [...prev, newProject]);
        return newProject;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      setError(null);

      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setProjects((prev) => prev.filter((project) => project.id !== id));
      } else {
        await projectService.deleteProject(id);
        setProjects((prev) => prev.filter((project) => project.id !== id));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    createProject,
    deleteProject,
    refetch,
  };
};

export default useProjects;
