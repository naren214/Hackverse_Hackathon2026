import React, { useState } from 'react';
import { KanbanTask, TaskStatus } from '../../types/kanban.types';
import { TaskCard } from './TaskCard';
import clsx from 'clsx';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: KanbanTask[];
  color: string;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, color, onDrop, onDragStart }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onDrop(taskId, status);
    }
  };

  return (
    <div className="flex flex-col h-full min-w-[300px] w-[300px] shrink-0 bg-t-card rounded-xl border border-t-border overflow-hidden">
      <div className={clsx("h-1 w-full", color)} />
      <div className="p-4 border-b border-t-border flex justify-between items-center bg-t-hover/50">
        <h3 className="font-semibold text-t-text">{title}</h3>
        <span className="bg-t-border text-t-text-secondary text-xs px-2.5 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>

      <div 
        className={clsx(
          "flex-1 p-3 overflow-y-auto custom-scrollbar transition-colors",
          isDragOver ? "bg-t-hover border-2 border-dashed border-t-border m-1 rounded-lg" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
          ))}
          {tasks.length === 0 && !isDragOver && (
            <div className="h-24 flex items-center justify-center border-2 border-dashed border-t-border rounded-xl text-t-muted text-sm">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
