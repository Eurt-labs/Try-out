import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, User, Camera, Check } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { photo } = useApp();
  const { user: authUser, profile } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Catalogue' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/account', label: 'Studio & Looks' }
  ];

  const displayName = profile?.name || authUser?.email?.split('@')[0] || 'Account';
  const displayAvatar = profile?.avatarUrl;

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="TRY IT OUT Homepage">
          <div className="brand-mark">
            <span className="brand-monogram">T·O</span>
          </div>
          <div className="brand-titles">
            <span className="brand-name">TRY IT OUT</span>
            <span className="brand-tagline">DIGITAL FITTING ROOM</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions / User Status */}
        <div className="navbar-actions">
          {/* Photo Readiness Pill */}
          {photo.previewUrl ? (
            <Link to="/try-on/outfit-01" className="nav-photo-pill" title="Portrait loaded for virtual fitting">
              <span className="nav-photo-thumb-wrap">
                <img src={photo.previewUrl} alt="Active silhouette reference" className="nav-photo-thumb" />
                <span className="nav-photo-check"><Check size={9} /></span>
              </span>
              <span className="nav-photo-text">Silhouette Active</span>
            </Link>
          ) : (
            <Link to="/setup" className="nav-setup-link">
              <Camera size={14} />
              <span>Add Silhouette</span>
            </Link>
          )}

          {/* Account Profile Avatar */}
          <Link to="/account" className="nav-avatar-btn" aria-label="User Account" title={displayName}>
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="nav-avatar-img" />
            ) : (
              <div className="nav-avatar-fallback">
                <User size={16} />
              </div>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer animate-fade-in" role="dialog" aria-modal="true">
          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                    }
                    onClick={closeMobileMenu}
                    end={link.to === '/'}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li className="mobile-nav-divider"></li>
              <li>
                <Link
                  to="/setup"
                  className="mobile-nav-link mobile-nav-setup"
                  onClick={closeMobileMenu}
                >
                  <Camera size={16} />
                  <span>Update Fitting Photo</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
