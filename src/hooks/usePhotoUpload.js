import { useState, useCallback } from 'react';
import { useApp } from './useApp';
import { photoService } from '../services/photoService';

export function usePhotoUpload() {
  const { photo, setPhoto, removePhoto, showToast } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleProcessFile = useCallback(async (file) => {
    if (!file) return;

    setUploadError(null);
    const validation = photoService.validatePhoto(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      showToast(validation.error, 'error');
      return;
    }

    setIsUploading(true);

    try {
      const uploaded = await photoService.uploadPhoto(file);
      setPhoto({
        file,
        previewUrl: uploaded.url,
        assetId: uploaded.assetId,
        backendUploaded: uploaded.backendUploaded,
        source: uploaded.source
      });

      if (uploaded.backendUploaded) {
        showToast('Photo uploaded successfully to server!', 'success');
      } else {
        showToast('Photo selected and ready for virtual try-on', 'success');
      }
    } catch (err) {
      const msg = err.message || 'Failed to process photo';
      setUploadError(msg);
      showToast(msg, 'error');
    } finally {
      setIsUploading(false);
    }
  }, [setPhoto, showToast]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleProcessFile(file);
    }
  }, [handleProcessFile]);

  const handleFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleProcessFile(file);
    }
  }, [handleProcessFile]);

  return {
    photo,
    isDragging,
    isUploading,
    uploadError,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleProcessFile,
    removePhoto
  };
}
