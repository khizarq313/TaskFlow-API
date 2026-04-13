import React from 'react';
import { TaskPriority } from '../../types/task';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const priorityStyles = {
    [TaskPriority.URGENT]: 'bg-[#885500] text-[#ffb95f]',
    [TaskPriority.HIGH]: 'bg-red-900/50 text-red-400',
    [TaskPriority.MEDIUM]: 'bg-secondary-container text-secondary',
    [TaskPriority.LOW]: 'bg-surface-variant text-on-surface-variant',
  };

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${priorityStyles[priority]} ${className}`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
