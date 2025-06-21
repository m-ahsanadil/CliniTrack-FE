import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { DoctorApiResponse, DoctorProfileRequest } from "./types";

export const doctorProviderApi = {
        getAll: () =>
                apiService.get(ENDPOINTS.PROVIDER.GET_ALL),
        getById: (id: string | number) =>
                apiService.get(ENDPOINTS.PROVIDER.GET_BY_ID(id)),
        create: (payload: DoctorProfileRequest): Promise<DoctorApiResponse> =>
                apiService.post(ENDPOINTS.PROVIDER.CREATE, payload),// post
        update: (id: string | number, payload: DoctorProfileRequest): Promise<DoctorApiResponse> =>
                apiService.put(ENDPOINTS.PROVIDER.UPDATE(id), payload),
        delete: (id: string | number) =>
                apiService.delete(ENDPOINTS.PROVIDER.DELETE(id)),
};
