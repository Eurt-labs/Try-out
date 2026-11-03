import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Camera, CheckCircle2, AlertCircle, RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { usePhotoUpload } from '../../hooks/usePhotoUpload';
import { Button } from '../../components/common/Button';
import { CameraCaptureModal } from '../../components/common/CameraCaptureModal';
import './PhotoUpload.css';

export interface PhotoUploadProps {
  compact?: boolean;
}

export function PhotoUpload({ compact = false }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const {
    photo,
    isDragging,
    isUploading,
    uploadError,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleProcessFile,
    removePhoto
  } = usePhotoUpload();

  const handleChooseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const hasPhoto = Boolean(photo.previewUrl);

  return (
    <div className={`photo-upload-section ${compact ? 'photo-upload-compact' : ''}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileInputChange}
        className="sr-only"
        id="photo-file-input"
        aria-label="Upload photo file"
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleProcessFile}
      />

      {!hasPhoto ? (
        /* Empty Upload Dropzone */
        <div
          className={`upload-dropzone ${isDragging ? 'dropzone-active' : ''} ${isUploading ? 'dropzone-uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleChooseClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleChooseClick();
            }
          }}
          aria-label="Upload your photograph for virtual try-on"
        >
          <div className="upload-icon-circle animate-pulse-subtle">
            {isUploading ? (
              <RefreshCw className="animate-spin text-accent" size={32} />
            ) : (
              <UploadCloud className="upload-icon-graphic" size={32} />
            )}
          </div>

          <div className="upload-text-content">
            <h3 className="upload-title">
              {isDragging ? 'Drop your photo right here' : 'Start With Your Photo'}
            </h3>
            <p className="upload-description">
              Upload a picture of yourself or snap a fresh photo with your camera to see how different outfits look on your body.
            </p>
          </div>

          <div className="upload-action-row">
            <div className="upload-buttons-group">
              <Button
                variant="primary"
                size="md"
                isLoading={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChooseClick();
                }}
                icon={ImageIcon}
              >
                Choose Photo
              </Button>

              <Button
                variant="secondary"
                size="md"
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCameraOpen(true);
                }}
                icon={Camera}
              >
                Use Camera
              </Button>
            </div>
            <span className="upload-meta-hint">Upload JPG/PNG up to 10MB or snap live with webcam</span>
          </div>

          {uploadError && (
            <div className="upload-error-banner animate-fade-in" role="alert">
              <AlertCircle size={16} />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Quick Guidance Chips */}
          <div className="upload-guidance-chips" onClick={(e) => e.stopPropagation()}>
            <span className="guidance-chip">
              <CheckCircle2 size={13} className="text-success" /> Full or mid-body shot
            </span>
            <span className="guidance-chip">
              <CheckCircle2 size={13} className="text-success" /> Clear, even lighting
            </span>
            <span className="guidance-chip">
              <CheckCircle2 size={13} className="text-success" /> Unobstructed posture
            </span>
          </div>
        </div>
      ) : (
        /* Active Photo Preview Card */
        <div className="active-photo-card animate-fade-scale">
          <div className="active-photo-preview-wrap">
            <img
              src={photo.previewUrl || ''}
              alt="Active try-on photograph"
              className="active-photo-img"
            />
            <div className="active-photo-badge">
              <CheckCircle2 size={14} className="text-success" />
              <span>{photo.backendUploaded ? 'Backend Synchronized' : 'Ready for Try-On'}</span>
            </div>
          </div>

          <div className="active-photo-details">
            <div className="active-photo-header">
              <div className="active-photo-title-group">
                <span className="active-photo-label">Current Photograph</span>
                <h4 className="active-photo-name">
                  {photo.file ? photo.file.name : 'Uploaded Try-On Photo'}
                </h4>
              </div>
              <span className="active-photo-status-pill">
                <Sparkles size={12} /> Active in Session
              </span>
            </div>

            <p className="active-photo-info">
              This photograph will be automatically mapped to any clothing item you choose from the catalogue.
            </p>

            <div className="active-photo-actions">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleChooseClick}
                icon={RefreshCw}
              >
                Change Photo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsCameraOpen(true)}
                icon={Camera}
              >
                Retake with Camera
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePhoto}
                icon={Trash2}
                className="btn-remove-photo"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

