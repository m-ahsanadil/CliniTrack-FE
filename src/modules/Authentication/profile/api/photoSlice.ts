import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/src/redux/store/store';
import { profileApi } from './api';

// Convert blob to object URL
const createObjectUrl = (blob: Blob) => URL.createObjectURL(blob);

// Fetch the photo as a blob and store object URL
export const fetchUserPhoto = createAsyncThunk<string, string>(
  'photo/fetch',
  async (userId, { rejectWithValue }) => {
    try {
      const blob = await profileApi.get_photo(userId);
      if (!blob) throw new Error("No photo blob received");
      return createObjectUrl(blob);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch photo");
    }
  }
);

// Upload compressed photo
export const uploadUserPhoto = createAsyncThunk<string, File>(
  'photo/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await profileApi.upload_photo(formData);
      // Optionally re-fetch image here if needed
      return URL.createObjectURL(file); // local preview
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to upload photo");
    }
  }
);

interface PhotoState {
  photoUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotoState = {
  photoUrl: null,
  loading: false,
  error: null,
};

const photoSlice = createSlice({
  name: 'photo',
  initialState,
  reducers: {
    clearPhoto: (state) => {
      if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
      state.photoUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPhoto.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.photoUrl = action.payload;
      })
      .addCase(fetchUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadUserPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadUserPhoto.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.photoUrl = action.payload;
      })
      .addCase(uploadUserPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearPhoto } = photoSlice.actions;

// Export reducer
export default photoSlice.reducer;

// Selector
export const selectUserPhoto = (state: RootState) => state.photo;