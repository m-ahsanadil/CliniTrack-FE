export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface User {
    _id: string;
    userName: string;
    email: string;
    channelName: string;
    avatarId: string;
    avatarUrl: string;
    phone: string;
    subscribers: number;
}

export interface TokenInfo {
    expiresIn: string;
    issuedAt: string;
}

export interface LoginResponse {
    success: true;
    message: string;
    data: {
        token: string;
        user: User;
        tokenInfo: TokenInfo;
    };
}

// Error response
interface LoginErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type LoginApiResponse = LoginResponse | LoginErrorResponse;


export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: "doctor" | "staff" | "admin";
}

export interface RegisterResponse {
    success: true;
    message: string;
    user: {
        id: string;
        username: User;
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