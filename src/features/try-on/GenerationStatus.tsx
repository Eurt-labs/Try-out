import React, { useState, useEffect } from 'react';
import './GenerationStatus.css';

const GENERATION_MESSAGES = [
  'Calibrating silhouette and posture reference...',
  'Aligning garment proportion and seam drape...',
  'Rendering fabric texture and shadow depth...',
  'Refining contours for tailored fit...',
  'Finalizing editorial fitting preview...'
];

export interface GenerationStatusProps {
  outfitName?: string;
}

export function GenerationStatus({ outfitName }: GenerationStatusProps) {
  const [messageIndex, setMessageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % GENERATION_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="generation-status-card animate-fade-scale" role="status" aria-live="polite">
      {/* Minimal Studio Header */}
      <div className="generation-header-row">
        <span className="generation-studio-tag">Digital Fitting Studio</span>
        <span className="generation-step-counter">
          0{messageIndex + 1} / 0{GENERATION_MESSAGES.length}
        </span>
      </div>

      <div className="generation-content-body">
        <h3 className="generation-main-title">
          Tailoring Silhouette
        </h3>

        <p className="generation-outfit-label">
          Garment: <strong>{outfitName || 'Selected Piece'}</strong>
        </p>

        {/* Minimal Monochromatic Progress Line */}
        <div className="generation-progress-track">
          <div className="generation-progress-indicator"></div>
        </div>

        <div className="generation-message-row">
          <span className="generation-pulse-dot"></span>
          <p className="generation-current-msg" key={messageIndex}>
            {GENERATION_MESSAGES[messageIndex]}
          </p>
        </div>

        <p className="generation-hint">
          Precision drape rendering in progress. Please keep this session active.
        </p>
      </div>
    </div>
  );
}
