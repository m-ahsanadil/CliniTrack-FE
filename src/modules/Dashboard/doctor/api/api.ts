import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { DoctorApiResponse, DoctorProfileRequest, ProviderAdminProfileRequest, ProviderAdminProfileResponse } from "./types";

export const ProviderAdminProfileApi = {
        getAll: (): Promise<{ data: ProviderAdminProfileRequest[] }> =>
                apiService.get(ENDPOINTS.PROVIDER.GET_ALL),
        getById: (id: string | number) =>
                apiService.get(ENDPOINTS.PROVIDER.GET_BY_ID(id)),
        create: (payload: DoctorProfileRequest): Promise<ProviderAdminProfileResponse> =>
                apiService.post(ENDPOINTS.PROVIDER.CREATE, payload),// post
        update: (id: string | number, payload: ProviderAdminProfileRequest): Promise<ProviderAdminProfileResponse> =>
                apiService.put(ENDPOINTS.PROVIDER.UPDATE(id), payload),
        delete: (id: string | number) =>
                apiService.delete(ENDPOINTS.PROVIDER.DELETE(id)),
};
