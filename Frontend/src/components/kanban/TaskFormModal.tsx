import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { structuresApi } from '../../api/structures.api';
import { kanbanApi } from '../../api/kanban.api';
import { Structure } from '../../types/structure.types';
import { TaskPriority, TaskStatus, KanbanTask } from '../../types/kanban.types';
import { toast } from 'sonner';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (task: KanbanTask) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [structures, setStructures] = useState<Structure[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    structureId: '',
    priority: 'medium' as TaskPriority,
    status: 'backlog' as TaskStatus,
    dueDate: '',
    assigneeName: '',
    assigneeRole: ''
  });

  useEffect(() => {
    if (isOpen) {
      structuresApi.getStructures().then(setStructures).catch(console.error);
      setFormData({
        title: '',
        description: '',
        structureId: '',
        priority: 'medium',
        status: 'backlog',
        dueDate: '',
        assigneeName: '',
        assigneeRole: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const selectedStructure = structures.find(s => s.id === formData.structureId);
      
      const payload: Partial<KanbanTask> = {
        title: formData.title,
        description: formData.description,
        structureId: formData.structureId,
        structureName: selectedStructure?.name || 'Unknown',
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
        assignee: {
          name: formData.assigneeName,
          role: formData.assigneeRole,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.assigneeName)}`
        },
        tags: []
      };

      const newTask = await kanbanApi.createTask(payload);
      toast.success('Task created successfully');
      onSuccess(newTask);
      onClose();
    } catch (err) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-t-muted mb-1">Title</label>
          <input required type="text" className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text" 
                 value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-t-muted mb-1">Description</label>
          <textarea required className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text" rows={3}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-t-muted mb-1">Structure</label>
          <select required className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                  value={formData.structureId} onChange={e => setFormData({...formData, structureId: e.target.value})}>
            <option value="">Select a structure...</option>
            {structures.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Priority</label>
            <select className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                    value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Status</label>
            <select className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}>
              <option value="backlog">Backlog</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-t-muted mb-1">Due Date</label>
          <input required type="date" className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                 value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Assignee Name</label>
            <input required type="text" className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                   value={formData.assigneeName} onChange={e => setFormData({...formData, assigneeName: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-t-muted mb-1">Assignee Role</label>
            <input required type="text" className="w-full bg-t-card border border-t-border rounded-lg p-2 text-t-text"
                   value={formData.assigneeRole} onChange={e => setFormData({...formData, assigneeRole: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-t-hover border border-t-border rounded-lg text-t-text hover:bg-t-border transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
