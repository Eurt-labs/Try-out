import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import './Toast.css';

export function Toast() {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  const IconComponent =
    toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'error'
      ? AlertCircle
      : Info;

  return (
    <div className={`toast-wrapper animate-fade-down toast-${toast.type}`} role="alert">
      <div className="toast-content">
        <IconComponent className="toast-icon" size={20} />
        <span className="toast-message">{toast.message}</span>
      </div>
      <button className="toast-close" onClick={hideToast} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}

