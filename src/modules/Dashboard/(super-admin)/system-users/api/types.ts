import { UserRole } from "@/src/enum";

export interface User {
    _id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: UserRole.SUPER_ADMIN | UserRole.ADMIN | UserRole.DOCTOR | UserRole.PATIENT | UserRole.STAFF;
    fullName?: string;
    organization?: string;
    status?: string;
    lastActive?: string
    joinDate?: string;
    phone?: string;
    avatar?: string | null;
    location?: string
}

export interface SystemUsersErrorResponse {
    success: false;
    message: string;
    error?: []
}

export interface SystemUsersResponse {
    success: boolean;
    message?: string;
    count: number;
    data: User[];
}

// Combined response type
export type SystemUsersApiResponse = SystemUsersResponse | SystemUsersErrorResponse;

export interface UpdatePasswordUser {
    newPassword: string;
}

export interface UpdatePasswordUserResponse {
    success: boolean;
    message: string;
    data?: any
}

// interfaces/error.ts

export interface UpdatePasswordUserErrorResponse {
    success: false;
    message: string;
    statusCode?: number; // Optional if your backend adds it
}

// Combined response type
export type UpdatePasswordUserApiResponse = UpdatePasswordUserResponse | UpdatePasswordUserErrorResponse;

