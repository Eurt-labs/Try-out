/**
 * Type definitions for TRY IT OUT Virtual Try-On Platform
 */

export type Category = 
  | 'All'
  | 'Casual'
  | 'Formal'
  | 'Traditional'
  | 'Streetwear'
  | 'Party Wear'
  | string;

export interface Outfit {
  id: string;
  name: string;
  category: string;
  gender: string;
  image: string;
  price: string;
  description: string;
  fabric: string;
  fit: string;
  season: string;
  tags: string[];
}

export interface UserPreferences {
  preferredCategory: string;
  genderPreference: string;
  notifications?: boolean;
  highQualityRender?: boolean;
}

export interface UserStats {
  tryOnsCompleted: number;
  savedLooks: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  memberSince?: string;
  tier?: string;
  preferences?: UserPreferences;
  stats?: UserStats;
}

export interface PhotoState {
  file: File | null;
  previewUrl: string | null;
  assetId: string | null;
  backendUploaded: boolean;
  source: 'camera' | 'upload' | 'client' | 'backend' | string | null;
}

export type TryOnStatus = 'idle' | 'generating' | 'success' | 'error' | 'demo_fallback';

export interface TryOnState {
  status: TryOnStatus;
  resultUrl: string | null;
  error: string | null;
  source: string | null;
  isDemoResult: boolean;
}

export interface SavedLook {
  id: string;
  userId?: string;
  outfitId: string;
  outfitName: string;
  outfitCategory?: string;
  outfitImage?: string;
  resultUrl: string;
  createdAt: string;
  notes?: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  tier?: string;
}

export interface ApiCatalogueResponse {
  outfits?: Outfit[];
  categories?: string[];
}

export interface TryOnApiResponse {
  status: 'success' | 'processing' | 'failed' | 'demo_fallback';
  resultUrl?: string;
  jobId?: string;
  error?: string;
  source?: string;
  allowDemoPreview?: boolean;
  timestamp?: string;
}

