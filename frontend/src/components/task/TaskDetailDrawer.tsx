import React, { useState, useEffect } from 'react';
import { Task, Subtask, Comment } from '../../types/task';
import StatusBadge from '../kanban/StatusBadge';
import PriorityBadge from '../kanban/PriorityBadge';
import SubtaskItem from './SubtaskItem';
import CommentItem from './CommentItem';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      // In a real app, fetch subtasks and comments from API
      setSubtasks([]);
      setComments([]);
    }
  }, [task]);

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

  if (!task) return null;

  const handleStatusCycle = (): void => {
    // In real app: call API to update status
    console.log('Update status');
    onUpdate();
  };

  const handleSaveTitle = (): void => {
    if (editedTitle.trim()) {
      // In real app: call API to update title
      console.log('Update title to:', editedTitle);
      setIsEditingTitle(false);
      onUpdate();
    }
  };

  const handleAddSubtask = (): void => {
    if (newSubtaskTitle.trim()) {
      // In real app: call API to add subtask
      const newSubtask: Subtask = {
        id: `subtask-${Date.now()}`,
        title: newSubtaskTitle,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
      onUpdate();
    }
  };

  const handleToggleSubtask = (subtaskId: string): void => {
    // In real app: call API to toggle subtask
    setSubtasks(
      subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st))
    );
    onUpdate();
  };

  const handleDeleteSubtask = (subtaskId: string): void => {
    // In real app: call API to delete subtask
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId));
    onUpdate();
  };

  const handleAddComment = (): void => {
    if (newComment.trim() && user) {
      // In real app: call API to add comment
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        userId: user.uid,
        userName: user.displayName || 'User',
        userAvatar: user.photoURL,
        createdAt: new Date().toISOString(),
      };
      setComments([comment, ...comments]);
      setNewComment('');
      onUpdate();
    }
  };

  const handleDeleteComment = (commentId: string): void => {
    // In real app: call API to delete comment
    setComments(comments.filter((c) => c.id !== commentId));
    onUpdate();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[480px] lg:w-[520px] bg-[#0b1326] shadow-[-20px_0_60px_rgba(6,14,32,0.5)] z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-outline-variant/10 flex-shrink-0">
          <button
            onClick={handleStatusCycle}
            className="hover:opacity-80 transition-opacity"
            aria-label="Cycle status"
          >
            <StatusBadge status={task.status} />
          </button>

          <div className="flex gap-3">
            <button
              onClick={onUpdate}
              className="architectural-gradient text-white text-sm font-bold px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="text-outline hover:text-white transition-colors"
              aria-label="Close drawer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
          {/* Title */}
          <div>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') {
                    setEditedTitle(task.title);
                    setIsEditingTitle(false);
                  }
                }}
                className="w-full font-headline text-2xl font-bold tracking-tighter text-white bg-surface-container-high rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/20"
                autoFocus
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="font-headline text-2xl font-bold tracking-tighter text-white cursor-pointer hover:text-primary-fixed-dim transition-colors"
              >
                {task.title}
              </h2>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Assigned To
              </label>
              <div className="flex items-center gap-2">
                <Avatar
                  src={task.assigneeAvatar}
                  alt={task.assigneeName || 'Unassigned'}
                  size="sm"
                />
                <span className="text-sm text-on-surface">{task.assigneeName || 'Unassigned'}</span>
              </div>
            </div>

            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Priority
              </label>
              <PriorityBadge priority={task.priority} />
            </div>

            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Due Date
              </label>
              <span className="text-sm text-on-surface">
                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
              </span>
            </div>

            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Project
              </label>
              <span className="text-sm text-on-surface">{task.projectName || 'No project'}</span>
            </div>

            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Created
              </label>
              <span className="text-sm text-on-surface">{formatDate(task.createdAt)}</span>
            </div>

            <div>
              <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Status
              </label>
              <StatusBadge status={task.status} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-2">
              Description
            </label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Add a detailed description..."
              className="w-full bg-surface-container-high rounded-md p-4 text-sm text-on-surface border-none resize-none min-h-[100px] focus:outline-none focus:ring-1 focus:ring-primary/20 placeholder:text-outline/50"
            />
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="font-label text-xs uppercase tracking-wider text-on-surface-variant">
                Subtasks
                {subtasks.length > 0 && (
                  <span className="ml-2 text-outline">
                    ({subtasks.filter((st) => st.completed).length}/{subtasks.length})
                  </span>
                )}
              </label>
              <button
                onClick={() => setIsAddingSubtask(true)}
                className="text-primary text-xs font-semibold hover:text-primary-fixed-dim transition-colors"
              >
                Add subtask
              </button>
            </div>

            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <SubtaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={handleToggleSubtask}
                  onDelete={handleDeleteSubtask}
                />
              ))}

              {isAddingSubtask && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSubtask();
                      if (e.key === 'Escape') {
                        setIsAddingSubtask(false);
                        setNewSubtaskTitle('');
                      }
                    }}
                    placeholder="Subtask title..."
                    className="flex-1 bg-surface-container-high rounded-md px-3 py-2 text-sm text-on-surface border-none focus:outline-none focus:ring-1 focus:ring-primary/20"
                    autoFocus
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="text-primary hover:text-primary-fixed-dim text-sm font-semibold"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingSubtask(false);
                      setNewSubtaskTitle('');
                    }}
                    className="text-outline hover:text-white text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity */}
          <div>
            <label className="block font-label text-xs uppercase tracking-wider text-on-surface-variant mb-4">
              Activity
            </label>

            {/* Comment Input */}
            <div className="bg-surface-container-high rounded-md px-4 py-3 flex gap-3 items-start mb-4">
              <Avatar src={user?.photoURL} alt={user?.displayName || 'You'} size="sm" />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent border-none text-sm text-on-surface placeholder:text-outline/50 focus:outline-none"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="text-primary hover:text-primary-fixed-dim disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send comment"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.uid || ''}
                  onDelete={handleDeleteComment}
                />
              ))}

              {comments.length === 0 && (
                <p className="text-sm text-outline text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetailDrawer;
