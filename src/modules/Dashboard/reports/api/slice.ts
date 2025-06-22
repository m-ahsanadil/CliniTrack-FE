import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reportApi } from "./api";
import { ReportsGetResponse } from "./types";

// Async thunk for fetching all reports
export const fetchAllReports = createAsyncThunk(
  'report/fetchAllReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportApi.getAllReport();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch reports');
    }
  }
);

interface ReportState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  success: boolean;
  count: number;
  lastFetchTime: number | null;
}

const initialState: ReportState = {
  reports: [],
  loading: false,
  error: null,
  success: false,
  count: 0,
  lastFetchTime: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    // Reset reports state
    resetReports: (state) => {
      state.reports = [];
      state.error = null;
      state.success = false;
      state.count = 0;
      state.lastFetchTime = null;
    },
    // Set loading state manually if needed
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all reports
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<ReportsGetResponse>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.reports = action.payload.data;
        state.count = action.payload.count;
        state.error = null;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, resetReports, setLoading } = reportSlice.actions;
export default reportSlice.reducer;