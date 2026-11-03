import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, Sparkles, SwitchCamera, Timer } from 'lucide-react';
import { Button } from './Button';
import './CameraCaptureModal.css';

export function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraError, setCameraError] = useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [useTimer, setUseTimer] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' | 'environment'
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Check available camera hardware
  useEffect(() => {
    async function checkDevices() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');
          setHasMultipleCameras(videoDevices.length > 1);
        }
      } catch (e) {
        console.debug('Error enumerating devices', e);
      }
    }
    checkDevices();
  }, []);

  // Synchronize webcam hardware with modal state & camera selection
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isSubscribed = true;
    document.body.style.overflow = 'hidden';

    async function initCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported by your browser or environment.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 }
          },
          audio: false
        });

        if (!isSubscribed) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        if (isSubscribed) {
          let errorMsg = 'Could not access camera. Please allow camera permissions or upload an image file instead.';
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMsg = 'Camera permission was denied. Please grant camera access in your browser address bar.';
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            errorMsg = 'No camera device found on this system.';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMsg = 'Camera is already in use by another application.';
          }
          setCameraError(errorMsg);
        }
      }
    }

    initCamera();

    return () => {
      isSubscribed = false;
      document.body.style.overflow = '';
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode, retryCount]);

  // Toggle camera front / back
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Perform snapshot on canvas
  const performCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // If using user (selfie) camera, mirror horizontally for natural feel
    if (facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedDataUrl(dataUrl);
    setIsCapturing(false);

    // Stop video tracks to free camera hardware
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // Trigger capture either instantly or with 3-second timer
  const handleCaptureClick = () => {
    if (useTimer) {
      setIsCapturing(true);
      setCountdown(3);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            performCapture();
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      performCapture();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedDataUrl(null);
    setRetryCount((c) => c + 1);
  };

  // Confirm photo and convert to File
  const handleConfirm = () => {
    if (!capturedDataUrl || !canvasRef.current) return;

    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File(
          [blob],
          `try-on-camera-${Date.now()}.jpg`,
          { type: 'image/jpeg' }
        );
        onCapture(file);
        handleClose();
      },
      'image/jpeg',
      0.92
    );
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCapturedDataUrl(null);
    setCountdown(null);
    setCameraError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="camera-modal-backdrop animate-fade-in" role="dialog" aria-modal="true">
      <div className="camera-modal-card animate-fade-scale">
        {/* Header */}
        <div className="camera-modal-header">
          <div className="camera-modal-title-group">
            <div className="camera-icon-badge">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="camera-modal-title">Take Your Photo</h3>
              <p className="camera-modal-subtitle">
                {capturedDataUrl ? 'Review your capture' : 'Align your silhouette inside the frame'}
              </p>
            </div>
          </div>
          <button className="camera-modal-close" onClick={handleClose} aria-label="Close camera">
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Stage */}
        <div className="camera-viewfinder-wrap">
          <canvas ref={canvasRef} className="sr-only" />

          {cameraError ? (
            <div className="camera-error-screen animate-fade-in">
              <div className="camera-error-icon">
                <AlertCircle size={36} />
              </div>
              <h4 className="camera-error-title">Camera Unavailable</h4>
              <p className="camera-error-desc">{cameraError}</p>
              <div className="camera-error-actions">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={RefreshCw}
                  onClick={() => {
                    setCameraError(null);
                    setRetryCount((c) => c + 1);
                  }}
                >
                  Try Again
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Use File Upload Instead
                </Button>
              </div>
            </div>
          ) : capturedDataUrl ? (
            /* Review captured photo */
            <div className="camera-preview-stage animate-fade-in">
              <img src={capturedDataUrl} alt="Captured camera snapshot" className="camera-preview-img" />
              <div className="camera-preview-badge">
                <Sparkles size={13} /> Photo Captured
              </div>
            </div>
          ) : (
            /* Live video stream */
            <div className="camera-live-stage">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-video-stream ${facingMode === 'user' ? 'mirrored' : ''}`}
              />

              {/* Silhouette framing guide */}
              <div className="silhouette-guide-overlay" aria-hidden="true">
                <div className="silhouette-head-guide"></div>
                <div className="silhouette-torso-guide"></div>
                <span className="silhouette-guide-hint">Align face & shoulders</span>
              </div>

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="countdown-overlay animate-pulse-subtle">
                  <span className="countdown-number">{countdown}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Viewfinder Controls */}
        <div className="camera-modal-footer">
          {capturedDataUrl ? (
            <div className="camera-confirm-actions">
              <Button variant="secondary" size="md" icon={RefreshCw} onClick={handleRetake}>
                Retake Photo
              </Button>
              <Button variant="primary" size="md" icon={Check} onClick={handleConfirm}>
                Use This Photo
              </Button>
            </div>
          ) : (
            <div className="camera-live-actions">
              <div className="camera-live-options">
                {/* 3s Timer button toggle */}
                <button
                  type="button"
                  className={`camera-option-pill ${useTimer ? 'option-active' : ''}`}
                  onClick={() => setUseTimer(!useTimer)}
                  title="Toggle 3-second self-timer"
                >
                  <Timer size={15} />
                  <span>3s Timer {useTimer ? 'ON' : 'OFF'}</span>
                </button>

                {/* Switch camera toggle if available */}
                {hasMultipleCameras && (
                  <button
                    type="button"
                    className="camera-option-pill"
                    onClick={toggleFacingMode}
                    title="Flip camera"
                  >
                    <SwitchCamera size={15} />
                    <span>Flip Camera</span>
                  </button>
                )}
              </div>

              {/* Shutter Button */}
              <button
                type="button"
                className="camera-shutter-btn"
                onClick={handleCaptureClick}
                disabled={Boolean(cameraError || isCapturing)}
                aria-label="Capture photograph"
              >
                <div className="shutter-inner">
                  <Camera size={24} />
                </div>
              </button>

              <span className="camera-hint-text">
                {useTimer ? 'Tap shutter for 3-second pose countdown' : 'Tap shutter to take photo immediately'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
