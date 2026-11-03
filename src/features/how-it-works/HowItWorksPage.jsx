import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Compass, Shirt, Wand2, ArrowRight, CheckCircle2, Sparkles, Sun, Eye, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/common/Button';
import './HowItWorksPage.css';

const STEPS = [
  {
    step: '01',
    title: 'Upload Your Photo',
    subtitle: 'Start with a clear portrait',
    description: 'Start by uploading a clear photograph of yourself. Our system maps your posture, shoulder width, and silhouette to create your personalized virtual avatar.',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    highlight: 'Front-facing, clear lighting'
  },
  {
    step: '02',
    title: 'Explore Outfits',
    subtitle: 'Browse diverse designer styles',
    description: 'Browse different clothing styles and explore the available collection. Filter by casual wear, sharp business suits, traditional apparel, or evening statements.',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    highlight: 'Curated fashion categories'
  },
  {
    step: '03',
    title: 'Choose Your Outfit',
    subtitle: 'Pick what matches your style',
    description: 'Select the outfit you would like to see on yourself. Inspect garment details, premium fabrics, cut profiles, and seasonal versatility.',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    highlight: 'Instant studio alignment'
  },
  {
    step: '04',
    title: 'See Your New Look',
    subtitle: 'Experience realistic AI drape',
    description: 'Generate your virtual preview and discover how the outfit looks on you. Neural physics render cloth folds, shadows, and body contours seamlessly.',
    icon: Wand2,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    highlight: 'Photorealistic AI render'
  }
];

const PHOTO_TIPS = [
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
    desc: 'A plain wall or minimal background helps edge detection isolate your contours cleanly.',
    icon: Sparkles
  },
  {
    title: 'Session Privacy',
    desc: 'Your photos are only used to render your active try-on session and never sold or shared.',
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
            <Sparkles size={13} /> Intuitive 4-Step Process
          </div>
          <h1 className="hiw-main-heading">
            How Try It Out Works
          </h1>
          <p className="hiw-main-desc">
            Skip the fitting room queues. Discover how simple it is to virtually test designer clothing with modern AI.
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
                <div key={step.step} className="step-card card-premium animate-fade-up" style={{ animationDelay: `${idx * 120}ms` }}>
                  <div className="step-card-image-wrap">
                    <img src={step.image} alt={step.title} className="step-card-img" />
                    <div className="step-number-badge">
                      <span>{step.step}</span>
                    </div>
                  </div>

                  <div className="step-card-body">
                    <div className="step-card-icon-pill">
                      <IconComp size={16} />
                      <span>{step.subtitle}</span>
                    </div>

                    <h3 className="step-card-title">{step.title}</h3>
                    <p className="step-card-desc">{step.description}</p>

                    <div className="step-card-highlight">
                      <CheckCircle2 size={14} className="text-success" />
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
            <h2 className="tips-title">Keys to a Flawless Virtual Try-On</h2>
            <p className="tips-desc">
              Following these simple photography guidelines ensures our model synthesizes clean drapery and exact proportions.
            </p>
          </div>

          <div className="tips-grid">
            {PHOTO_TIPS.map((tip) => {
              const TipIcon = tip.icon;
              return (
                <div key={tip.title} className="tip-card card-premium">
                  <div className="tip-icon-box">
                    <TipIcon size={22} />
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
              <span className="accent-pill">Ready to begin?</span>
              <h2 className="hiw-cta-headline">Ready to find your next look?</h2>
              <p className="hiw-cta-subtext">
                Browse our curated wardrobe and preview yourself in luxury outfits within seconds.
              </p>
            </div>
            <Link to="/">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
