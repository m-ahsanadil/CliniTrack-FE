import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { SystemUsersApiResponse } from "./types";

export const systemUsersApi = {
        // Get all Users for super admin
        getAll: (): Promise<SystemUsersApiResponse> => {
                return apiService.get(ENDPOINTS.DASHBOARD.GET_SUPER_ADMIN_USER);
        },

};