import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { PageLayout } from '../components/layout/PageLayout';
import { AppRoutes } from './AppRoutes';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <PageLayout>
            <AppRoutes />
          </PageLayout>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
