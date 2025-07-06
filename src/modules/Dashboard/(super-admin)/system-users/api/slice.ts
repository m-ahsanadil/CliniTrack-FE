import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { systemUsersApi } from "./api";
import { SystemUsersApiResponse, SystemUsersResponse, User } from "./types";

// ─────────────────────────────────────────
// Async Thunk to Fetch All System Users
// ─────────────────────────────────────────
export const fetchAllSystemUsers = createAsyncThunk(
  "systemUsers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response: SystemUsersApiResponse = await systemUsersApi.getAll();

      if (response.success) {
        return response; 
      } else {
        return rejectWithValue(response.message || "Failed to fetch system users");
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Failed to fetch system users"
      );
    }
  }
);

// ─────────────────────────────────────────
// Initial State Interface
// ─────────────────────────────────────────
interface SystemUsersState {
  systemUsers: User[];
  loading: boolean;
  error: string | null;
  count: number;
  success: boolean;
}

// ─────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────
const initialState: SystemUsersState = {
  systemUsers: [],
  loading: false,
  error: null,
  count: 0,
  success: false,
};

// ─────────────────────────────────────────
// Slice Definition
// ─────────────────────────────────────────
const systemUsersSlice = createSlice({
  name: "systemUsers",
  initialState,
  reducers: {
    clearSystemUsersError: (state) => {
      state.error = null;
    },
    resetSystemUsersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSystemUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllSystemUsers.fulfilled,
        (state, action: PayloadAction<SystemUsersResponse>) => {
          state.loading = false;
          state.systemUsers = action.payload.data;
          state.count = action.payload.count;
          state.success = action.payload.success;
          state.error = null;
        }
      )
      .addCase(fetchAllSystemUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.systemUsers = [];
        state.count = 0;
        state.success = false;
      });
  },
});

// ─────────────────────────────────────────
// Exports
// ─────────────────────────────────────────
export const { clearSystemUsersError, resetSystemUsersState } = systemUsersSlice.actions;
export default systemUsersSlice.reducer;
