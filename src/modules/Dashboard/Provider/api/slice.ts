import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { providerApi } from "./api";
import { Provider, ProviderBasicInfo, ProviderBasicInfoResponse, ProviderGetApiResponse, ProviderGetErrorResponse, } from "./types";


// Async thunk to fetch all providers
export const fetchAllProviders = createAsyncThunk<
  Provider[],
  void,
  { rejectValue: string }
>(
  "provider/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerApi.getAll();

      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message || "Failed to fetch providers");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.provider?.message || error.message || "Failed to fetch providers"
      );
    }
  }
);


export const fetchProviderBasicInfo = createAsyncThunk(
  'provider/fetchBasicInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await providerApi.getBasicInfo();
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch provider basic info');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch provider basic info');
    }
  }
);


// Async thunk for deleting a provider
export const deleteProvider = createAsyncThunk(
  'provider/delete',
  async (providerId: string, { rejectWithValue }) => {
    try {
      const response = await providerApi.delete(providerId);

      // Type guard to check if response is successful
      if (response.success) {
        return providerId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete provider');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete provider');
    }
  }
);

// Initial state
interface ProviderState {
  provider: Provider[];
  basicInfo: ProviderBasicInfo[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
}

const initialState: ProviderState = {
  provider: [],
  basicInfo: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
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
      state.provider = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProviders.fulfilled, (state, action: PayloadAction<Provider[]>) => {
        state.loading = false;
        state.provider = action.payload;
      })
      .addCase(fetchAllProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // FETCH THE BASIC INFO
      .addCase(fetchProviderBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviderBasicInfo.fulfilled, (state, action: PayloadAction<ProviderBasicInfoResponse>) => {
        state.loading = false;
        state.basicInfo = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
      })
      .addCase(fetchProviderBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.basicInfo = [];
        state.count = 0;
        state.success = false;
      });

  },
});

export const {
  clearError,
  clearProvider
} = providerSlice.actions;

export default providerSlice.reducer;
