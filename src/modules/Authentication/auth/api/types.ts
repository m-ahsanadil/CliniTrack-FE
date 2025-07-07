import { UserRole } from "@/src/enum";

export interface UserInfo {
    id: string;
    username: string;
    name: string;
    token?: string;
    email?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    avatar?: string;
    department?: string;
    fullName?: string;
    dob: string;
    age: number;
    education: string;
    experience: string;
    degree: string;
    field: string;
    intro: string;
    speciality: string;
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


// SUPER ADMIN LOGIN INTERFACE:
export interface SuperAdminLoginRequest {
    username: string;
    password: string;
}

export interface SuperAdminUser {
    id: string;
    username: string;
    role: UserRole.SUPER_ADMIN;
    token: string;
    email?: string;
    department?: string;
    avatar?: string
};


export interface SuperAdminLoginResponse {
    success: true;
    message: string;
    user: SuperAdminUser;
}

// Error response
export interface SuperAdminLoginErrorResponse {
    success: false;
    message: string;
}

// Combined response type
export type SuperAdminLoginApiResponse = SuperAdminLoginResponse | SuperAdminLoginErrorResponse;


export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: UserRole.ADMIN | UserRole.DOCTOR | UserRole.PATIENT | UserRole.STAFF | UserRole.SUPER_ADMIN | string;
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