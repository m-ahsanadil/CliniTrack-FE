import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { SystemUsersApiResponse, UpdatePasswordUser, UpdatePasswordUserApiResponse } from "./types";

export const systemUsersApi = {
        // Get all Users for super admin
        getAll: (): Promise<SystemUsersApiResponse> => {
                return apiService.get(ENDPOINTS.DASHBOARD.GET_SUPER_ADMIN_USER);
        },
        // Update patient by ID
        update: (id: string | number, payload: UpdatePasswordUser): Promise<UpdatePasswordUserApiResponse> => {
                return apiService.put(ENDPOINTS.DASHBOARD.UPDATE_ADMIN_PASSWORD(id), payload);
        },
};