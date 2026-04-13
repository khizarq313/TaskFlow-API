import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/task';
import PriorityBadge from './PriorityBadge';
import Avatar from '../ui/Avatar';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="bg-surface-container-lowest rounded-xl p-5 space-y-3 cursor-pointer shadow-atmospheric-sm hover:shadow-atmospheric transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex justify-between items-start">
        <PriorityBadge priority={task.priority} />
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-outline hover:text-white transition-colors"
          aria-label="More options"
        >
          <span className="material-symbols-outlined text-sm">more_horiz</span>
        </button>
      </div>

      <h3 className="font-headline font-bold text-[15px] tracking-tight text-white leading-snug line-clamp-2">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {task.subtaskTotal > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(task.subtaskCompleted / task.subtaskTotal) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-outline whitespace-nowrap">
            {task.subtaskCompleted}/{task.subtaskTotal} subtasks
          </span>
        </div>
      )}

      <div className="flex justify-between items-center">
        {task.dueDate ? (
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-[10px]"
              style={{ fontSize: '14px' }}
              aria-hidden="true"
            >
              event
            </span>
            <span className={`text-[10px] ${isOverdue ? 'text-[#ffb95f]' : 'text-outline'}`}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex -space-x-2">
          {task.assigneeAvatar || task.assigneeName ? (
            <Avatar
              src={task.assigneeAvatar}
              alt={task.assigneeName || 'Assignee'}
              size="sm"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
