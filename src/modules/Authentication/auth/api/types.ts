import { UserRole } from "@/src/enum";

export interface UserInfo {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    createdAt: string; // ISO string format
    updatedAt: string;
}

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}


// export interface DecodedToken {
//     sub: string; // user id
//     email: string;
//     role: "doctor" | "staff" | "admin";
//     username?: string;
//     iat?: number;
//     exp?: number;
//     department?: string;
// }

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


export interface RegisterRequest extends Omit<UserInfo, "id"> { }


export interface RegisterResponse {
    success: true;
    message: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
    };
}

export interface RegisterErrorResponse {
    success: false;
    message: string;
    data: string;
}


export type RegisterApiResponse = RegisterResponse | RegisterErrorResponse;