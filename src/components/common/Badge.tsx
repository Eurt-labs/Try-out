import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import './Badge.css';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: LucideIcon;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon
}: BadgeProps) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {Icon && <Icon className="badge-icon" size={12} />}
      <span>{children}</span>
    </span>
  );
}

