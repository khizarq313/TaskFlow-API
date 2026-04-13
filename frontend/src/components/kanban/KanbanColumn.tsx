import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onAddTask: () => void;
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  onAddTask,
  onTaskClick,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const statusDotColors = {
    [TaskStatus.TODO]: 'bg-outline',
    [TaskStatus.IN_PROGRESS]: 'bg-primary',
    [TaskStatus.DONE]: 'bg-tertiary',
  };

  return (
    <div className="flex flex-col gap-4 min-h-[200px]">
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusDotColors[status]}`} aria-hidden="true" />
          <h2 className="font-headline font-bold text-lg tracking-tight text-white">{title}</h2>
          <span className="text-xs bg-surface-container-high text-outline px-2 py-0.5 rounded-full font-bold">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="text-outline hover:text-white transition-colors"
          aria-label={`Add task to ${title}`}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-4 transition-colors rounded-lg ${
          isOver ? 'bg-surface-variant/10' : ''
        }`}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-outline-variant/20 rounded-lg">
            <p className="text-sm text-outline">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
