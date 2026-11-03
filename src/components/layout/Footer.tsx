import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="footer-root">
      <div className="container footer-container">
        {/* Top Feature Highlights Bar */}
        <div className="footer-features-bar">
          <div className="footer-feature-item">
            <Sparkles className="feature-icon" size={20} />
            <div>
              <span className="feature-title">AI Silhouette Matching</span>
              <span className="feature-desc">Preserves realistic drape and lighting</span>
            </div>
          </div>
          <div className="footer-feature-item">
            <Zap className="feature-icon" size={20} />
            <div>
              <span className="feature-title">Instant Visualization</span>
              <span className="feature-desc">Virtual trial room without physical fitting</span>
            </div>
          </div>
          <div className="footer-feature-item">
            <ShieldCheck className="feature-icon" size={20} />
            <div>
              <span className="feature-title">Private Session Guarantee</span>
              <span className="feature-desc">Your uploaded photos remain in your control</span>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Brand info */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <div className="brand-mark">
                <Sparkles size={18} />
              </div>
              <div className="brand-titles">
                <span className="brand-name">TRY IT OUT</span>
                <span className="brand-tagline">VIRTUAL FASHION</span>
              </div>
            </Link>
            <p className="footer-brand-desc">
              Your Style. Your Look. An AI-powered fashion platform designed to eliminate the friction of physical trial rooms and bring runway-grade outfit visualization to your personal device.
            </p>
            <div className="footer-badge">
              <span className="status-dot"></span>
              <span>FastAPI & Supabase Connected</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Collection</h4>
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
            <h4 className="footer-col-title">Platform</h4>
            <ul className="footer-links-list">
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/setup">First-time Setup</Link></li>
              <li><Link to="/try-on/outfit-01">Try-On Workspace</Link></li>
              <li><Link to="/account">My Account & Looks</Link></li>
            </ul>
          </div>

          {/* Philosophy / Guidelines */}
          <div className="footer-col">
            <h4 className="footer-col-title">Guidelines</h4>
            <ul className="footer-links-list">
              <li><Link to="/setup">Photo Requirements</Link></li>
              <li><Link to="/how-it-works#tips">Best Lighting Advice</Link></li>
              <li><span className="footer-static-link">Data Handling Policy</span></li>
              <li><span className="footer-static-link">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {CURRENT_YEAR} TRY IT OUT. Premium Virtual Fashion Experience. All rights reserved.
          </p>
          <div className="footer-crafted">
            <span>TypeScript • FastAPI • Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

