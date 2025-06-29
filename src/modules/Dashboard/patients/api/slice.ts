import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { patientsApi } from "./api";
import { Patient, PatientBasicInfo, PatientBasicInfoResponse, PatientGetResponse, PatientPostApiResponse, PatientPostRequest, PatientPostResponse } from "./types";

// Async thunk for fetching all patients
export const fetchAllPatients = createAsyncThunk(
  'patient/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientsApi.getAll();

      // Type guard to check if response is successful
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch patients');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch patients');
    }
  }
);

export const fetchPatientBasicInfo = createAsyncThunk(
  'patient/fetchBasicInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientsApi.getBasicInfo();
      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to fetch patient basic info');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch patient basic info');
    }
  }
);

// Async thunk to create a new patients
export const createPatients = createAsyncThunk(
  'patient/create',
  async (payload: PatientPostRequest, { rejectWithValue }) => {
    try {
      const response: PatientPostApiResponse = await patientsApi.create(payload);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to create patients');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create patients'
      );
    }
  }
);

// Async thunk for updating a patients
export const updatePatients = createAsyncThunk('patient/update', async (
  { id, patientData }: { id: string | number, patientData: PatientPostRequest },
  { rejectWithValue }
) => {
  try {
    const response: PatientPostApiResponse = await patientsApi.update(id, patientData);

    if (response.success) {
      return { id, updatedPatient: response.data };
    } else {
      return rejectWithValue(response.message || 'Failed to update patient');
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update patient');
  }
}
);

// Async thunk for deleting a patient
export const deletePatient = createAsyncThunk(
  'patient/delete',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientsApi.delete(patientId);

      // Type guard to check if response is successful
      if (response.success) {
        return patientId;
      } else {
        return rejectWithValue(response.message || 'Failed to delete patient');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete patient');
    }
  }
);

// FIXED: Keep Patient type for consistency with your existing code
interface PatientState {
  patients: Patient[];
  basicInfo: PatientBasicInfo[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;
  // deleteLoading: boolean;
  // deleteError: string | null;
}

const initialState: PatientState = {
  basicInfo: [],
  patients: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
  updateLoading: false,
  updateError: null,
  updateSuccess: false,
  createLoading: false,
  createError: null,
  createSuccess: false
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // clearDeleteError: (state) => {
    //   state.deleteError = null;
    // },
    // clearCreateError: (state) => {
    //   state.createError = null;
    // },
    // clearUpdateError: (state) => {
    //   state.updateError = null;
    // },
    clearPatients: (state) => {
      state.patients = [];
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch patients cases
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action: PayloadAction<PatientGetResponse>) => {
        state.loading = false;
        // FIXED: Type guard to ensure we have the success response with proper typing
        if (action.payload.success && 'data' in action.payload) {
          state.patients = action.payload.data as Patient[]; // Type assertion since PatientGet ≈ Patient
          state.count = action.payload.count;
          state.success = action.payload.success;
        }
        state.error = null;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.patients = [];
        state.count = 0;
        state.success = false;
      })

      // FETCH THE BASIC INFO
      .addCase(fetchPatientBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientBasicInfo.fulfilled, (state, action: PayloadAction<PatientBasicInfoResponse>) => {
        state.loading = false;
        state.basicInfo = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
      })
      .addCase(fetchPatientBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.basicInfo = [];
        state.count = 0;
        state.success = false;
      })

      // Create patient cases
      .addCase(createPatients.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createPatients.fulfilled, (state, action: PayloadAction<PatientPostResponse>) => {
        state.createLoading = false;
        state.createError = null;
        state.createSuccess = true;
        // Note: We don't add the created record to the list since it doesn't have populated refs
        // You should refetch the list or handle this case specifically
      })
      .addCase(createPatients.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })

      // Update patient cases
      .addCase(updatePatients.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updatePatients.fulfilled, (state, action: PayloadAction<{ id: string | number, updatedPatient: PatientPostRequest }>) => {
        state.updateLoading = false;
        state.updateError = null;
        state.updateSuccess = true;
        // Note: The updated record doesn't have populated refs, so you might want to refetch
        // or handle this case specifically to maintain consistency
      })
      .addCase(updatePatients.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      })

    // Delete patient cases
    // .addCase(deletePatient.pending, (state) => {
    //   state.deleteLoading = true;
    //   state.deleteError = null;
    // })
    // .addCase(deletePatient.fulfilled, (state, action: PayloadAction<string>) => {
    //   state.deleteLoading = false;
    //   state.deleteError = null;
    //   // Remove the deleted patient from the state
    //   state.patients = state.patients.filter(
    //     patient => patient._id !== action.payload
    //   );
    //   state.count = state.count - 1;
    // })
    // .addCase(deletePatient.rejected, (state, action) => {
    //   state.deleteLoading = false;
    //   state.deleteError = action.payload as string;
    // })
  },
});

export const {
  clearError,
  clearPatients,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  // clearDeleteError, 
  // clearCreateError, 
  // clearUpdateError, 
} = patientSlice.actions;

export default patientSlice.reducer;