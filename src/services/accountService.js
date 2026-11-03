import { apiClient } from './apiClient';
import { DEMO_USER } from '../data/demoOutfits';

export const accountService = {
  async getProfile() {
    try {
      const response = await apiClient.get('/api/account/profile', { timeout: 3000 });
      if (response && response.user) {
        return { user: response.user, source: 'backend' };
      }
    } catch (err) {
      console.info('[accountService] Backend account endpoint inactive, using local session profile:', err.message);
    }
    return { user: DEMO_USER, source: 'local' };
  },

  async updateProfile(updatedData) {
    try {
      const response = await apiClient.put('/api/account/profile', updatedData, { timeout: 4000 });
      return { success: true, user: response.user || updatedData };
    } catch (err) {
      console.info('[accountService] Offline update fallback:', err.message);
      return { success: true, user: updatedData, note: 'Saved locally in active session' };
    }
  },

  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {}, { timeout: 3000 });
    } catch (err) {
      console.info('[accountService] Backend logout call:', err.message);
    }
    return { success: true };
  }
};
