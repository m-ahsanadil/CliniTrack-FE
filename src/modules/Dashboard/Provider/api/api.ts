import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { Provider, ProviderGetApiResponse, ProviderPostApiResponse, ProviderRequest } from "./types";

export const providerApi = {
        getAll: (): Promise<ProviderGetApiResponse> => {
                return apiService.get(ENDPOINTS.PROVIDER.GET_ALL
                )
        },

        getById: (id: string | number): Promise<{ success: boolean; data: Provider }> => {
                return apiService.get(ENDPOINTS.PROVIDER.GET_BY_ID(id))
        },

        create: (payload: ProviderRequest): Promise<ProviderPostApiResponse> => {
                return apiService.post(ENDPOINTS.PROVIDER.CREATE, payload)
        },
        update: (id: string | number, payload: ProviderRequest): Promise<ProviderPostApiResponse> => {
                return apiService.put(ENDPOINTS.PROVIDER.UPDATE(id), payload)
        },
        delete: (id: string | number): Promise<{ success: boolean; message: string }> => {
                return apiService.delete(ENDPOINTS.PROVIDER.DELETE(id))
        },
};
