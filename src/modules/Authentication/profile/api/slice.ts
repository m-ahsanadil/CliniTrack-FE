import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
    GetUserProfile,
    GetUserProfileApiResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UploadPhotoResponse
} from "./types";
import { profileApi } from "./api";

export const getProfile = createAsyncThunk(
    'profile/get',
    async (_, { rejectWithValue }) => {
        try {
            const res: GetUserProfileApiResponse = await profileApi.getProfile();

            if (res.success) {
                return res.user;
            } else {
                return rejectWithValue(res.message);
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch profile');
        }
    }
);

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData: UpdateProfileRequest, { rejectWithValue }) => {
        try {
            const response: UpdateProfileResponse = await profileApi.update(profileData);

            if (response.success) {
                return response;
            } else {
                return rejectWithValue(response.message || 'Failed to update profile');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update profile');
        }
    }
);

// Async thunk for uploading profile photo
export const uploadProfilePhoto = createAsyncThunk(
    'profile/uploadPhoto',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response: UploadPhotoResponse = await profileApi.upload_photo(formData);

            if (response.success) {
                return {
                    success: true,
                    message: response.message,
                    userId: response.userId
                };
            } else {
                return rejectWithValue('Upload failed');
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Upload failed');
        }
    }
);

interface ProfileState {
    // Profile data
    // profile: UpdateProfileResponse['user'] | null;
    profile: GetUserProfile | null;


    // Photo metadata only - no blob URLs or blobs
    photoMetadata: {
        lastUpdated: string | null;
        userId: string | null;
    };

    // Loading states
    isFetching: boolean;
    isUpdating: boolean;
    isUploading: boolean;

    // Error states
    fetchError: string | null;
    updateError: string | null;
    uploadError: string | null;

    // Success states
    lastUploadSuccess: string | null;
}

const initialState: ProfileState = {
    profile: null,
    photoMetadata: {
        lastUpdated: null,
        userId: null
    },
    isFetching: false,
    isUpdating: false,
    isUploading: false,
    fetchError: null,
    updateError: null,
    uploadError: null,
    lastUploadSuccess: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearFetchError: (state) => {
            state.fetchError = null;
        },

        // Clear errors
        clearErrors: (state) => {
            state.updateError = null;
            state.uploadError = null;
        },

        // Clear success messages
        clearSuccessMessages: (state) => {
            state.lastUploadSuccess = null;
        },

        // Reset profile state
        resetProfile: (state) => {
            return initialState;
        },

        // Update photo metadata when photo changes
        updatePhotoMetadata: (state, action: PayloadAction<{ userId: string }>) => {
            state.photoMetadata.lastUpdated = new Date().toISOString();
            state.photoMetadata.userId = action.payload.userId;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProfile.pending, (state) => {
                state.isFetching = true;
                state.fetchError = null;
            })
            .addCase(getProfile.fulfilled, (state, action: PayloadAction<GetUserProfile>) => {
                state.isFetching = false;
                state.profile = action.payload;
                state.fetchError = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isFetching = false;
                state.fetchError = action.payload as string;
            })

            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isUpdating = true;
                state.updateError = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isUpdating = false;
                state.profile = action.payload.user;
                state.updateError = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isUpdating = false;
                state.updateError = action.payload as string;
            })

            // Upload Profile Photo
            .addCase(uploadProfilePhoto.pending, (state) => {
                state.isUploading = true;
                state.uploadError = null;
            })
            .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
                state.isUploading = false;
                state.lastUploadSuccess = action.payload.message;
                state.uploadError = null;
                // Update metadata to trigger photo refetch
                state.photoMetadata.lastUpdated = new Date().toISOString();
                state.photoMetadata.userId = action.payload.userId;
            })
            .addCase(uploadProfilePhoto.rejected, (state, action) => {
                state.isUploading = false;
                state.uploadError = action.payload as string;
            });
    },
});

export const {
    clearErrors,
    clearFetchError,
    clearSuccessMessages,
    resetProfile,
    updatePhotoMetadata
} = profileSlice.actions;

export default profileSlice.reducer;