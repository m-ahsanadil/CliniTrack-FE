import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { systemUsersApi } from "./api";
import { SystemUsersApiResponse, SystemUsersResponse, UpdatePasswordUser, UpdatePasswordUserApiResponse, User } from "./types";

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


// ✏️ Update patient
export const updateUsersBySuperAdmin = createAsyncThunk(
  "user/update",
  async (
    { id, payload }: { id: string | number; payload: UpdatePasswordUser },
    { rejectWithValue }
  ) => {
    try {
      const response: UpdatePasswordUserApiResponse = await systemUsersApi.update(id, payload);
      return response.success ? { id, updatedUser: response.data } : rejectWithValue(response.message || "Failed to update patient");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to update patient");
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
  updateLoading: boolean;
  updateError: string | null;
  updateSuccess: boolean;

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
  updateLoading: false,
  updateError: null,
  updateSuccess: false
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
    resetUpdateStatus: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
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
      })

      .addCase(updateUsersBySuperAdmin.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUsersBySuperAdmin.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.updateError = null;

        // 🔄 Optional: Update user in list (if needed)
        const updatedUser = action.payload.updatedUser;
        const index = state.systemUsers.findIndex((user) => user._id === action.payload.id);
        if (index !== -1) {
          state.systemUsers[index] = {
            ...state.systemUsers[index],
            ...updatedUser,
          };
        }
      })
      .addCase(updateUsersBySuperAdmin.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.updateError = action.payload as string;
      });

  },
});

// ─────────────────────────────────────────
// Exports
// ─────────────────────────────────────────
export const { clearSystemUsersError, resetSystemUsersState, resetUpdateStatus } = systemUsersSlice.actions;
export default systemUsersSlice.reducer;
