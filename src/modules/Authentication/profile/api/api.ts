import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { UpdateProfileRequest, UpdateProfileResponse, UploadPhotoResponse } from "./types";

export const profileApi = {
    get_photo: (id: string | number): Promise<Blob> => {
        return apiService.downloadFile(ENDPOINTS.AUTH.GET_PHOTO(id));
    },

    // Update user profile
    update: (payload: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        return apiService.put(ENDPOINTS.AUTH.UPDATE, payload);
    },
    
    upload_photo: (formData: FormData) => {
        return apiService.put(ENDPOINTS.AUTH.UPLOAD_PHOTO, formData); 
    },
}