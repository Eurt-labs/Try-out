import React from 'react';
import './Badge.css';

export function Badge({
  children,
  variant = 'default', // 'default' | 'accent' | 'success' | 'warning' | 'outline'
  size = 'md',
  className = '',
  icon: Icon
}) {
  return (
    <span className={`badge badge-${variant} badge-${size} ${className}`}>
      {Icon && <Icon className="badge-icon" size={12} />}
      <span>{children}</span>
    </span>
  );
}
