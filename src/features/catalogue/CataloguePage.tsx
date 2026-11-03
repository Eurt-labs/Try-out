import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection } from './HeroSection';
import { PhotoUpload } from '../photo-upload/PhotoUpload';
import { OutfitGrid } from './OutfitGrid';
import { Camera } from 'lucide-react';
import './CataloguePage.css';

export function CataloguePage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const handleScrollToCatalogue = () => {
    const el = document.getElementById('catalogue-browse');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="catalogue-page-root animate-fade-in">
      {/* Hero Section */}
      <HeroSection onExploreClick={handleScrollToCatalogue} />

      {/* Core Photo Upload Station */}
      <section className="photo-station-section" aria-label="Photo Upload Station">
        <div className="container">
          <div className="station-header">
            <div className="accent-pill">
              <Camera size={13} /> Step 01
            </div>
            <h2 className="station-title">Personalize Your Fitting Room</h2>
            <p className="station-subtitle">
              Upload your photo once — our neural model maps every garment to your physique in real-time.
            </p>
          </div>

          <div className="station-upload-wrapper">
            <PhotoUpload />
          </div>
        </div>
      </section>

      {/* Outfits Grid */}
      <OutfitGrid initialCategory={initialCategory} />
    </div>
  );
}

