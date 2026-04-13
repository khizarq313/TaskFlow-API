import React from 'react';
import { TaskStatus } from '../../types/task';

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusStyles = {
    [TaskStatus.TODO]: 'bg-surface-variant text-on-surface-variant',
    [TaskStatus.IN_PROGRESS]: 'bg-primary-container/30 text-primary',
    [TaskStatus.DONE]: 'bg-tertiary-container/30 text-tertiary',
  };

  const statusLabels = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
  };

  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusStyles[status]} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
