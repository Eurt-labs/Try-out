import React, { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import './StateScreens.css';

export interface ErrorStateProps {
  title?: ReactNode;
  message?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while fetching information.',
  onRetry,
  retryLabel = 'Try Again'
}: ErrorStateProps) {
  return (
    <div className="state-screen-container animate-fade-in state-error">
      <div className="state-icon-box error">
        <AlertTriangle size={32} className="state-icon-danger" />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-desc">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry} icon={RefreshCw}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
