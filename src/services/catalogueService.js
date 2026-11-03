import { apiClient } from './apiClient';
import { DEMO_OUTFITS, CATEGORIES } from '../data/demoOutfits';

/**
 * Service to retrieve catalogue data from the backend.
 * Falls back to curated demo collection if backend API is not responding.
 */
export const catalogueService = {
  async getOutfits(category = 'All', searchQuery = '') {
    try {
      // Attempt backend endpoint
      const response = await apiClient.get(`/api/catalogue?category=${encodeURIComponent(category)}&search=${encodeURIComponent(searchQuery)}`, {
        timeout: 4000
      });

      if (response && Array.isArray(response.outfits)) {
        return {
          outfits: response.outfits,
          categories: response.categories || CATEGORIES,
          source: 'backend'
        };
      } else if (Array.isArray(response)) {
        return {
          outfits: response,
          categories: CATEGORIES,
          source: 'backend'
        };
      }
    } catch (err) {
      // Backend is either not yet running or endpoint not ready
      // Log for developer awareness while maintaining full UI functionality
      console.info('[catalogueService] Backend endpoint unreachable or pending, loading curated showcase data:', err.message);
    }

    // Filter demo data locally
    let filtered = [...DEMO_OUTFITS];

    if (category && category !== 'All') {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return {
      outfits: filtered,
      categories: CATEGORIES,
      source: 'showcase'
    };
  },

  async getOutfitById(id) {
    try {
      const response = await apiClient.get(`/api/catalogue/${id}`, { timeout: 4000 });
      if (response && response.id) {
        return { outfit: response, source: 'backend' };
      }
    } catch (err) {
      console.info(`[catalogueService] Backend item lookup fallback for ID ${id}:`, err.message);
    }

    const found = DEMO_OUTFITS.find(o => o.id === id);
    if (found) {
      return { outfit: found, source: 'showcase' };
    }
    throw new Error(`Outfit with id "${id}" was not found in the collection.`);
  }
};
