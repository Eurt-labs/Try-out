import { apiClient, ApiError } from './apiClient';
import { TryOnApiResponse } from '../types';

export interface GenerateTryOnParams {
  photoAssetId?: string | null;
  outfitId: string;
  photoFile?: File | null;
}

interface TryOnJobPollResponse {
  status: 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
}

/**
 * Service to execute Virtual Try-On requests against the backend.
 * Handles request submission, status polling for async jobs, and error states.
 */
export const tryOnService = {
  /**
   * Submit try-on request with user photograph reference and outfit ID
   */
  async generateTryOn({ photoAssetId, outfitId, photoFile }: GenerateTryOnParams): Promise<TryOnApiResponse> {
    if (!outfitId) {
      throw new Error('Please select an outfit from the catalogue first.');
    }
    if (!photoAssetId && !photoFile) {
      throw new Error('Please upload your photo before generating a try-on.');
    }

    // Prepare payload
    let body: FormData | { outfitId: string; photoAssetId?: string | null };
    if (photoFile instanceof File) {
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('outfitId', outfitId);
      if (photoAssetId) formData.append('assetId', photoAssetId);
      body = formData;
    } else {
      body = {
        outfitId,
        photoAssetId
      };
    }

    try {
      // Send request to backend try-on endpoint
      const response = await apiClient.post<TryOnApiResponse>('/api/try-on', body, { timeout: 35000 });

      // Handle direct completed response
      if (response && response.resultUrl) {
        return {
          status: 'success',
          resultUrl: response.resultUrl,
          jobId: response.jobId,
          source: 'backend',
          timestamp: new Date().toISOString()
        };
      }

      // Handle asynchronous task / job polling
      if (response && response.jobId && response.status === 'processing') {
        return await this.pollJobStatus(response.jobId);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[tryOnService] Backend try-on request error:', msg);

      return {
        status: 'demo_fallback',
        error: `Backend at ${apiClient.baseUrl} is currently offline or unreachable (${msg}).`,
        allowDemoPreview: true
      };
    }

    throw new Error('Unexpected response structure received from virtual try-on server.');
  },

  /**
   * Poll status for async try-on processing
   */
  async pollJobStatus(jobId: string, maxAttempts: number = 15, intervalMs: number = 2000): Promise<TryOnApiResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise(r => setTimeout(r, intervalMs));
      try {
        const statusRes = await apiClient.get<TryOnJobPollResponse>(`/api/try-on/status/${jobId}`);
        if (statusRes.status === 'completed' && statusRes.resultUrl) {
          return {
            status: 'success',
            resultUrl: statusRes.resultUrl,
            jobId,
            source: 'backend',
            timestamp: new Date().toISOString()
          };
        }
        if (statusRes.status === 'failed') {
          throw new Error(statusRes.error || 'Backend AI generation encountered an error.');
        }
      } catch (pollErr: unknown) {
        const apiErr = pollErr as ApiError;
        if (apiErr.status === 404 || apiErr.code === 'TIMEOUT') {
          continue;
        }
        throw pollErr;
      }
    }
    throw new Error('Try-on processing timed out while waiting for AI generation.');
  }
};

