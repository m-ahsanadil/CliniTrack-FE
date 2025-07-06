import { ENDPOINTS } from "@/src/redux/config/api";
import { LoginApiResponse, LoginRequest, RegisterApiResponse, RegisterRequest, SuperAdminLoginApiResponse, SuperAdminLoginRequest } from "./types";
import apiService from "@/src/redux/config/apiService";

export const loginApi = {
        login: (credentials: LoginRequest): Promise<LoginApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
        },
        superAdminLogin: (credentials: SuperAdminLoginRequest): Promise<SuperAdminLoginApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.SUPER_ADMIN_LOGIN, credentials)
        }
}

export const registerApi = {
        register: (credentials: RegisterRequest): Promise<RegisterApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.REGISTER, credentials);
        }
}