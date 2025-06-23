import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { providerApi } from "./api";
import { Provider, ProviderGetApiResponse, ProviderGetErrorResponse, } from "./types";


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

// Async thunk for deleting a provider
export const deleteProvider = createAsyncThunk(
  'provider/delete',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await providerApi.delete(patientId);

      // Type guard to check if response is successful
      if (response.success) {
        return patientId;
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
  loading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  provider: [],
  loading: false,
  error: null,
};

// Slice
const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {},
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
      });
  },
});

export default providerSlice.reducer;
