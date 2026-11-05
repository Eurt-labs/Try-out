import React, { useRef, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Shirt, Plus, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CameraCaptureModal } from '../../components/common/CameraCaptureModal';
import { Outfit, PhotoState } from '../../types';
import './TryOnPreview.css';

export interface TryOnPreviewProps {
  photo?: Partial<PhotoState> | null;
  outfit?: Outfit | null;
  onPhotoFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhotoCaptured?: (file: File) => void;
}

export function TryOnPreview({
  photo,
  outfit,
  onPhotoFileChange,
  onPhotoCaptured
}: TryOnPreviewProps) {
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleReplaceClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handleCameraCapture = (file: File) => {
    if (onPhotoCaptured) {
      onPhotoCaptured(file);
    }
  };

  const hasPhoto = Boolean(photo?.previewUrl);

  return (
    <div className="try-on-panels-wrapper">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={onPhotoFileChange}
        className="sr-only"
        aria-label="Upload replacement photo"
      />

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* PANEL 1: YOUR PHOTO */}
      <section className="preview-panel panel-photo card-premium" aria-label="Your Photograph Panel">
        <div className="panel-header">
          <div className="panel-title-group">
            <span className="panel-step-badge">Panel 01</span>
            <h3 className="panel-heading">Your Photo</h3>
          </div>
          {hasPhoto ? (
            <Badge variant="success" size="sm" icon={CheckCircle2}>
              Ready for Fit
            </Badge>
          ) : (
            <Badge variant="warning" size="sm" icon={AlertCircle}>
              Photo Needed
            </Badge>
          )}
        </div>

        <div className="panel-content-stage">
          {hasPhoto ? (
            <div className="preview-photo-wrap animate-fade-in">
              <img
                src={photo?.previewUrl || ''}
                alt="Your uploaded portrait"
                className="preview-photo-img"
              />
              <div className="preview-photo-status-badge">
                <CheckCircle2 size={13} className="text-success" />
                <span>Silhouette detected</span>
              </div>
            </div>
          ) : (
            <div className="preview-photo-empty-dropzone">
              <div className="empty-dropzone-icon">
                <UploadCloud size={32} />
              </div>
              <h4 className="empty-dropzone-title">Add a Photo of Yourself</h4>
              <p className="empty-dropzone-desc">
                Choose a picture from your device or use your webcam to take a portrait right now.
              </p>
              <div className="empty-stage-buttons">
                <Button
                  variant="primary"
                  size="sm"
                  icon={ImageIcon}
                  onClick={handleReplaceClick}
                >
                  Browse File
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Camera}
                  onClick={() => setIsCameraOpen(true)}
                >
                  Use Camera
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="panel-footer-actions">
          {hasPhoto ? (
            <div className="panel-photo-actions-row">
              <Button
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                onClick={handleReplaceClick}
              >
                Upload File
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={Camera}
                onClick={() => setIsCameraOpen(true)}
              >
                Take with Camera
              </Button>
            </div>
          ) : (
            <p className="panel-footer-tip">
              * A clear, forward-facing photo delivers optimal virtual fitting.
            </p>
          )}
        </div>
      </section>

      {/* Center Linking Node */}
      <div className="panels-linking-node" aria-hidden="true">
        <div className="linking-circle">
          <Plus size={16} />
        </div>
      </div>

      {/* PANEL 2: SELECTED OUTFIT */}
      <section className="preview-panel panel-outfit card-premium" aria-label="Selected Outfit Panel">
        <div className="panel-header">
          <div className="panel-title-group">
            <span className="panel-step-badge">Panel 02</span>
            <h3 className="panel-heading">Selected Outfit</h3>
          </div>
          <Badge variant="accent" size="sm" icon={Shirt}>
            {outfit?.category || 'Garment'}
          </Badge>
        </div>

        <div className="panel-content-stage">
          {outfit ? (
            <div className="preview-outfit-wrap animate-fade-in">
              <img
                src={outfit.image}
                alt={outfit.name}
                className="preview-outfit-img"
              />
              <div className="preview-outfit-meta-pill">
                <span>{outfit.name}</span>
                {outfit.price && <span className="price-tag">{outfit.price}</span>}
              </div>
            </div>
          ) : (
            <div className="preview-photo-empty-dropzone">
              <Shirt size={32} className="text-secondary" />
              <h4 className="empty-dropzone-title">No Outfit Selected</h4>
              <p className="empty-dropzone-desc">
                Choose an item from the catalogue to visualize.
              </p>
            </div>
          )}
        </div>

        <div className="panel-footer-actions">
          <Link to="/" className="w-full">
            <Button
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              className="w-full"
            >
              Choose Another Outfit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

