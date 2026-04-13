import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types/task';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import CreateTaskModal from '../task/CreateTaskModal';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskStatusUpdate: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskClick: (task: Task) => void;
  onTasksRefetch: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskStatusUpdate,
  onTaskClick,
  onTasksRefetch,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent): void => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await onTaskStatusUpdate(taskId, newStatus);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddTask = (status: TaskStatus): void => {
    setDefaultStatus(status);
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (): void => {
    setIsCreateModalOpen(false);
    setDefaultStatus(undefined);
    onTasksRefetch();
  };

  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          <KanbanColumn
            title="To Do"
            status={TaskStatus.TODO}
            tasks={todoTasks}
            onAddTask={() => handleAddTask(TaskStatus.TODO)}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="In Progress"
            status={TaskStatus.IN_PROGRESS}
            tasks={inProgressTasks}
            onAddTask={() => handleAddTask(TaskStatus.IN_PROGRESS)}
            onTaskClick={onTaskClick}
          />
          <KanbanColumn
            title="Done"
            status={TaskStatus.DONE}
            tasks={doneTasks}
            onAddTask={() => handleAddTask(TaskStatus.DONE)}
            onTaskClick={onTaskClick}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80 scale-105">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setDefaultStatus(undefined);
        }}
        onSuccess={handleCreateSuccess}
        defaultStatus={defaultStatus}
      />
    </>
  );
};

export default KanbanBoard;
