import { useState, useEffect, useCallback, useRef } from 'react';

import { profileApi } from './api';
import { uploadProfilePhoto, updatePhotoMetadata } from './slice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store/reduxHook';
import { useToast } from '@/components/ui/use-toast';

export const useProfilePhoto = (userId: string | number) => {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { photoMetadata, isUploading, uploadError, lastUploadSuccess } = useAppSelector(state => state.profile);

    // Local state for photo URL management
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Refs to track URLs for cleanup
    const photoUrlRef = useRef<string | null>(null);
    const previewUrlRef = useRef<string | null>(null);

    // Helper function to revoke URL safely
    const revokeUrl = useCallback((url: string | null) => {
        if (url) {
            try {
                URL.revokeObjectURL(url);
            } catch (error) {
                console.warn('Failed to revoke URL:', error);
            }
        }
    }, []);

    // Fetch photo from API
    const fetchPhoto = useCallback(async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const blob = await profileApi.get_photo(userId);

            if (blob) {
                // Revoke previous URL
                if (photoUrlRef.current) {
                    revokeUrl(photoUrlRef.current);
                }

                // Create new URL
                const newUrl = URL.createObjectURL(blob);
                photoUrlRef.current = newUrl;
                setPhotoUrl(newUrl);
            } else {
                setPhotoUrl(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch photo');
            setPhotoUrl(null);
        } finally {
            setIsLoading(false);
        }
    }, [userId, revokeUrl]);

    // Upload photo with preview
    const uploadPhoto = useCallback(async (file: File) => {
        // Create preview immediately
        if (previewUrlRef.current) {
            revokeUrl(previewUrlRef.current);
        }

        const preview = URL.createObjectURL(file);
        previewUrlRef.current = preview;
        setPreviewUrl(preview);

        // Prepare form data
        const formData = new FormData();
        formData.append("photo", file);

        try {
            const result = await dispatch(uploadProfilePhoto(formData));

            if (uploadProfilePhoto.fulfilled.match(result)) {
                // Clear preview
                if (previewUrlRef.current) {
                    revokeUrl(previewUrlRef.current);
                    previewUrlRef.current = null;
                }
                setPreviewUrl(null);

                // Fetch new photo
                await fetchPhoto();
            }
        } catch (err) {
            console.error('Upload failed:', err);
            // Clear preview on error
            if (previewUrlRef.current) {
                revokeUrl(previewUrlRef.current);
                previewUrlRef.current = null;
            }
            setPreviewUrl(null);
        }
    }, [dispatch, fetchPhoto, revokeUrl]);

    // Clear preview
    const clearPreview = useCallback(() => {
        if (previewUrlRef.current) {
            revokeUrl(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setPreviewUrl(null);
    }, [revokeUrl]);

    // Fetch photo on mount and when metadata changes
    useEffect(() => {
        fetchPhoto();
    }, [fetchPhoto, photoMetadata.lastUpdated]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (photoUrlRef.current) {
                revokeUrl(photoUrlRef.current);
            }
            if (previewUrlRef.current) {
                revokeUrl(previewUrlRef.current);
            }
        };
    }, [revokeUrl]);

    // Clear preview when upload completes
    useEffect(() => {
        if (!isUploading && previewUrl) {
            clearPreview();
        }
    }, [isUploading, previewUrl, clearPreview]);

    useEffect(() => {
        if (lastUploadSuccess) {
            toast({
                title: "Photo uploaded!",
                description: "Your profile photo has been updated.",
            });
        }
    }, [lastUploadSuccess, toast]);


    return {
        // Photo URLs
        photoUrl,
        previewUrl,

        // States
        isLoading,
        isUploading,
        error: error || uploadError,

        // Actions
        uploadPhoto,
        fetchPhoto,
        clearPreview,

        // Computed
        hasPhoto: Boolean(photoUrl),
        isAnyLoading: isLoading || isUploading,
        showPreview: Boolean(previewUrl),

        // Success message
        lastUploadSuccess
    };
};