import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sparkles, Menu, X, User, Camera, Check } from 'lucide-react';
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
      setScrolled(window.scrollY > 15);
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
    { to: '/account', label: 'Account' }
  ];

  const displayName = profile?.name || authUser?.email?.split('@')[0] || 'User';
  const displayAvatar = profile?.avatarUrl;

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="TRY IT OUT Homepage">
          <div className="brand-mark">
            <Sparkles size={18} className="brand-sparkle" />
          </div>
          <div className="brand-titles">
            <span className="brand-name">TRY IT OUT</span>
            <span className="brand-tagline">VIRTUAL FASHION</span>
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
            <Link to="/try-on/outfit-01" className="nav-photo-pill" title="Photo ready for try-on">
              <span className="nav-photo-thumb-wrap">
                <img src={photo.previewUrl} alt="Your active photo" className="nav-photo-thumb" />
                <span className="nav-photo-check"><Check size={10} /></span>
              </span>
              <span className="nav-photo-text">Photo Ready</span>
            </Link>
          ) : (
            <Link to="/setup" className="nav-setup-link">
              <Camera size={15} />
              <span>Add Photo</span>
            </Link>
          )}

          {/* Account Profile Avatar */}
          <Link to="/account" className="nav-avatar-btn" aria-label="User Account" title={displayName}>
            {displayAvatar ? (
              <img src={displayAvatar} alt={displayName} className="nav-avatar-img" />
            ) : (
              <div className="nav-avatar-fallback">
                <User size={18} />
              </div>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animate-fade-down" aria-label="Mobile Navigation">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'mobile-nav-link-active' : ''}`
                  }
                  end={link.to === '/'}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mobile-nav-divider"></li>
            <li>
              <NavLink to="/setup" onClick={closeMobileMenu} className="mobile-nav-link">
                <Camera size={16} />
                <span>{photo.previewUrl ? 'Manage Photo' : 'First-time Setup'}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
