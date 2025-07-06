import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { medicalRecordApi } from "./api";
import {
  MedicalRecordDeleteResponse,
  MedicalRecordGetAll,
  MedicalRecordGetAllResponse,
  MedicalRecordPost,
  MedicalRecordPostApiResponse,
  MedicalRecordPostResponse,
  PatientProviderResponse,

} from "./types";

// Async thunk to fetch all medical records
export const fetchAllMedicalRecord = createAsyncThunk(
  'medicalRecord/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicalRecordApi.getAll();

      if (response.success) {
        return response;
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

// Async thunk to fetch selected patients and their providers
export const fetchSelectedPatientProviders = createAsyncThunk(
  'medicalRecord/fetchSelectedPatientProviders',
  async (_, { rejectWithValue }) => {
    try {
      const response: PatientProviderResponse = await medicalRecordApi.getSelected();

      if (response.success) {
        return response;
      } else {
        return rejectWithValue("Failed to fetch selected patient-provider data");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch selected patient-provider data'
      );
    }
  }
);

// Async thunk to create a new medical record
export const createMedicalRecord = createAsyncThunk(
  'medicalRecord/create',
  async (payload: MedicalRecordPost, { rejectWithValue }) => {
    try {
      const response: MedicalRecordPostApiResponse = await medicalRecordApi.create(payload);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to create medical record');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create medical record'
      );
    }
  }
);

// Async thunk for updating a medical record
export const updateMedicalRecord = createAsyncThunk(
  'medicalRecord/update',
  async (
    { id, medicalRecordData }: { id: string | number, medicalRecordData: MedicalRecordPost },
    { rejectWithValue }
  ) => {
    try {
      const response: MedicalRecordPostApiResponse = await medicalRecordApi.update(id, medicalRecordData);

      if (response.success) {
        return { id, updatedMedicalRecord: response.data };
      } else {
        return rejectWithValue(response.message || 'Failed to update medical record');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update medical record');
    }
  }
);

// Async thunk to delete a medical record
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
  medicalRecords: MedicalRecordGetAll[]; // Updated to use populated refs type
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
  deleteLoading: boolean;
  deleteError: string | null;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;

  selectedPatients: PatientProviderResponse["data"]; // New
  selectedLoading: boolean; // New
  selectedError: string | null; // New
}

const initialState: MedicalRecordState = {
  medicalRecords: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
  deleteLoading: false,
  deleteError: null,
  createLoading: false,
  createError: null,
  createSuccess: false,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,

  selectedPatients: [], // New
  selectedLoading: false, // New
  selectedError: null, // New
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
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearSelectedPatients: (state) => {
      state.selectedPatients = [];
      state.selectedLoading = false;
      state.selectedError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchAllMedicalRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecordGetAllResponse>) => {
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

      // Create medical record cases
      .addCase(createMedicalRecord.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action: PayloadAction<MedicalRecordPostResponse>) => {
        state.createLoading = false;
        state.createError = null;
        state.createSuccess = true;
        // Note: We don't add the created record to the list since it doesn't have populated refs
        // You should refetch the list or handle this case specifically
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })

      // Update medical record cases
      .addCase(updateMedicalRecord.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateMedicalRecord.fulfilled, (state, action: PayloadAction<{ id: string | number, updatedMedicalRecord: MedicalRecordPost }>) => {
        state.updateLoading = false;
        state.updateError = null;
        state.updateSuccess = true;
        // Note: The updated record doesn't have populated refs, so you might want to refetch
        // or handle this case specifically to maintain consistency
      })
      .addCase(updateMedicalRecord.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      })

      // Get Selected Patients
      .addCase(fetchSelectedPatientProviders.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchSelectedPatientProviders.fulfilled, (state, action: PayloadAction<PatientProviderResponse>) => {
        state.selectedLoading = false;
        state.selectedPatients = action.payload.data;
        state.selectedError = null;
      })
      .addCase(fetchSelectedPatientProviders.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload as string;
        state.selectedPatients = [];
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

export const {
  clearError,
  clearMedicalRecords,
  clearDeleteError,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  clearSelectedPatients
} = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;