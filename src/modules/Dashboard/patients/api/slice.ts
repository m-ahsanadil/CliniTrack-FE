import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { patientsApi } from "./api";
import {
  Patient,
  PatientNames,
  PatientPostRequest,
  PatientPostApiResponse,
  PatientPostResponse,
  PatientListGetResponse,
  PatientGetResponse,
} from "./types";

// 🔁 Fetch all patients
export const fetchAllPatients = createAsyncThunk(
  "patient/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await patientsApi.getAll();
      return response.success ? response : rejectWithValue(response.message || "Failed to fetch patients");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to fetch patients");
    }
  }
);

// 🔁 Fetch only patient names
export const fetchPatientsName = createAsyncThunk(
  "patient/fetchName",
  async (_, { rejectWithValue }) => {
    try {
      const res = await patientsApi.getPatientNames();
      return res.success ? res : rejectWithValue(res.message || "Failed to fetch patient names");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to fetch patient names");
    }
  }
);

// 🆕 Create patient
export const createPatients = createAsyncThunk(
  "patient/create",
  async (payload: PatientPostRequest, { rejectWithValue }) => {
    try {
      const response: PatientPostApiResponse = await patientsApi.create(payload);
      return response.success ? response : rejectWithValue(response.message || "Failed to create patient");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to create patient");
    }
  }
);

// ✏️ Update patient
export const updatePatients = createAsyncThunk(
  "patient/update",
  async (
    { id, patientData }: { id: string | number; patientData: PatientPostRequest },
    { rejectWithValue }
  ) => {
    try {
      const response: PatientPostApiResponse = await patientsApi.update(id, patientData);
      return response.success
        ? { id, updatedPatient: response.data }
        : rejectWithValue(response.message || "Failed to update patient");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to update patient");
    }
  }
);

// 🗑️ Delete patient
export const deletePatient = createAsyncThunk(
  "patient/delete",
  async (patientId: string, { rejectWithValue }) => {
    try {
      const response = await patientsApi.delete(patientId);
      return response.success ? patientId : rejectWithValue(response.message || "Failed to delete patient");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to delete patient");
    }
  }
);

// 🧠 Initial State
interface PatientState {
  patients: Patient[];
  basicInfo: PatientNames[];
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

  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: PatientState = {
  patients: [],
  basicInfo: [],
  loading: false,
  error: null,
  count: 0,
  success: false,

  createLoading: false,
  createError: null,
  createSuccess: false,

  updateLoading: false,
  updateError: null,
  updateSuccess: false,

  deleteLoading: false,
  deleteError: null,
};

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
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
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📦 FETCH ALL
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action: PayloadAction<PatientGetResponse>) => {
        state.loading = false;
        state.patients = action.payload.data;
        state.count = action.payload.count;
        state.success = true;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.patients = [];
        state.count = 0;
        state.success = false;
      })

      // 📛 NAMES
      .addCase(fetchPatientsName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientsName.fulfilled, (state, action: PayloadAction<PatientListGetResponse>) => {
        state.loading = false;
        state.basicInfo = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
      })
      .addCase(fetchPatientsName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.basicInfo = [];
        state.success = false;
      })

      // 🧾 CREATE
      .addCase(createPatients.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createPatients.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createPatients.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })

      // 🛠 UPDATE
      .addCase(updatePatients.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updatePatients.fulfilled, (state) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updatePatients.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      })

      // 🗑 DELETE
      .addCase(deletePatient.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deletePatient.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.patients = state.patients.filter(p => p._id !== action.payload);
        state.count = state.count - 1;
      })
      .addCase(deletePatient.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

// ✅ Export Actions
export const {
  clearError,
  clearPatients,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  clearDeleteError,
} = patientSlice.actions;

// ✅ Export Reducer
export default patientSlice.reducer;
