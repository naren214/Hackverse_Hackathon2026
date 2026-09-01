import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-t-border bg-t-card/50 backdrop-blur-sm">
      <div className="w-16 h-16 bg-t-border rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-t-muted" />
      </div>
      <h3 className="text-lg font-medium text-t-text mb-2">{title}</h3>
      <p className="text-t-muted max-w-sm mb-6">{description}</p>
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
