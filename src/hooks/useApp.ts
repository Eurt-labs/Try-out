import { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

