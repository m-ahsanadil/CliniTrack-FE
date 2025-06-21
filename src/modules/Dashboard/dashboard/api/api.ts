import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";

export const providerApi = {
        getAll: () => apiService.get(ENDPOINTS.PROVIDER.GET_ALL),
        getById: (id: string | number) => apiService.get(ENDPOINTS.PROVIDER.GET_BY_ID(id)),
        create: (payload: unknown) => apiService.post(ENDPOINTS.PROVIDER.CREATE, payload),
        update: (id: string | number, payload: unknown) => apiService.put(ENDPOINTS.PROVIDER.UPDATE(id), payload),
        delete: (id: string | number) => apiService.delete(ENDPOINTS.PROVIDER.DELETE(id)),
};
