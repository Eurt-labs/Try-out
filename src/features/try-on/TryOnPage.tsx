import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { catalogueService } from '../../services/catalogueService';
import { tryOnService } from '../../services/tryOnService';
import { photoService } from '../../services/photoService';
import { TryOnPreview } from './TryOnPreview';
import { GenerationStatus } from './GenerationStatus';
import { ResultView } from './ResultView';
import { Button } from '../../components/common/Button';
import { ErrorState } from '../../components/common/ErrorState';
import { Loader } from '../../components/common/Loader';
import './TryOnPage.css';

export function TryOnPage() {
  const { outfitId } = useParams<{ outfitId: string }>();
  const navigate = useNavigate();
  const {
    photo,
    setPhoto,
    selectedOutfit,
    setSelectedOutfit,
    tryOn,
    dispatch,
    showToast
  } = useApp();

  const [loadingOutfit, setLoadingOutfit] = useState<boolean>(!selectedOutfit || selectedOutfit.id !== outfitId);
  const [outfitError, setOutfitError] = useState<string | null>(null);
  const [offlineNotice, setOfflineNotice] = useState<string | null>(null);

  // Load outfit if not currently in global context or mismatched
  useEffect(() => {
    let isMounted = true;
    async function loadOutfit() {
      if (!outfitId) return;
      if (selectedOutfit && selectedOutfit.id === outfitId) {
        setLoadingOutfit(false);
        return;
      }

      setLoadingOutfit(true);
      setOutfitError(null);
      try {
        const data = await catalogueService.getOutfitById(outfitId);
        if (isMounted) {
          setSelectedOutfit(data.outfit);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Selected outfit could not be located.';
          setOutfitError(msg);
        }
      } finally {
        if (isMounted) {
          setLoadingOutfit(false);
        }
      }
    }

    if (outfitId) {
      loadOutfit();
    }
    return () => {
      isMounted = false;
    };
  }, [outfitId, selectedOutfit, setSelectedOutfit]);

  // Handle photo replacement inside the workspace
  const handlePhotoFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validation = photoService.validatePhoto(file);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid photo', 'error');
        return;
      }
      try {
        const uploaded = await photoService.uploadPhoto(file);
        setPhoto({
          file,
          previewUrl: uploaded.url,
          assetId: uploaded.assetId,
          backendUploaded: uploaded.backendUploaded,
          source: uploaded.source
        });
        showToast('Photo updated for virtual try-on', 'success');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update photo';
        showToast(msg, 'error');
      }
    }
  };

  const handlePhotoCaptured = async (file: File) => {
    if (!file) return;
    try {
      const uploaded = await photoService.uploadPhoto(file);
      setPhoto({
        file,
        previewUrl: uploaded.url,
        assetId: uploaded.assetId,
        backendUploaded: uploaded.backendUploaded,
        source: uploaded.source
      });
      showToast('Camera photo captured and ready for try-on!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update photo';
      showToast(msg, 'error');
    }
  };

  // Submit Generation
  const handleGenerateLook = useCallback(async (isDemoRequested = false) => {
    if (!photo.previewUrl) {
      showToast('Please upload or select your photograph first.', 'error');
      return;
    }
    if (!selectedOutfit) {
      showToast('No outfit is currently selected.', 'error');
      return;
    }

    dispatch({ type: 'SET_TRY_ON_STATUS', payload: { status: 'generating' } });
    setOfflineNotice(null);

    try {
      if (isDemoRequested) {
        // High fidelity simulated inference with realistic processing pause
        await new Promise((r) => setTimeout(r, 3800));
        // Use the high quality outfit image or composite as demo preview
        dispatch({
          type: 'SET_TRY_ON_SUCCESS',
          payload: {
            resultUrl: selectedOutfit.image,
            source: 'showcase',
            isDemoResult: true
          }
        });
        showToast('Generated virtual demonstration preview!', 'success');
        return;
      }

      // Live backend invocation
      const response = await tryOnService.generateTryOn({
        photoAssetId: photo.assetId,
        outfitId: selectedOutfit.id,
        photoFile: photo.file
      });

      if (response.status === 'success' && response.resultUrl) {
        dispatch({
          type: 'SET_TRY_ON_SUCCESS',
          payload: {
            resultUrl: response.resultUrl,
            source: response.source || 'backend',
            isDemoResult: false,
            aiStylingAdvice: response.aiStylingAdvice
          }
        });
        showToast('Virtual try-on completed by backend AI!', 'success');
      } else if (response.status === 'demo_fallback') {
        // Backend offline: show error state with clear diagnostic and option
        dispatch({
          type: 'SET_TRY_ON_ERROR',
          payload: response.error || 'Backend offline'
        });
        setOfflineNotice(response.error || null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate virtual try-on result.';
      dispatch({
        type: 'SET_TRY_ON_ERROR',
        payload: msg
      });
    }
  }, [photo, selectedOutfit, dispatch, showToast]);

  const handleResetTryOn = () => {
    dispatch({ type: 'RESET_TRY_ON' });
  };

  const isReadyToGenerate = Boolean(photo.previewUrl && selectedOutfit && tryOn.status !== 'generating');

  if (loadingOutfit) {
    return (
      <div className="try-on-page-root container">
        <Loader size="lg" message="Loading outfit specifications..." subtext="Retrieving high-res garment metadata" />
      </div>
    );
  }

  if (outfitError) {
    return (
      <div className="try-on-page-root container">
        <ErrorState
          title="Outfit Not Found"
          message={outfitError}
          onRetry={() => navigate('/')}
          retryLabel="Return to Catalogue"
        />
      </div>
    );
  }

  return (
    <div className="try-on-page-root animate-fade-in">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="try-on-nav-bar">
          <Link to="/" className="back-to-catalogue-link">
            <ArrowLeft size={16} />
            <span>Back to Catalogue</span>
          </Link>
          <div className="try-on-session-status">
            <span className="status-dot"></span>
            <span>Virtual Fitting Studio</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="try-on-header">
          <h1 className="try-on-heading">See Yourself in a New Look.</h1>
          <p className="try-on-subheading">
            Review your photo and chosen outfit before generating your virtual preview.
          </p>
        </div>

        {/* STATE MACHINE ROUTER */}
        {tryOn.status === 'generating' ? (
          /* STATE 2 — GENERATING */
          <GenerationStatus outfitName={selectedOutfit?.name} />
        ) : tryOn.status === 'success' && tryOn.resultUrl ? (
          /* STATE 3 — SUCCESS */
          <ResultView
            resultUrl={tryOn.resultUrl}
            outfit={selectedOutfit}
            originalPhotoUrl={photo.previewUrl}
            isDemoResult={tryOn.isDemoResult}
            aiStylingAdvice={tryOn.aiStylingAdvice}
            onChangePhoto={() => {
              handleResetTryOn();
              const el = document.querySelector('.panel-photo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        ) : tryOn.status === 'error' ? (
          /* STATE 4 — ERROR */
          <div className="try-on-error-wrapper animate-fade-scale">
            <ErrorState
              title="Virtual Try-On Could Not Complete"
              message={tryOn.error || 'An error occurred during AI processing.'}
              onRetry={() => handleGenerateLook(false)}
              retryLabel="Retry Generation"
            />

            {/* Offline demonstration alternative */}
            {offlineNotice && (
              <div className="offline-demo-card">
                <div className="offline-demo-header">
                  <AlertCircle size={20} className="text-warning" />
                  <div>
                    <h4 className="offline-demo-title">Explore Showcase Mode</h4>
                    <p className="offline-demo-desc">
                      Since the local backend at <code>http://localhost:8000</code> is not currently running, you can test the complete frontend pipeline with our simulated showcase preview.
                    </p>
                  </div>
                </div>
                <div className="offline-demo-actions">
                  <Button
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    onClick={() => handleGenerateLook(true)}
                  >
                    Run Preview Simulation
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleResetTryOn}
                  >
                    Return to Preview
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* STATE 1 — READY */
          <div className="try-on-ready-view animate-fade-in">
            {/* The Two Preview Panels (Photo & Outfit) */}
            <TryOnPreview
              photo={photo}
              outfit={selectedOutfit}
              onPhotoFileChange={handlePhotoFileChange}
              onPhotoCaptured={handlePhotoCaptured}
            />

            {/* Prominent Generate CTA Bar */}
            <div className="generate-cta-bar card-premium">
              <div className="generate-cta-info">
                <span className="generate-cta-title">Ready to tailor silhouette</span>
                <p className="generate-cta-desc">
                  {photo.previewUrl
                    ? 'Silhouette reference is configured. Start the digital fitting preview.'
                    : 'Please provide a silhouette photograph in Panel 01 to unlock the virtual fitting.'}
                </p>
              </div>

              <div className="generate-cta-btn-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  disabled={!isReadyToGenerate}
                  onClick={() => handleGenerateLook(false)}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="btn-generate-main"
                >
                  Tailor & Preview Fitting
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

