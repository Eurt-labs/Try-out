import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Zap } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Top Feature Highlights Bar */}
        <div className="footer-features-bar">
          <div className="footer-feature-item">
            <Layers className="feature-icon" size={18} />
            <div>
              <span className="feature-title">Silhouette Drape Alignment</span>
              <span className="feature-desc">Preserves natural posture and cloth physics</span>
            </div>
          </div>
          <div className="footer-feature-item">
            <Zap className="feature-icon" size={18} />
            <div>
              <span className="feature-title">Instant Digital Preview</span>
              <span className="feature-desc">Virtual trial room without physical fitting</span>
            </div>
          </div>
          <div className="footer-feature-item">
            <ShieldCheck className="feature-icon" size={18} />
            <div>
              <span className="feature-title">Private Session Guarantee</span>
              <span className="feature-desc">Silhouette references remain under your control</span>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="brand-mark">
                <span className="brand-monogram">T·O</span>
              </div>
              <div className="brand-titles">
                <span className="brand-name">TRY IT OUT</span>
                <span className="brand-tagline">DIGITAL FITTING ROOM</span>
              </div>
            </Link>
            <p className="footer-brand-desc">
              Your Silhouette. Tailored Virtually. A minimal fashion technology studio built to eliminate the friction of physical trial rooms and bring editorial outfit visualization to your screen.
            </p>
            <div className="footer-badge">
              <span className="status-dot"></span>
              <span>FastAPI & Supabase Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Catalogue</h4>
            <ul className="footer-links-list">
              <li><Link to="/?category=Casual">Casual Wear</Link></li>
              <li><Link to="/?category=Formal">Formal & Suiting</Link></li>
              <li><Link to="/?category=Traditional">Traditional Attire</Link></li>
              <li><Link to="/?category=Streetwear">Streetwear & Modern</Link></li>
              <li><Link to="/?category=Party Wear">Party & Evening</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Studio</h4>
            <ul className="footer-links-list">
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/setup">Silhouette Setup</Link></li>
              <li><Link to="/try-on/outfit-01">Fitting Workspace</Link></li>
              <li><Link to="/account">Studio Archive</Link></li>
            </ul>
          </div>

          {/* Philosophy / Guidelines */}
          <div className="footer-col">
            <h4 className="footer-col-title">Guidelines</h4>
            <ul className="footer-links-list">
              <li><Link to="/setup">Photo Standards</Link></li>
              <li><Link to="/how-it-works#tips">Lighting Advice</Link></li>
              <li><span className="footer-static-link">Privacy Standards</span></li>
              <li><span className="footer-static-link">Terms & Editions</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {CURRENT_YEAR} TRY IT OUT STUDIO. All rights reserved.
          </p>
          <div className="footer-crafted">
            <span>TypeScript • FastAPI • Antideploy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
