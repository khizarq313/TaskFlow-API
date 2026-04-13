import React from 'react';
import { Subtask } from '../../types/task';

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: (subtaskId: string) => void;
  onDelete: (subtaskId: string) => void;
}

export const SubtaskItem: React.FC<SubtaskItemProps> = ({ subtask, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-3 group">
      <button
        onClick={() => onToggle(subtask.id)}
        className="flex-shrink-0 w-5 h-5 rounded border-2 border-outline flex items-center justify-center hover:border-primary transition-colors"
        aria-label={subtask.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {subtask.completed && (
          <span
            className="material-symbols-outlined text-primary text-sm"
            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
          >
            check
          </span>
        )}
      </button>

      <span
        className={`flex-1 text-sm ${
          subtask.completed ? 'line-through text-outline' : 'text-on-surface'
        }`}
      >
        {subtask.title}
      </span>

      <button
        onClick={() => onDelete(subtask.id)}
        className="opacity-0 group-hover:opacity-100 text-outline hover:text-error transition-all"
        aria-label="Delete subtask"
      >
        <span className="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>
  );
};

export default SubtaskItem;
