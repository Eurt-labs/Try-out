import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Badge } from '../../components/common/Badge';
import { Outfit } from '../../types';
import './OutfitCard.css';

export interface OutfitCardProps {
  outfit: Outfit;
}

export function OutfitCard({ outfit }: OutfitCardProps) {
  const navigate = useNavigate();
  const { setSelectedOutfit } = useApp();

  const handleTryOnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOutfit(outfit);
    navigate(`/try-on/${outfit.id}`);
  };

  const handleCardClick = () => {
    setSelectedOutfit(outfit);
    navigate(`/try-on/${outfit.id}`);
  };

  return (
    <article
      className="outfit-card card-premium animate-fade-in"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View outfit ${outfit.name}`}
    >
      {/* Image Container with Aspect Ratio */}
      <div className="outfit-image-wrap">
        <img
          src={outfit.image}
          alt={outfit.name}
          className="outfit-image"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="outfit-top-badges">
          <Badge variant="default" size="sm" className="outfit-category-badge">
            {outfit.category}
          </Badge>
          {outfit.gender && (
            <Badge variant="outline" size="sm" className="outfit-gender-badge">
              {outfit.gender}
            </Badge>
          )}
        </div>

        {/* Hover Quick Try-On Overlay Pill */}
        <div className="outfit-overlay-pill">
          <Sparkles size={14} className="sparkle-icon-animated" />
          <span>Click to Try On</span>
        </div>
      </div>

      {/* Outfit Information Content */}
      <div className="outfit-info-body">
        <div className="outfit-header-row">
          <h3 className="outfit-title" title={outfit.name}>
            {outfit.name}
          </h3>
          {outfit.price && (
            <span className="outfit-price">{outfit.price}</span>
          )}
        </div>

        {outfit.fabric && (
          <p className="outfit-fabric-detail">
            {outfit.fabric} • {outfit.fit || 'Regular Fit'}
          </p>
        )}

        {outfit.description && (
          <p className="outfit-desc-preview">
            {outfit.description}
          </p>
        )}

        {/* Bottom CTA Row */}
        <div className="outfit-card-footer">
          <button
            type="button"
            className="btn-try-outfit"
            onClick={handleTryOnClick}
            aria-label={`Try on ${outfit.name}`}
          >
            <Sparkles size={16} />
            <span>Try This Outfit</span>
            <ArrowRight size={15} className="arrow-icon-shift" />
          </button>
        </div>
      </div>
    </article>
  );
}

