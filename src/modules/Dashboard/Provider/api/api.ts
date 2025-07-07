import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { Provider, ProviderGetApiResponse, ProvideristGetResponse, ProviderPostApiResponse, ProviderRequest } from "./types";

export const providerApi = {
        getAll: (): Promise<ProviderGetApiResponse> => {
                return apiService.get(ENDPOINTS.PROVIDER.GET_ALL)
        },

        // Getting Doctor names
        getDoctorNames: (): Promise<ProvideristGetResponse> => {
                return apiService.get(ENDPOINTS.PROVIDER.GET_PROVIDERS_NAME);
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
