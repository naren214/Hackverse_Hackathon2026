import React from 'react';
import { KanbanTask } from '../../types/kanban.types';
import { Building2, Calendar, Clock } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: KanbanTask;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';

  const priorityColor = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-green-500'
  }[task.priority];

  return (
    <motion.div
      draggable
      onDragStart={(e: any) => onDragStart(e, task.id)}
      whileHover={{ y: -2, scale: 1.02 }}
      className="relative bg-t-hover border border-t-border rounded-xl p-4 cursor-grab active:cursor-grabbing hover:shadow-lg shadow-black/20 group"
    >
      <div className={clsx("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl opacity-70 group-hover:opacity-100 transition-opacity", priorityColor)} />
      
      <div className="ml-2">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-t-muted bg-t-card px-2 py-0.5 rounded">
            {task.id.split('-')[0]}
          </span>
          <div className="flex gap-1">
            {task.tags.map(tag => (
              <span key={tag} className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <h4 className="text-t-text font-medium text-sm mb-2 leading-tight">{task.title}</h4>
        
        <div className="flex items-center space-x-1.5 text-xs text-t-muted mb-4">
          <Building2 size={12} />
          <span className="truncate">{task.structureName}</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-t-border">
          <div className="flex items-center space-x-2">
            <img src={task.assignee.avatar} alt={task.assignee.name} className="w-6 h-6 rounded-full border border-t-border" />
            <span className="text-xs text-t-text-secondary">{task.assignee.name.split(' ')[0]}</span>
          </div>
          
          <div className={clsx(
            "flex items-center space-x-1 text-xs",
            isOverdue ? "text-red-400 font-medium" : "text-t-muted"
          )}>
            {isOverdue ? <Clock size={12} /> : <Calendar size={12} />}
            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
