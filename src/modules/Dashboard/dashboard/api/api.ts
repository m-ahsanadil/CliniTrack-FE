import { ENDPOINTS } from "@/src/redux/config/api";
import { AdminGetApiResponse, DoctorGetApiResponse, StaffGetApiResponse, SuperAdminGetApiResponse } from "./types";
import apiService from "@/src/redux/config/apiService";

export const dashboardApi = {
    getSuperAdmin: (): Promise<SuperAdminGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_SUPER_ADMIN),
    getAdmin: (): Promise<AdminGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_ADMIN),

    getStaff: (): Promise<StaffGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_STAFF),

    getDoctor: (): Promise<DoctorGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_DOCTOR),

    getCount: () => apiService.get(ENDPOINTS.DASHBOARD.GET_COUNT),

    getStats: () => apiService.get(ENDPOINTS.DASHBOARD.GET_STATS)

};