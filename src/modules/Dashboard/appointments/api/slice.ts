// slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Appointment, AppointmentGetApiResponse, AppointmentGetResponse } from "./types";
import { appointmentsApi } from "./api";

// Async thunk for fetching all appointments
export const fetchAllAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response: AppointmentGetApiResponse = await appointmentsApi.getAllAppointments();
      
      // Type guard to check if response is successful
      if (response.success) {
        return response; // This is AppointmentGetResponse
      } else {
        return rejectWithValue(response.message || 'Failed to fetch appointments');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch appointments');
    }
  }
);

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action: PayloadAction<AppointmentGetResponse>) => {
        state.loading = false;
        state.appointments = action.payload.data;
        state.count = action.payload.count;
        state.success = action.payload.success;
        state.error = null;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.appointments = [];
        state.count = 0;
        state.success = false;
      });
  },
});

export const { clearError, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;