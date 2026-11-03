import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Camera, Bookmark, Sliders, LogOut, ArrowRight, Mail, Trash2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { accountService } from '../../services/accountService';
import { PhotoUpload } from '../photo-upload/PhotoUpload';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import './AccountPage.css';

export function AccountPage() {
  const navigate = useNavigate();
  const { user, photo, savedLooks, removeSavedLook, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'photo' | 'looks' | 'preferences'
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    preferredCategory: user?.preferences?.preferredCategory || 'All',
    genderPreference: user?.preferences?.genderPreference || 'All Styles'
  });

  useEffect(() => {
    async function loadAccount() {
      setLoading(true);
      try {
        const res = await accountService.getProfile();
        if (res && res.user) {
          setProfileData(res.user);
          setFormData({
            name: res.user.name || '',
            email: res.user.email || '',
            preferredCategory: res.user.preferences?.preferredCategory || 'All',
            genderPreference: res.user.preferences?.genderPreference || 'All Styles'
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await accountService.updateProfile({
        ...profileData,
        name: formData.name,
        email: formData.email,
        preferences: {
          ...profileData.preferences,
          preferredCategory: formData.preferredCategory,
          genderPreference: formData.genderPreference
        }
      });
      setProfileData(res.user);
      setIsEditing(false);
      showToast('Profile information updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await accountService.logout();
      showToast('You have been logged out safely', 'info');
      navigate('/');
    } catch {
      showToast('Logout completed', 'info');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="account-page-root container">
        <Loader size="lg" message="Loading your account profile..." />
      </div>
    );
  }

  return (
    <div className="account-page-root animate-fade-in">
      <div className="container account-container">
        {/* Profile Header Card */}
        <section className="profile-header-card card-premium" aria-label="Profile Header">
          <div className="profile-header-main">
            <div className="profile-avatar-wrap">
              {profileData?.avatarUrl ? (
                <img src={profileData.avatarUrl} alt={profileData.name} className="profile-avatar-img" />
              ) : (
                <div className="profile-avatar-placeholder">
                  <User size={36} />
                </div>
              )}
              <span className="profile-badge-dot"></span>
            </div>

            <div className="profile-title-block">
              <div className="profile-name-row">
                <h1 className="profile-user-name">{profileData?.name || 'Fashion Member'}</h1>
                <Badge variant="accent" size="sm">
                  {profileData?.tier || 'Member'}
                </Badge>
              </div>

              <div className="profile-meta-row">
                <span className="profile-meta-item">
                  <Mail size={14} /> {profileData?.email || 'user@example.com'}
                </span>
                <span className="profile-meta-bullet">•</span>
                <span className="profile-meta-item">
                  Member since {profileData?.memberSince || '2026'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-header-actions">
            <Button
              variant="outline"
              size="sm"
              icon={LogOut}
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </section>

        {/* Tab Navigation Navigation */}
        <div className="account-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'personal'}
            className={`account-tab-btn ${activeTab === 'personal' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <User size={16} />
            <span>Personal Information</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'photo'}
            className={`account-tab-btn ${activeTab === 'photo' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            <Camera size={16} />
            <span>My Photo</span>
            {photo.previewUrl && <span className="tab-pill-dot"></span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'looks'}
            className={`account-tab-btn ${activeTab === 'looks' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('looks')}
          >
            <Bookmark size={16} />
            <span>Saved Looks ({savedLooks.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'preferences'}
            className={`account-tab-btn ${activeTab === 'preferences' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Sliders size={16} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Tab 1: Personal Information */}
        {activeTab === 'personal' && (
          <div className="account-tab-content card-premium animate-fade-in">
            <div className="tab-content-header">
              <div>
                <h3 className="tab-content-title">Personal Information</h3>
                <p className="tab-content-desc">Manage your basic profile details and preferences.</p>
              </div>
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
              )}
            </div>

            <form onSubmit={handleUpdateProfile} className="account-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="input-name" className="form-label">Full Name</label>
                  <input
                    id="input-name"
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-email" className="form-label">Email Address</label>
                  <input
                    id="input-email"
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="select-category" className="form-label">Preferred Style Category</label>
                  <select
                    id="select-category"
                    disabled={!isEditing}
                    value={formData.preferredCategory}
                    onChange={(e) => setFormData({ ...formData, preferredCategory: e.target.value })}
                    className="form-input"
                  >
                    <option value="All">All Categories</option>
                    <option value="Casual">Casual</option>
                    <option value="Formal">Formal</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Party Wear">Party Wear</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="select-gender" className="form-label">Fit & Silhouette Category</label>
                  <select
                    id="select-gender"
                    disabled={!isEditing}
                    value={formData.genderPreference}
                    onChange={(e) => setFormData({ ...formData, genderPreference: e.target.value })}
                    className="form-input"
                  >
                    <option value="All Styles">All Styles</option>
                    <option value="Women">Women's Tailoring</option>
                    <option value="Men">Men's Tailoring</option>
                    <option value="Unisex">Unisex / Relaxed</option>
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="form-actions-row">
                  <Button variant="ghost" size="md" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="md">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Tab 2: My Photo */}
        {activeTab === 'photo' && (
          <div className="account-tab-content card-premium animate-fade-in">
            <div className="tab-content-header">
              <div>
                <h3 className="tab-content-title">Your Try-On Photograph</h3>
                <p className="tab-content-desc">
                  This photo is used whenever you click "Generate My Look" across the catalogue.
                </p>
              </div>
            </div>

            <div className="account-photo-stage">
              <PhotoUpload compact={false} />
            </div>
          </div>
        )}

        {/* Tab 3: Saved Looks */}
        {activeTab === 'looks' && (
          <div className="account-tab-content card-premium animate-fade-in">
            <div className="tab-content-header">
              <div>
                <h3 className="tab-content-title">Saved Virtual Looks</h3>
                <p className="tab-content-desc">Review and download outfits you have previously tried on.</p>
              </div>
            </div>

            {savedLooks.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved looks yet"
                description="When you generate a virtual try-on in the studio, click 'Save to My Looks' to keep your favorite results here."
                actionLabel="Explore Catalogue"
                onAction={() => navigate('/')}
              />
            ) : (
              <div className="saved-looks-grid">
                {savedLooks.map((look) => (
                  <div key={look.id} className="saved-look-card card-premium">
                    <div className="saved-look-img-wrap">
                      <img src={look.resultUrl} alt={look.outfitName} className="saved-look-img" />
                    </div>
                    <div className="saved-look-body">
                      <div className="saved-look-meta">
                        <span className="saved-look-cat">{look.category}</span>
                        <span className="saved-look-date">{look.timestamp}</span>
                      </div>
                      <h4 className="saved-look-name">{look.outfitName}</h4>

                      <div className="saved-look-actions">
                        <Link to={`/try-on/${look.outfitId}`} className="btn-view-look">
                          Try Again <ArrowRight size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn-delete-look"
                          onClick={() => removeSavedLook(look.id)}
                          aria-label="Remove saved look"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Preferences */}
        {activeTab === 'preferences' && (
          <div className="account-tab-content card-premium animate-fade-in">
            <div className="tab-content-header">
              <div>
                <h3 className="tab-content-title">Account Preferences</h3>
                <p className="tab-content-desc">Customize your virtual try-on workflow.</p>
              </div>
            </div>

            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">High-Resolution Neural Render</span>
                  <p className="preference-desc">Enhances micro-textures and subtle folds at slight expense of processing time.</p>
                </div>
                <div className="toggle-placeholder">
                  <Badge variant="success" size="sm">Enabled</Badge>
                </div>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">Private Session Guarantee</span>
                  <p className="preference-desc">Automatically clears transient silhouette caches when your browser session ends.</p>
                </div>
                <div className="toggle-placeholder">
                  <Badge variant="accent" size="sm">Active</Badge>
                </div>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <span className="preference-title">Reduced Motion Animation</span>
                  <p className="preference-desc">Adapts web interface micro-interactions to respect your system accessibility preferences.</p>
                </div>
                <div className="toggle-placeholder">
                  <Badge variant="default" size="sm">System Default</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
