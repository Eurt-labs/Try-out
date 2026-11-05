import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import './HeroSection.css';

export interface HeroSectionProps {
  onExploreClick?: () => void;
}

export function HeroSection({ onExploreClick }: HeroSectionProps) {
  return (
    <section className="hero-section" aria-label="Digital Fitting Studio Introduction">
      <div className="container hero-container">
        {/* Left Column: Editorial Typography & Actions */}
        <div className="hero-content animate-fade-up">
          <div className="hero-accent-tag">
            <span className="hero-tag-dot"></span>
            <span>Digital Fitting Studio — Edition 01</span>
          </div>

          <h1 className="hero-headline">
            Your Silhouette.<br />
            <span className="hero-headline-italic">Tailored Virtually.</span>
          </h1>

          <p className="hero-subheading">
            Preview luxury garments calibrated to your posture before you wear them. Upload your silhouette reference, explore the curated catalogue, and experience precision drape without the trial room.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore Catalogue
            </Button>
            <Link to="/how-it-works">
              <Button variant="secondary" size="lg" icon={ArrowUpRight} iconPosition="right">
                How It Works
              </Button>
            </Link>
          </div>

          {/* Minimalist Editorial Metrics */}
          <div className="hero-metrics">
            <div className="hero-metric-item">
              <span className="metric-index">01</span>
              <span className="metric-value">Private</span>
              <span className="metric-label">Local session privacy</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric-item">
              <span className="metric-index">02</span>
              <span className="metric-value">Adaptive</span>
              <span className="metric-label">Silhouette & drape alignment</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric-item">
              <span className="metric-index">03</span>
              <span className="metric-value">Curated</span>
              <span className="metric-label">Tailored luxury fabrics</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pristine Editorial Frame */}
        <div className="hero-visual-column animate-fade-scale delay-100">
          <div className="hero-editorial-card">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="Minimalist fashion editorial silhouette"
                className="hero-main-img"
              />
              <div className="hero-caption-overlay">
                <span className="hero-caption-edition">STUDIO EDITION</span>
                <span className="hero-caption-title">Monochrome Tailoring & Structured Knits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
