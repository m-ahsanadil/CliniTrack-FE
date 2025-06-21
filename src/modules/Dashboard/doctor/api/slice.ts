import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProviderAdminProfileRequest } from './types';

interface DoctorState {
  list: ProviderAdminProfileRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  list: [],
  loading: false,
  error: null,
};

export const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    fetchDoctorsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorsSuccess(state, action: PayloadAction<ProviderAdminProfileRequest[]>) {
      state.loading = false;
      state.list = action.payload;
    },
    fetchDoctorsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearDoctors(state) {
      state.list = [];
    },
  },
});

export const {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  clearDoctors,
} = doctorSlice.actions;

export default doctorSlice.reducer;
