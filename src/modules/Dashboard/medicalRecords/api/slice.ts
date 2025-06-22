import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { medicalRecordApi } from "./api";
import { MedicalRecord, MedicalRecordDeleteResponse } from "./types";

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
        return rejectWithValue('Failed to fetch medical records');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch medical records'
      );
    }
  }
);

export const deleteMedicalRecord = createAsyncThunk(
  'medicalRecord/delete',
  async (medicalRecordId: string, { rejectWithValue }) => {
    try {
      const response: MedicalRecordDeleteResponse = await medicalRecordApi.delete(medicalRecordId);

      // Type guard to check if response is successful
      if (response.success) {
        return medicalRecordId; // Return the deleted medicalRecord ID
      } else {
        return rejectWithValue(response.message || 'Failed to delete medicalRecord');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete medicalRecord');
    }
  }
);

interface MedicalRecordState {
  medicalRecords: MedicalRecord[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: MedicalRecordState = {
  medicalRecords: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
  deleteLoading: false,
  deleteError: null,
};

const medicalRecordSlice = createSlice({
  name: "medicalRecord",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
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
      })
      // Delete medicalRecord cases
      .addCase(deleteMedicalRecord.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteMedicalRecord.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.deleteError = null;
        // Remove the deleted medicalRecord from the state
        state.medicalRecords = state.medicalRecords.filter(
          medicalRecord => medicalRecord._id !== action.payload
        );
        state.count = state.count - 1;
      })
      .addCase(deleteMedicalRecord.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearError, clearMedicalRecords, clearDeleteError } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;
