import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import './HeroSection.css';

export function HeroSection({ onExploreClick }) {
  return (
    <section className="hero-section" aria-label="Hero Introduction">
      <div className="container hero-container">
        {/* Left Column: Typography & CTAs */}
        <div className="hero-content animate-fade-up">
          <div className="hero-accent-tag">
            <Sparkles size={14} className="hero-sparkle-icon" />
            <span>Virtual Fitting Room Revolution</span>
          </div>

          <h1 className="hero-headline">
            Your Style.<br />
            <span className="hero-headline-gradient">Your Look.</span>
          </h1>

          <p className="hero-subheading">
            Discover your next look. Try it virtually before you wear it. Upload your picture, explore designer collections, and visualize how outfits fit your silhouette effortlessly.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="lg"
              onClick={onExploreClick}
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore Collection
            </Button>
            <Link to="/how-it-works">
              <Button variant="secondary" size="lg" icon={PlayCircle}>
                How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof / Metrics */}
          <div className="hero-metrics">
            <div className="hero-metric-item">
              <span className="metric-value">Zero</span>
              <span className="metric-label">Trial Room Hassle</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric-item">
              <span className="metric-value">Instant</span>
              <span className="metric-label">AI Photorealistic Fit</span>
            </div>
            <div className="hero-metric-divider"></div>
            <div className="hero-metric-item">
              <span className="metric-value">Private</span>
              <span className="metric-label">Session Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Visual Showcase */}
        <div className="hero-visual-column animate-fade-scale delay-200">
          <div className="hero-editorial-card">
            <div className="hero-image-wrap">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="High fashion editorial model"
                className="hero-main-img"
              />
              <div className="hero-glass-badge">
                <span className="hero-badge-dot"></span>
                <span className="hero-badge-title">Virtual Try-On Active</span>
              </div>
            </div>

            {/* Floating Stat Cards */}
            <div className="hero-floating-card floating-card-top animate-float">
              <div className="floating-card-icon">
                <Sparkles size={18} />
              </div>
              <div className="floating-card-text">
                <span className="floating-title">AI Fabric Drape</span>
                <span className="floating-sub">Precision cloth physics</span>
              </div>
            </div>

            <div className="hero-floating-card floating-card-bottom">
              <div className="floating-card-icon success">
                <CheckCircle2 size={18} />
              </div>
              <div className="floating-card-text">
                <span className="floating-title">Perfect Proportion</span>
                <span className="floating-sub">Calibrated to body posture</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
