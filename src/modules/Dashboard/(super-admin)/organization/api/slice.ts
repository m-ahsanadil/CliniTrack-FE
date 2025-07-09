import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


interface OrganizationState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrganizationState = {
  loading: false,
  error: null,
  success: false,
};

const organizationSlice = createSlice({
  name: "organization",
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

export const { clearError } = organizationSlice.actions;
export default organizationSlice.reducer;