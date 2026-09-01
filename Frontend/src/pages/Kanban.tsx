import React, { useState, useMemo, useEffect } from 'react';
import { kanbanApi } from '../api/kanban.api';
import { KanbanTask, TaskStatus } from '../types/kanban.types';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { StatCard } from '../components/common/StatCard';
import { SearchInput } from '../components/common/SearchInput';
import { TaskFormModal } from '../components/kanban/TaskFormModal';
import { Plus, LayoutGrid, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

export const Kanban: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    kanbanApi.getTasks()
      .then(data => setTasks(data))
      .catch(err => console.error('Failed to load tasks:', err));
  }, []);

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      await kanbanApi.updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: tasks.length,
      overdue: tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completedMonth: tasks.filter(t => t.status === 'completed' && new Date(t.dueDate).getMonth() === now.getMonth()).length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            task.structureName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-t-text mb-1">Maintenance Board</h1>
          <p className="text-t-muted">Track and manage maintenance tasks</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          <span>Add Task</span>
        </button>
      </div>

      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSuccess={(newTask) => setTasks(prev => [newTask, ...prev])}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.total} icon={LayoutGrid} color="blue" />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertTriangle} color="red" />
        <StatCard title="In Progress" value={stats.inProgress} icon={Activity} color="amber" />
        <StatCard title="Completed (This Month)" value={stats.completedMonth} icon={CheckCircle} color="green" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-t-card p-4 rounded-xl border border-t-border">
        <div className="w-full sm:w-96">
          <SearchInput 
            value={searchQuery} 
            onChange={setSearchQuery} 
            placeholder="Search tasks..." 
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-t-hover border border-t-border text-t-text text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="flex-1 mt-2">
        <KanbanBoard tasks={filteredTasks} onTaskMove={handleTaskMove} />
      </div>
    </div>
  );
};

export default Kanban;
