import React, { createContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { DEMO_USER } from '../data/demoOutfits';
import { Outfit, PhotoState, TryOnState, SavedLook, ToastMessage, UserProfile, TryOnStatus } from '../types';

const STORAGE_KEY_SETUP = 'try_it_out_setup_completed';
const STORAGE_KEY_SAVED_LOOKS = 'try_it_out_saved_looks';

export interface AppState {
  user: UserProfile;
  photo: PhotoState;
  selectedOutfit: Outfit | null;
  tryOn: TryOnState;
  setupCompleted: boolean;
  savedLooks: SavedLook[];
  toast: ToastMessage | null;
}

export type AppAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_PHOTO'; payload: Partial<PhotoState> }
  | { type: 'REMOVE_PHOTO' }
  | { type: 'SET_SELECTED_OUTFIT'; payload: Outfit | null }
  | { type: 'SET_TRY_ON_STATUS'; payload: { status: TryOnStatus; error?: string | null } }
  | { type: 'SET_TRY_ON_SUCCESS'; payload: { resultUrl: string; source?: string; isDemoResult?: boolean; aiStylingAdvice?: string | null } }
  | { type: 'SET_TRY_ON_ERROR'; payload: string }
  | { type: 'RESET_TRY_ON' }
  | { type: 'SET_SETUP_COMPLETED'; payload: boolean }
  | { type: 'SAVE_LOOK'; payload: SavedLook }
  | { type: 'REMOVE_SAVED_LOOK'; payload: string }
  | { type: 'SHOW_TOAST'; payload: { message: string; type?: 'success' | 'error' | 'info'; duration?: number } }
  | { type: 'HIDE_TOAST' };

export interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  setPhoto: (photoData: Partial<PhotoState>) => void;
  removePhoto: () => void;
  setSelectedOutfit: (outfit: Outfit | null) => void;
  setSetupCompleted: (completed: boolean) => void;
  saveLook: (look: SavedLook) => void;
  removeSavedLook: (lookId: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
  hideToast: () => void;
}

const initialState: AppState = {
  user: DEMO_USER,
  photo: {
    file: null,
    previewUrl: null,
    assetId: null,
    backendUploaded: false,
    source: null
  },
  selectedOutfit: null,
  tryOn: {
    status: 'idle',
    resultUrl: null,
    error: null,
    source: null,
    isDemoResult: false
  },
  setupCompleted: (() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SETUP) === 'true';
    } catch {
      return false;
    }
  })(),
  savedLooks: (() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_LOOKS);
      return stored ? (JSON.parse(stored) as SavedLook[]) : [];
    } catch {
      return [];
    }
  })(),
  toast: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_PHOTO': {
      // Revoke prior object URL if created locally and changing
      if (state.photo.previewUrl && state.photo.previewUrl.startsWith('blob:') && state.photo.previewUrl !== action.payload.previewUrl) {
        try {
          URL.revokeObjectURL(state.photo.previewUrl);
        } catch (e) {
          console.debug('Failed to revoke object URL', e);
        }
      }
      return {
        ...state,
        photo: {
          file: action.payload.file ?? null,
          previewUrl: action.payload.previewUrl ?? null,
          assetId: action.payload.assetId ?? null,
          backendUploaded: Boolean(action.payload.backendUploaded),
          source: action.payload.source ?? 'client'
        }
      };
    }

    case 'REMOVE_PHOTO': {
      if (state.photo.previewUrl && state.photo.previewUrl.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(state.photo.previewUrl);
        } catch (e) {
          console.debug('Failed to revoke object URL', e);
        }
      }
      return {
        ...state,
        photo: {
          file: null,
          previewUrl: null,
          assetId: null,
          backendUploaded: false,
          source: null
        },
        tryOn: {
          ...state.tryOn,
          status: 'idle',
          resultUrl: null,
          error: null
        }
      };
    }

    case 'SET_SELECTED_OUTFIT':
      return {
        ...state,
        selectedOutfit: action.payload,
        tryOn: {
          status: 'idle',
          resultUrl: null,
          error: null,
          source: null,
          isDemoResult: false
        }
      };

    case 'SET_TRY_ON_STATUS':
      return {
        ...state,
        tryOn: {
          ...state.tryOn,
          status: action.payload.status,
          error: action.payload.error ?? null
        }
      };

    case 'SET_TRY_ON_SUCCESS':
      return {
        ...state,
        tryOn: {
          status: 'success',
          resultUrl: action.payload.resultUrl,
          error: null,
          source: action.payload.source ?? 'backend',
          isDemoResult: Boolean(action.payload.isDemoResult),
          aiStylingAdvice: action.payload.aiStylingAdvice ?? null
        }
      };

    case 'SET_TRY_ON_ERROR':
      return {
        ...state,
        tryOn: {
          status: 'error',
          resultUrl: null,
          error: action.payload,
          source: null,
          isDemoResult: false
        }
      };

    case 'RESET_TRY_ON':
      return {
        ...state,
        tryOn: {
          status: 'idle',
          resultUrl: null,
          error: null,
          source: null,
          isDemoResult: false
        }
      };

    case 'SET_SETUP_COMPLETED': {
      try {
        localStorage.setItem(STORAGE_KEY_SETUP, action.payload ? 'true' : 'false');
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return { ...state, setupCompleted: action.payload };
    }

    case 'SAVE_LOOK': {
      const exists = state.savedLooks.some(l => l.id === action.payload.id);
      const updated = exists ? state.savedLooks : [action.payload, ...state.savedLooks];
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_LOOKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return { ...state, savedLooks: updated };
    }

    case 'REMOVE_SAVED_LOOK': {
      const updated = state.savedLooks.filter(l => l.id !== action.payload);
      try {
        localStorage.setItem(STORAGE_KEY_SAVED_LOOKS, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
      return { ...state, savedLooks: updated };
    }

    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          id: Date.now(),
          message: action.payload.message,
          type: action.payload.type || 'info',
          duration: action.payload.duration || 4000
        }
      };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto hide toast after duration
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, state.toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 4000) => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type, duration } });
  }, []);

  const hideToast = useCallback(() => {
    dispatch({ type: 'HIDE_TOAST' });
  }, []);

  const setPhoto = useCallback((photoData: Partial<PhotoState>) => {
    dispatch({ type: 'SET_PHOTO', payload: photoData });
  }, []);

  const removePhoto = useCallback(() => {
    dispatch({ type: 'REMOVE_PHOTO' });
    showToast('Photograph removed', 'info');
  }, [showToast]);

  const setSelectedOutfit = useCallback((outfit: Outfit | null) => {
    dispatch({ type: 'SET_SELECTED_OUTFIT', payload: outfit });
  }, []);

  const setSetupCompleted = useCallback((completed: boolean) => {
    dispatch({ type: 'SET_SETUP_COMPLETED', payload: completed });
  }, []);

  const saveLook = useCallback((look: SavedLook) => {
    dispatch({ type: 'SAVE_LOOK', payload: look });
    showToast('Look saved to your account collection!', 'success');
  }, [showToast]);

  const removeSavedLook = useCallback((lookId: string) => {
    dispatch({ type: 'REMOVE_SAVED_LOOK', payload: lookId });
    showToast('Look removed from saved collection', 'info');
  }, [showToast]);

  const value: AppContextType = {
    ...state,
    dispatch,
    setPhoto,
    removePhoto,
    setSelectedOutfit,
    setSetupCompleted,
    saveLook,
    removeSavedLook,
    showToast,
    hideToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

