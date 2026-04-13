import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { ProjectRequest } from '../types/project';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';

export const ProjectsPage: React.FC = () => {
  const { projects, loading, error, createProject, deleteProject, refetch } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateProject = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setModalError('');

    if (!projectName.trim()) {
      setModalError('Project name is required');
      return;
    }

    try {
      setModalLoading(true);
      const projectRequest: ProjectRequest = {
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      };
      await createProject(projectRequest);
      setProjectName('');
      setProjectDescription('');
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setModalError(errorMessage);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string): Promise<void> => {
    try {
      await deleteProject(projectId);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
          <p className="text-error text-lg font-semibold mb-2">Failed to load projects</p>
          <p className="text-on-surface-variant text-sm mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="architectural-gradient text-white font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-24 px-4 md:px-8 pb-12">
      {/* Page header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-white">
            Projects
          </h1>
          <p className="text-sm text-on-surface-variant font-body mt-2">
            Manage your project workspaces
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Project</span>
          </span>
        </Button>
      </div>

      {/* Projects grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-surface-container-low rounded-xl p-6 atmospheric-shadow hover:shadow-atmospheric transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-headline font-bold text-white text-lg">{project.name}</h3>
                {deleteConfirmId === project.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-error hover:text-error/80 text-xs font-semibold"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-outline hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="text-outline hover:text-error transition-colors"
                    aria-label="Delete project"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>

              {project.description && (
                <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4 text-xs text-outline">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    assignment
                  </span>
                  <span>{project.taskCount} tasks</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">
                    group
                  </span>
                  <span>{project.memberCount} members</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <Avatar src={null} alt={project.ownerName} size="sm" />
                  <span className="text-xs text-on-surface-variant">{project.ownerName}</span>
                </div>
                <span className="text-xs text-outline">{formatDate(project.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">
            folder_open
          </span>
          <p className="text-lg font-semibold text-white mb-2">No projects yet</p>
          <p className="text-sm text-on-surface-variant mb-6">
            Create your first project to get started
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Create Project</span>
            </span>
          </Button>
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setIsModalOpen(false);
            setProjectName('');
            setProjectDescription('');
            setModalError('');
          }}
        >
          <div
            className="w-full max-w-lg bg-surface-container-low rounded-xl atmospheric-shadow relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-surface-variant/5 pointer-events-none" />

            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-bold text-white">New Project</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setProjectName('');
                    setProjectDescription('');
                    setModalError('');
                  }}
                  className="text-outline hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-5">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-white placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your project..."
                    rows={3}
                    className="w-full bg-surface-container-highest border-none rounded-md py-3 px-4 text-on-surface placeholder:text-outline/50 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
                  />
                </div>

                {modalError && (
                  <div className="text-error text-sm text-center bg-error/10 rounded-md py-2">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsModalOpen(false);
                      setProjectName('');
                      setProjectDescription('');
                      setModalError('');
                    }}
                    type="button"
                    disabled={modalLoading}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" isLoading={modalLoading}>
                    {modalLoading ? 'Creating...' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
