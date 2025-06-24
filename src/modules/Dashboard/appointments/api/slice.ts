// slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Appointment, AppointmentGetApiResponse, AppointmentGetResponse, AppointmentApiResponse, AppointmentData, AppointmentUpdateResponse, AppointmentDeleteApiResponse } from "./types";
import { appointmentsApi } from "./api";

// Async thunk for fetching all appointments
export const fetchAllAppointments = createAsyncThunk(
  'appointment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response: AppointmentGetApiResponse = await appointmentsApi.getAll();

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

// Async thunk for updating an appointment
export const updateAppointment = createAsyncThunk(
  'appointment/update',
  async ({ id, appointmentData }: { id: string | number, appointmentData: AppointmentData }, { rejectWithValue }) => {
    try {
      const response: AppointmentUpdateResponse = await appointmentsApi.update(id, appointmentData);

      // Type guard to check if response is successful
      if (response.success) {
        return { id, updatedAppointment: response.data }; // Return both ID and updated data
      } else {
        return rejectWithValue(response.message || 'Failed to update appointment');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update appointment');
    }
  }
);

// Async thunk for deleting appointment
export const deleteAppointment = createAsyncThunk<
  AppointmentDeleteApiResponse,
  string | number
>("appointment/delete", async (id, thunkAPI) => {
  try {
    const response = await appointmentsApi.delete(id);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error?.response?.data || "Delete failed");
  }
});

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
  // deleteLoading: boolean;
  // deleteError: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
  // deleteLoading: false,
  // deleteError: null,
  updateLoading: false,
  updateError: null,
};

const appointmentSlice = createSlice({
  name: "appointment",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // clearDeleteError: (state) => {
    //   state.deleteError = null;
    // },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.count = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments cases
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
      })
      // Update appointment cases
      .addCase(updateAppointment.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      // .addCase(updateAppointment.fulfilled, (state, action: PayloadAction<{ id: string | number, updatedAppointment: Appointment }>) => {
      //   state.updateLoading = false;
      //   state.updateError = null;
      // })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
    // Delete appointment cases
    // .addCase(deleteAppointment.pending, (state) => {
    //   state.deleteLoading = true;
    //   state.deleteError = null;
    // })
    // .addCase(deleteAppointment.fulfilled, (state, action: PayloadAction<string>) => {
    //   state.deleteLoading = false;
    //   state.deleteError = null;
    //   // Remove the deleted appointment from the state
    //   state.appointments = state.appointments.filter(
    //     appointment => appointment._id !== action.payload
    //   );
    //   state.count = state.count - 1;
    // })
    // .addCase(deleteAppointment.rejected, (state, action) => {
    //   state.deleteLoading = false;
    //   state.deleteError = action.payload as string;
    // });
  },
});

export const { clearError, clearUpdateError, clearAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;