import React, { useState, useEffect } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import './GenerationStatus.css';

const GENERATION_MESSAGES = [
  'Initializing virtual fitting pipeline...',
  'Analyzing posture, silhouette and lighting...',
  'Extracting fabric drape and seam geometries...',
  'Synthesizing photorealistic garment overlay...',
  'Refining shadows, folds and natural textures...',
  'Finalizing high-resolution fashion preview...'
];

export interface GenerationStatusProps {
  outfitName?: string;
}

export function GenerationStatus({ outfitName }: GenerationStatusProps) {
  const [messageIndex, setMessageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % GENERATION_MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="generation-status-card animate-fade-scale" role="status" aria-live="polite">
      {/* Central Visual AI Processing Orb */}
      <div className="ai-processing-visual">
        <div className="ai-scan-ring ring-outer animate-spin"></div>
        <div className="ai-scan-ring ring-inner"></div>
        <div className="ai-core-orb animate-pulse-subtle">
          <Wand2 size={36} className="ai-core-icon" />
        </div>
      </div>

      <div className="generation-status-text">
        <span className="generation-pill">
          <Sparkles size={13} /> AI Processing In Progress
        </span>

        <h3 className="generation-main-title">
          Creating Your Look
        </h3>

        <p className="generation-outfit-label">
          Fitting: <strong>{outfitName || 'Selected Outfit'}</strong>
        </p>

        <div className="generation-rotating-banner">
          <div className="message-bullet"></div>
          <p className="generation-current-msg animate-fade-in" key={messageIndex}>
            {GENERATION_MESSAGES[messageIndex]}
          </p>
        </div>

        <p className="generation-hint">
          Virtual drape synthesis typically takes a few moments. Please keep this window active.
        </p>
      </div>
    </div>
  );
}

