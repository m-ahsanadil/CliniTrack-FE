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