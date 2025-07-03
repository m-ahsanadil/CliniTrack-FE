import { UserRole } from "@/src/enum";

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    department?: string;
    fullName?: string;
}

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: UserInfo;
}

// Error response
export interface LoginErrorResponse {
    success: false;
    message: string;
    errors: string[];
}

// Combined response type
export type LoginApiResponse = LoginResponse | LoginErrorResponse;


export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole.ADMIN | UserRole.DOCTOR | UserRole.PATIENT | UserRole.STAFF | '';
    dob: string;
    education: string;
    experience: string;
}

export interface RegisterResponse {
    success: true;
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        fullName: string,
        role: string;
        age: number,
        dob: string,
        education: string,
        experience: string
    };
}

export interface RegisterErrorResponse {
    success: false;
    message: string;
    data: string;
}


export type RegisterApiResponse = RegisterResponse | RegisterErrorResponse;