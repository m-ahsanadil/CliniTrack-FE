import { UserRole } from "@/src/enum";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Admin, Staff, Doctor, SuperAdmin, AdminGetApiResponse, StaffGetApiResponse, DoctorGetApiResponse, SuperAdminGetApiResponse } from "./types";
import { dashboardApi } from "./api";

// Union types for flexibility
export type DashboardData = Admin | Staff | Doctor | SuperAdmin;
export type Role = UserRole.ADMIN | UserRole.STAFF | UserRole.DOCTOR | UserRole.SUPER_ADMIN;

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

// Thunk to fetch dashboard data based on role
export const fetchDashboardData = createAsyncThunk<
  DashboardData, // Return type
  Role,           // Argument (role)
  { rejectValue: string } // Rejection value
>("dashboard/fetch", async (role, { rejectWithValue }) => {
  try {
    let response:
      | AdminGetApiResponse
      | StaffGetApiResponse
      | DoctorGetApiResponse
      | SuperAdminGetApiResponse;

    switch (role) {
      case UserRole.SUPER_ADMIN:
        response = await dashboardApi.getSuperAdmin();
        break;
      case UserRole.ADMIN:
        response = await dashboardApi.getAdmin();
        break;
      case UserRole.STAFF:
        response = await dashboardApi.getStaff();
        break;
      case UserRole.DOCTOR:
        response = await dashboardApi.getDoctor();
        break;
      default:
        return rejectWithValue("Invalid role");
    }

    if (response.success) return response.data;
    return rejectWithValue(response.message || "Failed to fetch dashboard data");
  } catch (err) {
    return rejectWithValue("Something went wrong");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default dashboardSlice.reducer;
