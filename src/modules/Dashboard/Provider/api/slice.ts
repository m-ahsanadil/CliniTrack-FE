import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { providerApi } from "./api";
import {
  Provider,
  ProviderNames,
  ProviderRequest,
  ProvideristGetResponse
} from "./types";

// 🔁 Fetch All Providers
export const fetchAllProviders = createAsyncThunk<
  Provider[],
  void,
  { rejectValue: string }
>("provider/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await providerApi.getAll();
    return response.success ? response.data : rejectWithValue(response.message || "Failed to fetch providers");
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch providers");
  }
});

// 🔠 Fetch Provider Names
export const fetchProvidersName = createAsyncThunk<
  ProvideristGetResponse,
  void,
  { rejectValue: string }
>("provider/fetchName", async (_, { rejectWithValue }) => {
  try {
    const response = await providerApi.getDoctorNames();
    return response.success ? response : rejectWithValue(response.message || "Failed to fetch provider names");
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch provider names");
  }
});

// ➕ Create
export const createProvider = createAsyncThunk<
  Provider,
  ProviderRequest,
  { rejectValue: string }
>("provider/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await providerApi.create(payload);
    return response.success ? response.data : rejectWithValue(response.message || "Failed to create provider");
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to create provider");
  }
});

// ✏️ Update
export const updateProvider = createAsyncThunk<
  Provider,
  { id: string; providerData: ProviderRequest },
  { rejectValue: string }
>("provider/update", async ({ id, providerData }, { rejectWithValue }) => {
  try {
    const response = await providerApi.update(id, providerData);
    return response.success ? response.data : rejectWithValue(response.message || "Failed to update provider");
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to update provider");
  }
});

// 🗑️ Delete
export const deleteProvider = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("provider/delete", async (providerId, { rejectWithValue }) => {
  try {
    const response = await providerApi.delete(providerId);
    return response.success ? providerId : rejectWithValue(response.message || "Failed to delete provider");
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete provider");
  }
});

// 🧠 Initial State
interface ProviderState {
  providers: Provider[];
  basicInfo: ProviderNames[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;

  deleteLoading: boolean;
  deleteError: string | null;
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: ProviderState = {
  providers: [],
  basicInfo: [],
  loading: false,
  error: null,
  count: 0,
  success: false,

  deleteLoading: false,
  deleteError: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
};

// Slice
const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProvider: (state) => {
      state.providers = [];
      state.count = 0;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch All
      .addCase(fetchAllProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProviders.fulfilled, (state, action: PayloadAction<Provider[]>) => {
        state.loading = false;
        state.providers = action.payload;
        state.success = true;
      })
      .addCase(fetchAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch providers";
      })

      // 📛 Fetch Names
      .addCase(fetchProvidersName.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProvidersName.fulfilled, (state, action: PayloadAction<ProvideristGetResponse>) => {
        state.loading = false;
        state.basicInfo = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
      })
      .addCase(fetchProvidersName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch provider names";
      })

      // ➕ Create
      .addCase(createProvider.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProvider.fulfilled, (state, action: PayloadAction<Provider>) => {
        state.createLoading = false;
        state.providers.push(action.payload);
        state.success = true;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Failed to create provider";
      })

      // ✏️ Update
      .addCase(updateProvider.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProvider.fulfilled, (state, action: PayloadAction<Provider>) => {
        state.updateLoading = false;
        const index = state.providers.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Failed to update provider";
      })

      // 🗑️ Delete
      .addCase(deleteProvider.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProvider.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.providers = state.providers.filter(p => p._id !== action.payload);
        state.count = state.count - 1;
      })
      .addCase(deleteProvider.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "Failed to delete provider";
      });
  },
});

// ✅ Export Actions
export const {
  clearError,
  clearProvider,
  resetSuccess,
  clearDeleteError,
  clearCreateError,
  clearUpdateError,
} = providerSlice.actions;

// ✅ Export Reducer
export default providerSlice.reducer;
