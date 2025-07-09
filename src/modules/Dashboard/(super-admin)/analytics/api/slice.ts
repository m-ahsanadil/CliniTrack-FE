import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


interface AnalyticsState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AnalyticsState = {
  loading: false,
  error: null,
  success: false,
};

const analyticsSlice = createSlice({
  name: "analytics",
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

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;