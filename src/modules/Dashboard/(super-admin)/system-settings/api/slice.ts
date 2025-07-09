import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


interface SystemSettingState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SystemSettingState = {
  loading: false,
  error: null,
  success: false,
};

const systemSettingSlice = createSlice({
  name: "systemSetting",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

  },
});

export const { clearError } = systemSettingSlice.actions;
export default systemSettingSlice.reducer;