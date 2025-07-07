export interface GetUserProfile {
    _id: string;
    department?: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    dob: string;
    education: string;
    experience: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    age: number;
    degree: string;
    field: string;
    intro: string;
    name: string;
    speciality: string;
    passwordHash?: string;
}

export interface GetUserProfileResponse {
    success: boolean;
    message: string;
    user: GetUserProfile;
}

export interface GetUserProfileErrorResponse {
    success: false;
    message: string;
}

export type GetUserProfileApiResponse = | GetUserProfileResponse | GetUserProfileErrorResponse;



export interface UpdateProfileRequest {
    name?: string;
    age?: number | '';
    dob?: string;
    speciality?: string;
    intro?: string;
    field?: string;
    degree?: string;
    education?: string;
    experience?: string;
}


export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    user: GetUserProfile
}

export interface UploadPhotoRequest {
    file: File; // Usually image/jpeg or image/png
}

export interface UploadPhotoResponse {
    success: boolean;
    message: string;
    userId: string;
}
export interface UploadPhotoErrorResponse {
    success: false;
    message: string;
    errors: string[];
}

export type UploadPhotoApiResponse = UploadPhotoResponse | UploadPhotoErrorResponse


