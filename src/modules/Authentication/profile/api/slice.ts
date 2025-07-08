import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
    GetUserProfile,
    GetUserProfileApiResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    UploadPhotoResponse
} from "./types";
import { profileApi } from "./api";

export const fetchProfile = createAsyncThunk(
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


interface ProfileState {
    // Profile data
    profile: GetUserProfile | null;
    // Loading states
    isFetching: boolean;
    isUpdating: boolean;

    // Error states
    fetchError: string | null;
    updateError: string | null;
}

const initialState: ProfileState = {
    profile: null,
    isFetching: false,
    isUpdating: false,
    fetchError: null,
    updateError: null,
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
        },

        // Reset profile state
        resetProfile: (state) => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isFetching = true;
                state.fetchError = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<GetUserProfile>) => {
                state.isFetching = false;
                state.profile = action.payload;
                state.fetchError = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
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
    },
});

export const {
    clearErrors,
    clearFetchError,
    resetProfile,
} = profileSlice.actions;

export default profileSlice.reducer;