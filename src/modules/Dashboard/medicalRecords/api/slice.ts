import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { medicalRecordApi } from "./api";
import { MedicalRecord } from "./types";

// Define response type
interface MedicalRecordGetResponse {
  success: boolean;
  count: number;
  data: MedicalRecord[];
}

// Async thunk to fetch all medical records
export const fetchAllMedicalRecord = createAsyncThunk(
  'medicalRecord/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicalRecordApi.getAll();

      if (response.success) {
        return response as MedicalRecordGetResponse;
      } else {
        return rejectWithValue(response.success || 'Failed to fetch medical records');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch medical records'
      );
    }
  }
);

interface MedicalRecordState {
  medicalRecords: MedicalRecord[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
}

const initialState: MedicalRecordState = {
  medicalRecords: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
};

const medicalRecordSlice = createSlice({
  name: "medicalRecord",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMedicalRecords: (state) => {
      state.medicalRecords = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecordGetResponse>) => {
        state.loading = false;
        state.medicalRecords = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(fetchAllMedicalRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.medicalRecords = [];
        state.count = 0;
        state.success = false;
      });
  },
});

export const { clearError, clearMedicalRecords } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
