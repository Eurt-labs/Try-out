import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../hooks/useApp';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signInWithPassword, signUpWithPassword, isConfigured } = useAuth();
  const { showToast } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signInWithPassword(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          showToast('Welcome back! Signed in successfully.', 'success');
          onClose();
        }
      } else {
        const { error } = await signUpWithPassword(email, password, name);
        if (error) {
          setErrorMessage(error.message);
        } else {
          showToast('Account created successfully! Welcome to Try It Out.', 'success');
          onClose();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'signin' ? 'Sign In to Try It Out' : 'Create Your Account'}>
      <div className="auth-modal-content">
        {!isConfigured && (
          <div className="demo-notice-banner mb-4" style={{ marginBottom: '1.25rem' }}>
            <Sparkles size={16} />
            <span>
              <strong>Supabase Showcase:</strong> Supabase API keys can be configured in <code>.env</code>. You can test authentication right now in demonstration mode.
            </span>
          </div>
        )}

        <div className="auth-tab-switch" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            className={`btn-tab ${mode === 'signin' ? 'text-accent font-semibold' : 'text-secondary'}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: mode === 'signin' ? '2px solid var(--accent-primary)' : 'none' }}
            onClick={() => { setMode('signin'); setErrorMessage(null); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`btn-tab ${mode === 'signup' ? 'text-accent font-semibold' : 'text-secondary'}`}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', borderBottom: mode === 'signup' ? '2px solid var(--accent-primary)' : 'none' }}
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="upload-error-banner animate-fade-in" style={{ marginBottom: '1rem' }} role="alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode === 'signup' && (
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'block' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '38px' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.35rem', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            icon={ArrowRight}
            iconPosition="right"
            style={{ marginTop: '0.5rem', width: '100%' }}
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

