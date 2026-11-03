import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Sparkles, Download, Bookmark, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    // Celebratory confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#7357E8', '#16A36A', '#F3F1EC']
      });
    } catch {
      // Ignore if confetti is unsupported
    }
  }, []);

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
  };

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = resultUrl;
      link.download = `try-it-out-${outfit?.name ? outfit.name.toLowerCase().replace(/\s+/g, '-') : 'look'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Look saved to your downloads folder', 'success');
    } catch {
      showToast('Unable to download image automatically. Right-click to save.', 'info');
    }
  };

  return (
    <div className="result-view-container animate-fade-scale">
      {/* Top Banner if Demo Result */}
      {isDemoResult && (
        <div className="demo-notice-banner" role="status">
          <AlertCircle size={16} />
          <span>
            <strong>Showcase Preview Mode:</strong> Backend server at VITE_API_BASE_URL is offline. Displaying high-fidelity virtual demonstration preview.
          </span>
        </div>
      )}

      {/* Result Card Header */}
      <div className="result-header">
        <div className="result-header-text">
          <div className="accent-pill success-pill">
            <CheckCircle2 size={13} /> Generation Complete
          </div>
          <h2 className="result-title">Your New Look is Ready!</h2>
          <p className="result-subtext">
            Here is your AI virtual fitting preview for <strong>{outfit?.name}</strong>.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="result-view-switcher" role="tablist">
          <button
            type="button"
            className={`switcher-tab ${activeTab === 'result' ? 'switcher-tab-active' : ''}`}
            onClick={() => setActiveTab('result')}
          >
            Virtual Look
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

      {/* Gemini AI Stylist Commentary */}
      {aiStylingAdvice && (
        <div style={{
          margin: '0.5rem 0 1.25rem 0',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(115, 87, 232, 0.08), rgba(22, 163, 106, 0.06))',
          border: '1px solid rgba(115, 87, 232, 0.25)',
          display: 'flex',
          gap: '0.85rem',
          alignItems: 'flex-start'
        }}>
          <Sparkles size={18} style={{ color: '#7357E8', marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7357E8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Gemini AI Stylist Recommendation
            </div>
            <div style={{ fontSize: '0.92rem', color: '#1e293b', marginTop: '0.25rem', lineHeight: 1.55 }}>
              {aiStylingAdvice}
            </div>
          </div>
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
              <Sparkles size={13} /> TRY IT OUT AI
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div className="result-compare-grid animate-fade-in">
            <div className="compare-card">
              <span className="compare-label">Original Photo</span>
              <div className="compare-img-wrap">
                <img src={originalPhotoUrl || ''} alt="Original uploaded portrait" className="compare-img" />
              </div>
            </div>
            <div className="compare-card highlight">
              <span className="compare-label accent">Generated Look</span>
              <div className="compare-img-wrap">
                <img src={resultUrl} alt="AI Virtual Fit" className="compare-img" />
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
            {isSaved ? 'Saved in Account' : 'Save to My Looks'}
          </Button>
        </div>

        <div className="result-secondary-actions">
          <Button
            variant="ghost"
            size="md"
            icon={RefreshCw}
            onClick={onChangePhoto}
          >
            Change Photo
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

