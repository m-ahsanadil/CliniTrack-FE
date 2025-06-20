import { ENDPOINTS } from "@/src/redux/config/api";
import { LoginApiResponse, LoginRequest } from "./types";
import apiService from "@/src/redux/config/apiService";

export const loginApi = {
        login: (credentials: LoginRequest): Promise<LoginApiResponse> => {
                return apiService.post(ENDPOINTS.AUTH.LOGIN, credentials);
        }
}