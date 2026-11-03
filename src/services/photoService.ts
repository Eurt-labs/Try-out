import { apiClient } from './apiClient';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export interface PhotoValidationResult {
  valid: boolean;
  error: string | null;
}

export interface PhotoUploadResult {
  assetId: string;
  url: string;
  backendUploaded: boolean;
  source: 'backend' | 'client-session';
}

interface UploadApiResponse {
  assetId?: string;
  id?: string;
  url?: string;
}

export const photoService = {
  /**
   * Validate file locally before any network transfer
   */
  validatePhoto(file: File | null): PhotoValidationResult {
    if (!file) {
      return { valid: false, error: 'No image file was provided.' };
    }

    if (!ACCEPTED_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: 'Unsupported image format. Please upload a JPG, JPEG, PNG, or WebP photo.'
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Photo exceeds the maximum allowed file size of 10MB (Selected size: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Upload image to backend
   * If backend is active, uploads via multipart/form-data to /api/photos/upload
   * If backend is offline, produces a clean local photo session reference
   */
  async uploadPhoto(file: File): Promise<PhotoUploadResult> {
    const validation = this.validatePhoto(file);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid file');
    }

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await apiClient.post<UploadApiResponse>('/api/photos/upload', formData, { timeout: 10000 });
      if (response && (response.assetId || response.url || response.id)) {
        return {
          assetId: response.assetId || response.id || `uploaded_${Date.now()}`,
          url: response.url || URL.createObjectURL(file),
          backendUploaded: true,
          source: 'backend'
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.info('[photoService] Backend upload endpoint inactive, maintaining client-side session photo:', msg);
    }

    // Local photo state with object URL
    const localUrl = URL.createObjectURL(file);
    return {
      assetId: `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      url: localUrl,
      backendUploaded: false,
      source: 'client-session'
    };
  }
};

