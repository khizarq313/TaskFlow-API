import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/task';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskDetailDrawer from '../components/task/TaskDetailDrawer';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Avatar from '../components/ui/Avatar';

export const DashboardPage: React.FC = () => {
  const { tasks, loading, error, updateTaskStatus, refetch } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTaskClick = (task: Task): void => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (): void => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const handleTaskUpdate = (): void => {
    refetch();
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
          <p className="text-error text-lg font-semibold mb-2">Failed to load tasks</p>
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

  // Mock team members for avatar stack
  const teamMembers = [
    { id: '1', name: 'Sarah Chen', avatar: null },
    { id: '2', name: 'Marcus Johnson', avatar: null },
    { id: '3', name: 'Emily Rodriguez', avatar: null },
    { id: '4', name: 'Alex Kim', avatar: null },
  ];

  return (
    <div className="min-h-screen bg-surface pt-24 px-4 md:px-8 pb-12">
      {/* Page header */}
      <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-white">
            Project Phoenix
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="material-symbols-outlined text-primary text-sm"
              aria-hidden="true"
            >
              event
            </span>
            <span className="text-sm uppercase opacity-70 tracking-wide text-on-surface-variant">
              Architecture Phase • Q4 Deliverables
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Team avatar stack */}
          <div className="flex -space-x-3">
            {teamMembers.map((member) => (
              <Avatar key={member.id} src={member.avatar} alt={member.name} size="md" />
            ))}
            <div className="w-10 h-10 rounded-full bg-surface-container-high border-2 border-primary/20 flex items-center justify-center text-xs font-bold text-white">
              +4
            </div>
          </div>

          {/* Filter button */}
          <button className="bg-surface-container-high px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-surface-variant transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm" aria-hidden="true">
              filter_list
            </span>
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        onTaskStatusUpdate={async (taskId, newStatus) => {
          await updateTaskStatus(taskId, newStatus);
        }}
        onTaskClick={handleTaskClick}
        onTasksRefetch={refetch}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onUpdate={handleTaskUpdate}
      />
    </div>
  );
};

export default DashboardPage;
