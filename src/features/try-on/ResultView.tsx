import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Bookmark, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Button } from '../../components/common/Button';
import { Outfit } from '../../types';
import './ResultView.css';

export interface ResultViewProps {
  resultUrl: string;
  outfit: Outfit | null;
  originalPhotoUrl?: string | null;
  isDemoResult?: boolean;
  aiStylingAdvice?: string | null;
  onChangePhoto?: () => void;
}

export function ResultView({
  resultUrl,
  outfit,
  originalPhotoUrl,
  isDemoResult = false,
  aiStylingAdvice,
  onChangePhoto
}: ResultViewProps) {
  const navigate = useNavigate();
  const { saveLook, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'result' | 'compare' | 'garment'>('result');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveLook = () => {
    if (!outfit) return;
    saveLook({
      id: `look_${Date.now()}`,
      outfitId: outfit.id,
      outfitName: outfit.name,
      outfitCategory: outfit.category,
      outfitImage: outfit.image,
      resultUrl,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    });
    setIsSaved(true);
    showToast('Look saved to your studio archive', 'success');
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `fitting-${outfit?.name ? outfit.name.toLowerCase().replace(/\s+/g, '-') : 'look'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Image downloaded to your device', 'success');
    } catch {
      showToast('Unable to download image automatically. Right-click to save.', 'info');
    }
  };

  return (
    <div className="result-view-container animate-fade-scale">
      {/* Top Banner if Demo Result */}
      {isDemoResult && (
        <div className="demo-notice-banner" role="status">
          <AlertCircle size={15} />
          <span>
            <strong>Showcase Preview Mode:</strong> Backend server unreachable. Displaying reference digital garment preview.
          </span>
        </div>
      )}

      {/* Result Card Header */}
      <div className="result-header">
        <div className="result-header-text">
          <div className="accent-pill">
            Fitting Complete
          </div>
          <h2 className="result-title">Digital Fitting Preview</h2>
          <p className="result-subtext">
            Calibrated silhouette for <strong>{outfit?.name}</strong>.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="result-view-switcher" role="tablist">
          <button
            type="button"
            className={`switcher-tab ${activeTab === 'result' ? 'switcher-tab-active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            Digital Look
          </button>
          <button
            type="button"
            className={`switcher-tab ${activeTab === 'compare' ? 'switcher-tab-active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            className={`switcher-tab ${activeTab === 'garment' ? 'switcher-tab-active' : ''}`}
            onClick={() => setActiveTab('garment')}
          >
            Garment Detail
          </button>
        </div>
      </div>

      {/* Minimal Studio Styling Notes */}
      {aiStylingAdvice && (
        <div className="styling-notes-card">
          <span className="styling-notes-label">STUDIO PAIRING & FIT NOTES</span>
          <p className="styling-notes-text">{aiStylingAdvice}</p>
        </div>
      )}

      {/* Main Image Stage */}
      <div className="result-stage">
        {activeTab === 'result' && (
          <div className="result-main-image-wrap animate-fade-in">
            <img
              src={resultUrl}
              alt="Generated virtual try-on look"
              className="result-main-img"
            />
            <div className="result-watermark-pill">
              DIGITAL FITTING ROOM
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="result-compare-grid animate-fade-in">
            <div className="compare-card">
              <span className="compare-label">Silhouette Reference</span>
              <div className="compare-img-wrap">
                <img src={originalPhotoUrl || ''} alt="Original uploaded portrait" className="compare-img" />
              </div>
            </div>
            <div className="compare-card highlight">
              <span className="compare-label">Fitted Look</span>
              <div className="compare-img-wrap">
                <img src={resultUrl} alt="Fitted garment" className="compare-img" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'garment' && (
          <div className="result-garment-view animate-fade-in">
            <div className="garment-card-img-wrap">
              <img src={outfit?.image} alt={outfit?.name} className="garment-detail-img" />
            </div>
            <div className="garment-meta-card">
              <span className="garment-category">{outfit?.category}</span>
              <h3 className="garment-name">{outfit?.name}</h3>
              <p className="garment-desc">{outfit?.description}</p>
              <div className="garment-specs">
                <div className="spec-row">
                  <span className="spec-label">Fabric</span>
                  <span className="spec-val">{outfit?.fabric || 'Luxury blend'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Fit</span>
                  <span className="spec-val">{outfit?.fit || 'Tailored'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Season</span>
                  <span className="spec-val">{outfit?.season || 'All season'}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div className="result-actions-toolbar">
        <div className="result-primary-actions">
          <Button
            variant="primary"
            size="md"
            icon={Download}
            onClick={handleDownload}
          >
            Download Look
          </Button>

          <Button
            variant={isSaved ? 'outline' : 'secondary'}
            size="md"
            icon={Bookmark}
            onClick={handleSaveLook}
            disabled={isSaved}
          >
            {isSaved ? 'Saved in Archive' : 'Save to Archive'}
          </Button>
        </div>

        <div className="result-secondary-actions">
          <Button
            variant="ghost"
            size="md"
            icon={RefreshCw}
            onClick={onChangePhoto}
          >
            Change Silhouette
          </Button>

          <Button
            variant="ghost"
            size="md"
            icon={ArrowLeft}
            onClick={() => navigate('/')}
          >
            Back to Catalogue
          </Button>
        </div>
      </div>
    </div>
  );
}
