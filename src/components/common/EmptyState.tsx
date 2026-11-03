import React, { ReactNode } from 'react';
import { PackageOpen, LucideIcon } from 'lucide-react';
import { Button } from './Button';
import './StateScreens.css';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No outfits found',
  description = 'Try clearing your search query or selecting a different fashion category.',
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="state-screen-container animate-fade-in">
      <div className="state-icon-box">
        <Icon size={32} className="state-icon" />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

