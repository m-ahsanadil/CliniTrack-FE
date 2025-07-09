
export interface CreateSuperAdminPostRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: string;
    education: string;
    dob: string;
    experience: string
}

export interface CreateSuperAdminPostResponse {
    success: true;
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string
    }
}

export interface CreateSuperAdminPostErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type CreateSuperAdminPostApiResponse = CreateSuperAdminPostResponse | CreateSuperAdminPostErrorResponse;