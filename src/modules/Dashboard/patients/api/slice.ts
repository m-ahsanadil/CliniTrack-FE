import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { patientsApi } from "./api";
import { Patient, PatientGetResponse } from "./types";

// Async thunk for fetching all patients
export const fetchAllPatients = createAsyncThunk(
  'patient/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientsApi.getAllPatients();

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

// Async thunk for deleting a patient
// export const deletePatient = createAsyncThunk(
//   'patient/delete',
//   async (patientId: string, { rejectWithValue }) => {
//     try {
//       const response = await patientsApi.deletePatient(patientId);

//       // Type guard to check if response is successful
//       if (response.success) {
//         return patientId;
//       } else {
//         return rejectWithValue(response.message || 'Failed to delete patient');
//       }
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || error.message || 'Failed to delete patient');
//     }
//   }
// );

// FIXED: Keep Patient type for consistency with your existing code
interface PatientState {
  patients: Patient[];  
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
  // deleteLoading: boolean;
  // deleteError: string | null;
}

const initialState: PatientState = {
  patients: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
  // deleteLoading: false,
  // deleteError: null,
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
  // clearDeleteError, 
  // clearCreateError, 
  // clearUpdateError, 
  clearPatients 
} = patientSlice.actions;

export default patientSlice.reducer;