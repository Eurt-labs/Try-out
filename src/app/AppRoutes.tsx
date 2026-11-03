import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CataloguePage } from '../features/catalogue/CataloguePage';
import { TryOnPage } from '../features/try-on/TryOnPage';
import { HowItWorksPage } from '../features/how-it-works/HowItWorksPage';
import { SetupPage } from '../features/setup/SetupPage';
import { AccountPage } from '../features/account/AccountPage';
import { Button } from '../components/common/Button';
import { Compass } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="container text-center" style={{ padding: '6rem 1.5rem' }}>
      <div className="accent-pill" style={{ margin: '0 auto 1.5rem' }}>
        404 Not Found
      </div>
      <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
        Look Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem' }}>
        The page or outfit you requested does not exist or has been relocated in our collection.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg" icon={Compass}>
          Return to Catalogue
        </Button>
      </Link>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/try-on/:outfitId" element={<TryOnPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
