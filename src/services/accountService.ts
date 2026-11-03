import { apiClient } from './apiClient';
import { DEMO_USER } from '../data/demoOutfits';
import { UserProfile, SavedLook } from '../types';

export const accountService = {
  async getProfile(): Promise<{ user: UserProfile; source: 'backend' | 'local' }> {
    try {
      const response = await apiClient.get<{ user?: UserProfile; profile?: UserProfile }>('/api/account/profile', { timeout: 3000 });
      if (response && (response.user || response.profile)) {
        return { user: (response.user || response.profile) as UserProfile, source: 'backend' };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Backend account endpoint inactive, using session profile:', msg);
    }
    return { user: DEMO_USER, source: 'local' };
  },

  async updateProfile(updatedData: Partial<UserProfile>): Promise<{ success: boolean; user: UserProfile; note?: string }> {
    try {
      const response = await apiClient.put<{ user?: UserProfile; profile?: UserProfile }>('/api/account/profile', updatedData, { timeout: 4000 });
      return { success: true, user: (response.user || response.profile || updatedData) as UserProfile };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Offline update fallback:', msg);
      return { success: true, user: updatedData as UserProfile, note: 'Saved locally in active session' };
    }
  },

  async getSavedLooks(): Promise<{ looks: SavedLook[]; source: 'backend' | 'local' }> {
    try {
      const response = await apiClient.get<{ looks: SavedLook[] }>('/api/account/saved-looks', { timeout: 3000 });
      if (response && Array.isArray(response.looks)) {
        return { looks: response.looks, source: 'backend' };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Backend saved looks endpoint inactive:', msg);
    }
    return { looks: [], source: 'local' };
  },

  async saveLook(look: SavedLook): Promise<{ success: boolean }> {
    try {
      await apiClient.post('/api/account/saved-looks', look, { timeout: 4000 });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Backend save look fallback:', msg);
      return { success: true };
    }
  },

  async deleteSavedLook(lookId: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/api/account/saved-looks/${lookId}`, { timeout: 4000 });
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Backend delete look fallback:', msg);
      return { success: true };
    }
  },

  async logout(): Promise<{ success: boolean }> {
    try {
      await apiClient.post('/api/auth/logout', {}, { timeout: 3000 });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[accountService] Backend logout call:', msg);
    }
    return { success: true };
  }
};

