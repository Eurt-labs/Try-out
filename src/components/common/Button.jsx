import React from 'react';
import { Loader2 } from 'lucide-react';
import './Button.css';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${isLoading ? 'btn-loading' : ''} ${className}`}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="btn-spinner animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="btn-icon" size={size === 'sm' ? 15 : size === 'lg' ? 20 : 18} />}
      <span className="btn-text">{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="btn-icon" size={size === 'sm' ? 15 : size === 'lg' ? 20 : 18} />}
    </button>
  );
}
