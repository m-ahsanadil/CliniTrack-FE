import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";


interface ClickManagementState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ClickManagementState = {
  loading: false,
  error: null,
  success: false,
};

const clickManagementSlice = createSlice({
  name: "clickManagement",
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

export const { clearError } = clickManagementSlice.actions;
export default clickManagementSlice.reducer;