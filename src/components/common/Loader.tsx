import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import './Loader.css';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  subtext?: string;
  inline?: boolean;
  variant?: 'sparkle' | 'spinner';
}

export function Loader({
  size = 'md',
  message = 'Loading...',
  subtext = '',
  inline = false,
  variant = 'sparkle'
}: LoaderProps) {
  if (inline) {
    return (
      <div className="loader-inline">
        <Loader2 className="animate-spin text-accent" size={16} />
        <span className="loader-text">{message}</span>
      </div>
    );
  }

  return (
    <div className={`loader-container loader-${size}`}>
      <div className="loader-visual">
        <div className="loader-halo"></div>
        {variant === 'sparkle' ? (
          <div className="loader-spark-center animate-pulse-subtle">
            <Sparkles className="loader-icon text-accent" size={size === 'lg' ? 36 : 26} />
          </div>
        ) : (
          <Loader2 className="animate-spin text-accent" size={size === 'lg' ? 40 : 28} />
        )}
      </div>
      {message && <p className="loader-message">{message}</p>}
      {subtext && <p className="loader-subtext">{subtext}</p>}
    </div>
  );
}

