import React from 'react';
import { KanbanTask, TaskStatus } from '../../types/kanban.types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: KanbanTask[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTaskMove }) => {
  const columns: { id: TaskStatus; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: 'bg-slate-500' },
    { id: 'scheduled', title: 'Scheduled', color: 'bg-blue-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'review', title: 'In Review', color: 'bg-purple-500' },
    { id: 'completed', title: 'Completed', color: 'bg-green-500' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar h-[calc(100vh-280px)] min-h-[500px]">
      {columns.map(col => (
        <KanbanColumn
          key={col.id}
          title={col.title}
          status={col.id}
          color={col.color}
          tasks={tasks.filter(t => t.status === col.id)}
          onDrop={onTaskMove}
          onDragStart={handleDragStart}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
