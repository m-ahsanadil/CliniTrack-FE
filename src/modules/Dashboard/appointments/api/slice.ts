// slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Appointment,
  AppointmentRequest,
  AppointmentRequestResponseApiResponse,
  AppointmentGetAllApiResponse,
  AppointmentDeleteApiResponse,
  AppointmentRequestResponse,
  RescheduleAppointmentRequest,
} from "./types";
import { appointmentsApi } from "./api";
import { AppointmentPriority, AppointmentStatus, AppointmentType } from "@/src/enum";

// Thunk: Fetch All Appointments
export const fetchAllAppointments = createAsyncThunk(
  "appointment/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response: AppointmentGetAllApiResponse = await appointmentsApi.getAll();
      return response.success ? response : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Thunk: Create Appointment
export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (payload: AppointmentRequest, { rejectWithValue }) => {
    try {
      const response: AppointmentRequestResponseApiResponse = await appointmentsApi.create(payload);
      return response.success ? response : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Thunk: Update Appointment
export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async (
    { id, payload }: { id: string; payload: AppointmentRequest },
    { rejectWithValue }
  ) => {
    try {
      const response: AppointmentRequestResponseApiResponse = await appointmentsApi.update(id, payload);
      return response.success
        ? { id, updatedAppointment: response.data }
        : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Cancel Appointment Thunk
export const cancelAppointment = createAsyncThunk(
  "appointment/cancel",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.cancel(id);
      return response.success ? response.data : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Reschedule Appointment Thunk
export const rescheduleAppointment = createAsyncThunk(
  "appointment/reschedule",
  async ({ id, payload }: { id: string; payload: RescheduleAppointmentRequest }, { rejectWithValue }) => {
    try {
      const response = await appointmentsApi.reschedule(id, payload);
      return response.success ? response.data : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);


// Thunk: Delete Appointment
export const deleteAppointment = createAsyncThunk(
  "appointment/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response: AppointmentDeleteApiResponse = await appointmentsApi.delete(id);
      return response.success ? id : rejectWithValue(response.message);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);

// Slice
interface AppointmentState {
  appointments: Appointment[];
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

  cancelLoading: boolean;
  cancelError: string | null;
  cancelSuccess: boolean;

  rescheduleLoading: boolean;
  rescheduleError: string | null;
  rescheduleSuccess: boolean;

  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: AppointmentState = {
  appointments: [],
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

  cancelLoading: false,
  cancelError: null,
  cancelSuccess: false,

  rescheduleLoading: false,
  rescheduleError: null,
  rescheduleSuccess: false,


  deleteLoading: false,
  deleteError: null,
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
    clearCancelError: (state) => {
      state.cancelError = null;
      state.cancelSuccess = false;
    },
    clearRescheduleError: (state) => {
      state.rescheduleError = null;
      state.rescheduleSuccess = false;
    },

    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action: PayloadAction<AppointmentGetAllApiResponse>) => {
        state.loading = false;
        if (action.payload.success) {
          state.appointments = action.payload.data;
          state.count = action.payload.count;
          state.success = true;
        } else {
          state.appointments = [];
          state.count = 0;
          state.success = false;
          state.error = action.payload.message;
        }
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.appointments = [];
        state.count = 0;
        state.success = false;
      })

      // Create
      .addCase(createAppointment.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createAppointment.fulfilled, (state, action: PayloadAction<AppointmentRequestResponse>) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.createError = null;
        const raw = action.payload.data;

        state.appointments.unshift({
          ...raw,
          patientId: { _id: raw.patientId, fullName: raw.patientName },
          providerId: { _id: raw.providerId, name: raw.providerName },
        });
        state.count += 1;
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })

      // Update
      .addCase(updateAppointment.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const { id, updatedAppointment } = action.payload;
        const index = state.appointments.findIndex(a => a._id === id);

        if (index !== -1) {
          const transformed = {
            ...state.appointments[index], // preserve current object structure
            ...updatedAppointment,
            patientId: {
              _id: updatedAppointment.patientId,
              fullName: updatedAppointment.patientName,
            },
            providerId: {
              _id: updatedAppointment.providerId,
              name: updatedAppointment.providerName,
            },
          };
          state.appointments[index] = transformed;
        }
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
        state.updateSuccess = false;
      })

      // Cancel Appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.cancelLoading = true;
        state.cancelError = null;
        state.cancelSuccess = false;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.cancelLoading = false;
        state.cancelSuccess = true;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.appointments[index].status = AppointmentStatus.CANCELLED;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.cancelLoading = false;
        state.cancelError = action.payload as string;
        state.cancelSuccess = false;
      })

      // Reschedule Appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.rescheduleLoading = true;
        state.rescheduleError = null;
        state.rescheduleSuccess = false;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.rescheduleLoading = false;
        state.rescheduleSuccess = true;
        const index = state.appointments.findIndex((a) => a._id === action.payload._id);

        if (index !== -1) {
          const updated = action.payload;

          state.appointments[index] = {
            ...state.appointments[index],
            ...updated,
            type: updated.type as AppointmentType,
            priority: updated.priority as AppointmentPriority,
            status: updated.status as AppointmentStatus,
            patientId: {
              _id: updated.patientId,
              fullName: updated.patientName,
            },
            providerId: {
              _id: updated.providerId,
              name: updated.providerName,
            },
          };
        }
      })

      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.rescheduleLoading = false;
        state.rescheduleError = action.payload as string;
        state.rescheduleSuccess = false;
      })


      // Delete
      .addCase(deleteAppointment.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLoading = false;
        state.appointments = state.appointments.filter(app => app._id !== action.payload);
        state.count -= 1;
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearAppointments,
  clearCreateError,
  clearCreateSuccess,
  clearUpdateError,
  clearUpdateSuccess,
  clearDeleteError,
  clearCancelError,
  clearRescheduleError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
