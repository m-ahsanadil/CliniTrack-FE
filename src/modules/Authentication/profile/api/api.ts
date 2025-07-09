import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { GetUserProfileApiResponse, UpdateProfileRequest, UpdateProfileResponse, UploadPhotoResponse } from "./types";

export const profileApi = {
    get_photo: (id: string | number): Promise<Blob> =>
        apiService.get(ENDPOINTS.AUTH.GET_PHOTO(id), {
            responseType: 'blob'
        }),

    // Update user profile
    update: (payload: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        return apiService.put(ENDPOINTS.AUTH.UPDATE, payload);
    },
    
    getProfile: (): Promise<GetUserProfileApiResponse> => {
        return apiService.get(ENDPOINTS.AUTH.GET_PROFILE)
    },
    // In api.ts
    upload_photo: (formData: FormData): Promise<UploadPhotoResponse> => {
        return apiService.put(ENDPOINTS.AUTH.UPLOAD_PHOTO, formData);
    },
}