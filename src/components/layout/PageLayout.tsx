import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toast } from '../common/Toast';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Toast />
      <Navbar />
      <main style={{ flex: '1 0 auto' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

