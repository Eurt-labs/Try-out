import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Compass, Shirt, Layers, ArrowRight, CheckCircle2, Sun, Eye, ShieldCheck, LucideIcon } from 'lucide-react';
import { Button } from '../../components/common/Button';
import './HowItWorksPage.css';

interface StepItem {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  image: string;
  highlight: string;
}

const STEPS: StepItem[] = [
  {
    step: '01',
    title: 'Upload Silhouette',
    subtitle: 'Clear portrait reference',
    description: 'Provide a clear photograph of yourself. Our system maps your posture, shoulder width, and silhouette to create your personalized fitting reference.',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    highlight: 'Front-facing portrait, natural posture'
  },
  {
    step: '02',
    title: 'Explore Collections',
    subtitle: 'Browse curated styles',
    description: 'Browse tailored apparel across casual wear, structured suiting, traditional collections, or evening outerwear.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    highlight: 'Curated studio garments'
  },
  {
    step: '03',
    title: 'Select Garment',
    subtitle: 'Inspect cuts and fabrics',
    description: 'Choose any outfit from the catalogue to see its tailored drape on your silhouette. Review cut specifications and luxury fabrics.',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    highlight: 'Detailed material specifications'
  },
  {
    step: '04',
    title: 'Preview Digital Fit',
    subtitle: 'Natural fabric drape',
    description: 'Generate your digital fitting preview and inspect how the garment contours to your frame, complete with editorial pairing advice.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    highlight: 'Side-by-side comparison'
  }
];

interface PhotoTipItem {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const PHOTO_TIPS: PhotoTipItem[] = [
  {
    title: 'Natural Lighting',
    desc: 'Shoot in diffuse daylight or a brightly lit indoor space without harsh backlights.',
    icon: Sun
  },
  {
    title: 'Neutral Pose',
    desc: 'Stand facing forward with arms slightly away from the torso for accurate cloth drape.',
    icon: Eye
  },
  {
    title: 'Uncluttered Background',
    desc: 'A plain wall or minimal background helps isolate your contours cleanly.',
    icon: Layers
  },
  {
    title: 'Session Privacy',
    desc: 'Your photos are only used to render your active try-on session and remain under your control.',
    icon: ShieldCheck
  }
];

export function HowItWorksPage() {
  return (
    <div className="how-it-works-root animate-fade-in">
      {/* Header */}
      <section className="hiw-hero-section">
        <div className="container text-center">
          <div className="accent-pill" style={{ margin: '0 auto 1.25rem' }}>
            Process Overview
          </div>
          <h1 className="hiw-main-heading">
            How The Digital Studio Works
          </h1>
          <p className="hiw-main-desc">
            Skip the fitting room queues. Discover how simple it is to test curated designer clothing with modern digital fitting technology.
          </p>
        </div>
      </section>

      {/* 4 Interactive Step Cards */}
      <section className="hiw-steps-section">
        <div className="container">
          <div className="hiw-steps-grid">
            {STEPS.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <div key={step.step} className="step-card card-premium animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="step-card-image-wrap">
                    <img src={step.image} alt={step.title} className="step-card-img" />
                    <div className="step-number-badge">
                      <span>{step.step}</span>
                    </div>
                  </div>

                  <div className="step-card-body">
                    <div className="step-card-icon-pill">
                      <IconComp size={14} />
                      <span>{step.subtitle}</span>
                    </div>

                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.description}</p>

                    <div className="step-card-highlight">
                      <CheckCircle2 size={13} className="text-success" />
                      <span>{step.highlight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Quality Guidance Section */}
      <section className="hiw-tips-section" id="tips">
        <div className="container">
          <div className="tips-header text-center">
            <h2 className="tips-title">Keys to an Accurate Digital Fitting</h2>
            <p className="tips-desc">
              Following these simple photography guidelines ensures clean drapery and exact proportions.
            </p>
          </div>

          <div className="tips-grid">
            {PHOTO_TIPS.map((tip) => {
              const TipIcon = tip.icon;
              return (
                <div key={tip.title} className="tip-card card-premium">
                  <div className="tip-icon-box">
                    <TipIcon size={20} />
                  </div>
                  <h4 className="tip-title">{tip.title}</h4>
                  <p className="tip-text">{tip.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Conversion CTA */}
      <section className="hiw-cta-section">
        <div className="container">
          <div className="hiw-cta-box card-premium">
            <div className="hiw-cta-content">
              <span className="accent-pill">Catalogue Ready</span>
              <h2 className="hiw-cta-headline">Ready to find your next look?</h2>
              <p className="hiw-cta-subtext">
                Browse our curated wardrobe and preview yourself in luxury outfits within seconds.
              </p>
            </div>
            <Link to="/">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explore Catalogue
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
