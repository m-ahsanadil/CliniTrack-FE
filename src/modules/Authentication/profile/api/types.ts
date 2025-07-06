export interface UpdateProfileRequest {
    name?: string;
    age?: number;
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
    user: {
        _id: string;
        username: string;
        email: string;
        fullName: string;
        passwordHash: string;
        role: string;
        age: number;
        dob: string;
        education: string;
        experience: string;
        createdAt: string;
        updatedAt: string;
        name: string;
        photo?: {
            type: string;
            data: number[]
        }
        __v: number
    };
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


