export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'backlog' | 'scheduled' | 'in-progress' | 'review' | 'completed';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  structureId: string;
  structureName: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: {
    name: string;
    avatar: string;
    role: string;
  };
  dueDate: string;
  createdAt: string;
  tags: string[];
}
