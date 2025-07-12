import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reportApi } from "./api";
import {
  GetAllReports,
  ReportsGetAllResponse,
  ReportPostRequest,
  ReportApiPostResponse
} from "./types";

// Async thunk for fetching all reports
export const fetchAllReports = createAsyncThunk(
  'report/fetchAllReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportApi.getAll();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch reports');
    }
  }
);

// Async thunk for creating a report
export const createReport = createAsyncThunk(
  'report/createReport',
  async (reportData: ReportPostRequest, { rejectWithValue }) => {
    try {
      const response = await reportApi.create(reportData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to create report');
    }
  }
);

// Async thunk for getting a report by ID
export const fetchReportById = createAsyncThunk(
  'report/fetchReportById',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await reportApi.getById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to fetch report');
    }
  }
);

// Async thunk for updating a report
export const updateReport = createAsyncThunk(
  'report/updateReport',
  async ({ id, reportData }: { id: string | number; reportData: ReportPostRequest }, { rejectWithValue }) => {
    try {
      const response = await reportApi.update(id, reportData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to update report');
    }
  }
);

// Async thunk for deleting a report
export const deleteReport = createAsyncThunk(
  'report/deleteReport',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await reportApi.delete(id);
      return { response, id }; // Return both response and id for state update
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message || 'Failed to delete report');
    }
  }
);

interface ReportState {
  reports: GetAllReports[];
  currentReport: GetAllReports | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  count: number;
  // Loading states for different operations
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

const initialState: ReportState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  success: false,
  count: 0,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
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
      state.currentReport = null;
      state.error = null;
      state.success = false;
      state.count = 0;
    },
    // Set loading state manually if needed
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Set current report
    setCurrentReport: (state, action: PayloadAction<GetAllReports | null>) => {
      state.currentReport = action.payload;
    },
    // Clear current report
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all reports
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action: PayloadAction<ReportsGetAllResponse>) => {
        state.loading = false;
        state.success = action.payload.success;
        state.reports = action.payload.data;
        state.count = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Create report
      .addCase(createReport.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action: PayloadAction<ReportApiPostResponse>) => {
        state.createLoading = false;
        if (action.payload.success) {
          state.success = true;
          state.error = null;
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Fetch report by ID
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action: PayloadAction<ReportApiPostResponse>) => {
        state.loading = false;
        if (action.payload.success) {
          state.success = true;
          state.error = null;
          // You might want to set currentReport here if the response includes the report data
        }
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Update report
      .addCase(updateReport.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateReport.fulfilled, (state, action: PayloadAction<ReportApiPostResponse>) => {
        state.updateLoading = false;
        if (action.payload.success) {
          state.success = true;
          state.error = null;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action: PayloadAction<{ response: ReportApiPostResponse; id: string | number }>) => {
        state.deleteLoading = false;
        if (action.payload.response.success) {
          state.success = true;
          state.error = null;
          // Remove the deleted report from the reports array
          state.reports = state.reports.filter(report => report._id !== action.payload.id);
          state.count = Math.max(0, state.count - 1);
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const {
  clearError,
  resetReports,
  setLoading,
  setCurrentReport,
  clearCurrentReport
} = reportSlice.actions;

export default reportSlice.reducer;