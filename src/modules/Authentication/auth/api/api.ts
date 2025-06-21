import { ENDPOINTS } from "@/src/redux/config/api";
import { LoginApiResponse, LoginRequest, RegisterApiResponse, RegisterRequest } from "./types";
import apiService from "@/src/redux/config/apiService";

export const loginApi = {
        login: (credentials: LoginRequest): Promise<LoginApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
        }
}

export const registerApi = {
        register: (credentials: RegisterRequest): Promise<RegisterApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.REGISTER, credentials);
        }
}