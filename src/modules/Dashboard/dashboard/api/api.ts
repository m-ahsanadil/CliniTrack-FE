import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { AdminGetApiResponse, DoctorGetApiResponse, StaffGetApiResponse } from "./types";

export const dashboardApi = {
    getAdmin: (): Promise<AdminGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_ADMIN),

    getStaff: (): Promise<StaffGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_STAFF),

    getDoctor: (): Promise<DoctorGetApiResponse> =>
        apiService.get(ENDPOINTS.DASHBOARD.GET_DOCTOR),

};