import React, { useState, useEffect } from 'react';
import { TaskRequest, TaskStatus, TaskPriority } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import TextAreaField from '../ui/TextAreaField';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultStatus?: TaskStatus;
}

const PRIORITIES: TaskPriority[] = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH, TaskPriority.URGENT];
const STATUSES: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];

const priorityOptions = PRIORITIES.map(p => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }));
const statusOptions = STATUSES.map(s => ({ value: s, label: s.replace('_', ' ').split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ') }));

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultStatus,
}) => {
  const { createTask } = useTasks();
  const { projects } = useProjects();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus || TaskStatus.TODO);
  const [dueDate, setDueDate] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (defaultStatus) {
      setStatus(defaultStatus);
    }
  }, [defaultStatus]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setStatus(defaultStatus || TaskStatus.TODO);
    setDueDate('');
    setProjectId('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsLoading(true);

      const taskRequest: TaskRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate || undefined,
        projectId: projectId || undefined,
      };

      await createTask(taskRequest);
      resetForm();
      onSuccess();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create task';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const projectOptions = [
    { value: '', label: 'No Project' },
    ...projects.map(p => ({ value: p.id, label: p.name }))
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      <div
        className="w-full max-w-lg bg-surface-container-low rounded-xl atmospheric-shadow relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle overlay effect */}
        <div className="absolute inset-0 bg-surface-variant/5 pointer-events-none" />

        <div className="relative p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-bold text-white">Create Task</h2>
            <button
              onClick={handleCancel}
              className="text-outline hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Task Title */}
            <InputField
              label="Task Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
              autoFocus
            />

            {/* Priority and Status Row */}
            <div className="grid grid-cols-2 gap-4">
              <SelectField
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                options={priorityOptions}
              />

              <SelectField
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                options={statusOptions}
              />
            </div>

            {/* Due Date and Project Row */}
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />

              <SelectField
                label="Project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                options={projectOptions}
              />
            </div>

            {/* Description */}
            <TextAreaField
              label="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your task..."
              rows={3}
            />

            {/* Error Message */}
            {error && (
              <div className="text-error text-sm text-center bg-error/10 rounded-md py-2">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                variant="ghost"
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isLoading}>
                {isLoading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
