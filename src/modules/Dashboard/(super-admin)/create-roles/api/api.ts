import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { CreateSuperAdminPostApiResponse, CreateSuperAdminPostRequest } from "./types";

export const createAdminApi = {
        // Create a new User by super admin
        create: (paylod: CreateSuperAdminPostRequest): Promise<CreateSuperAdminPostApiResponse> => {
                return apiService.post(ENDPOINTS.DASHBOARD.CREATE_SUPER_ADMIN, paylod);
        },
};