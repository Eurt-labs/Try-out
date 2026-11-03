import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, CheckCircle2, ArrowRight, ArrowLeft, Shield, RefreshCw, Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { PhotoUpload } from '../photo-upload/PhotoUpload';
import { Button } from '../../components/common/Button';
import './SetupPage.css';

const SETUP_STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'upload', label: 'Upload' },
  { id: 'confirm', label: 'Confirm' },
  { id: 'complete', label: 'Complete' }
];

export function SetupPage() {
  const navigate = useNavigate();
  const { photo, setSetupCompleted, removePhoto, showToast } = useApp();

  // If user already has a photo and completed setup, allow them to view or restart
  const [currentStep, setCurrentStep] = useState<string>(
    photo.previewUrl ? 'confirm' : 'welcome'
  );

  const handleStartSetup = () => {
    setCurrentStep('upload');
  };

  const handleConfirmPhoto = () => {
    if (!photo.previewUrl) {
      showToast('Please upload a photograph first', 'error');
      return;
    }
    setSetupCompleted(true);
    setCurrentStep('complete');
  };

  const handleFinish = () => {
    navigate('/');
  };

  const handleResetSetup = () => {
    removePhoto();
    setCurrentStep('upload');
  };

  return (
    <div className="setup-page-root animate-fade-in">
      <div className="container setup-container">
        {/* Step Indicator Progress Bar */}
        <div className="setup-progress-nav" aria-label="Setup steps">
          {SETUP_STEPS.map((s, idx) => {
            const stepIndex = SETUP_STEPS.findIndex(x => x.id === currentStep);
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={s.id}
                className={`progress-step-item ${isCurrent ? 'step-current' : ''} ${isCompleted ? 'step-completed' : ''}`}
              >
                <div className="step-circle">
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* STEP: WELCOME */}
        {currentStep === 'welcome' && (
          <div className="setup-card card-premium animate-fade-scale text-center">
            <div className="setup-icon-halo">
              <Sparkles size={36} className="text-accent" />
            </div>

            <div className="accent-pill" style={{ margin: '0 auto 1.25rem' }}>
              First-Time Setup
            </div>

            <h1 className="setup-heading">Welcome to Try It Out.</h1>
            <p className="setup-description">
              Get ready to discover a new way to explore your style. In just two quick steps, set up your personal virtual fitting profile so you can visualize any garment on your body instantly.
            </p>

            <div className="setup-benefits-row">
              <div className="benefit-item">
                <Camera size={18} className="text-accent" />
                <span>Upload Once</span>
              </div>
              <div className="benefit-item">
                <Sparkles size={18} className="text-accent" />
                <span>Try Any Outfit</span>
              </div>
              <div className="benefit-item">
                <Shield size={18} className="text-accent" />
                <span>Private & Secure</span>
              </div>
            </div>

            <div className="setup-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartSetup}
                icon={ArrowRight}
                iconPosition="right"
              >
                Let's Get Started
              </Button>
            </div>
          </div>
        )}

        {/* STEP: UPLOAD */}
        {currentStep === 'upload' && (
          <div className="setup-card card-premium animate-fade-scale">
            <div className="setup-card-header text-center">
              <span className="setup-step-counter">Step 01 of 02</span>
              <h2 className="setup-heading">Upload Your Photograph</h2>
              <p className="setup-description">
                Upload a picture of yourself. This photo will be mapped to all outfits in the catalogue.
              </p>
            </div>

            <div className="setup-upload-stage">
              <PhotoUpload compact={false} />
            </div>

            <div className="setup-actions-split">
              <Button
                variant="ghost"
                size="md"
                onClick={() => setCurrentStep('welcome')}
                icon={ArrowLeft}
              >
                Back
              </Button>

              <Button
                variant="primary"
                size="md"
                disabled={!photo.previewUrl}
                onClick={() => setCurrentStep('confirm')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Proceed to Review
              </Button>
            </div>
          </div>
        )}

        {/* STEP: PREVIEW AND CONFIRM */}
        {currentStep === 'confirm' && (
          <div className="setup-card card-premium animate-fade-scale">
            <div className="setup-card-header text-center">
              <span className="setup-step-counter">Step 02 of 02</span>
              <h2 className="setup-heading">Preview and Confirm</h2>
              <p className="setup-description">
                Check that your photograph meets the quality recommendations for optimal virtual drape synthesis.
              </p>
            </div>

            <div className="confirm-layout-grid">
              {/* Photo Preview */}
              <div className="confirm-photo-col">
                <div className="confirm-photo-frame">
                  {photo.previewUrl ? (
                    <img src={photo.previewUrl} alt="Your photo for preview" className="confirm-img" />
                  ) : (
                    <div className="confirm-no-photo">No photo selected</div>
                  )}
                  <div className="confirm-status-pill">
                    <CheckCircle2 size={13} className="text-success" />
                    <span>Selected Photo</span>
                  </div>
                </div>

                <div className="confirm-photo-tools">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentStep('upload')}
                    icon={RefreshCw}
                  >
                    Replace Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetSetup}
                    icon={Trash2}
                    className="btn-danger-ghost"
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {/* Quality Checklist Recommendations */}
              <div className="confirm-checklist-col">
                <h4 className="checklist-title">Image Quality Recommendations</h4>
                <ul className="checklist-items">
                  <li className="checklist-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <strong>Full or mid-body photograph</strong>
                      <p>Clear visibility from shoulders to waist or full body delivers best drape.</p>
                    </div>
                  </li>
                  <li className="checklist-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <strong>Face and existing clothing clearly visible</strong>
                      <p>Helps the neural model accurately detect boundary contours.</p>
                    </div>
                  </li>
                  <li className="checklist-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <strong>Good, balanced lighting</strong>
                      <p>Avoid heavy shadows or dark backlighting across your silhouette.</p>
                    </div>
                  </li>
                  <li className="checklist-item">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <strong>Avoid blurry or heavily obstructed photos</strong>
                      <p>Prevents seam misalignments and distorted fabric renders.</p>
                    </div>
                  </li>
                </ul>

                <div className="confirm-cta-box">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleConfirmPhoto}
                    icon={CheckCircle2}
                    className="w-full"
                  >
                    Confirm & Finish Setup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP: FINISH SETUP */}
        {currentStep === 'complete' && (
          <div className="setup-card card-premium animate-fade-scale text-center">
            <div className="setup-icon-halo success">
              <CheckCircle2 size={40} className="text-success" />
            </div>

            <div className="accent-pill success-pill" style={{ margin: '0 auto 1.25rem' }}>
              Ready to Style
            </div>

            <h1 className="setup-heading">You're All Set!</h1>
            <p className="setup-description">
              Your photo is ready. Explore outfits and start your virtual try-on experience.
            </p>

            {photo.previewUrl && (
              <div className="complete-photo-thumbnail">
                <img src={photo.previewUrl} alt="Confirmed setup portrait" className="thumb-circle" />
                <div className="complete-thumb-badge">
                  <Sparkles size={12} /> Ready
                </div>
              </div>
            )}

            <div className="setup-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinish}
                icon={ArrowRight}
                iconPosition="right"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
