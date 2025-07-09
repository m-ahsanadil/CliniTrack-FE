import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { CreateSuperAdminPostApiResponse, CreateSuperAdminPostRequest } from "./types";
import { createAdminApi } from "./api";


// 🆕 Create users
export const createUsersBySuperAdmin = createAsyncThunk(
  "superAdmin/create",
  async (payload: CreateSuperAdminPostRequest, { rejectWithValue }) => {
    try {
      const response: CreateSuperAdminPostApiResponse = await createAdminApi.create(payload);
      return response.success ? response : rejectWithValue(response.message || "Failed to create Users By super admin");
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message || "Failed to create Users By super admin");
    }
  }
);


interface CreateUsersBySuperAdminState {
  createLoading: boolean;
  createError: string | null;
  createSuccess: boolean;
}

const initialState: CreateUsersBySuperAdminState = {
  createLoading: false,
  createError: null,
  createSuccess: false,
};

const createUsersBySuperAdminSlice = createSlice({
  name: "create-superAdmin",
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },

  },
  extraReducers: (builder) => {
    builder
      // 🧾 CREATE
      .addCase(createUsersBySuperAdmin.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createUsersBySuperAdmin.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
      })
      .addCase(createUsersBySuperAdmin.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      })
  },
});

export const { clearCreateError, clearCreateSuccess } = createUsersBySuperAdminSlice.actions;
export default createUsersBySuperAdminSlice.reducer;