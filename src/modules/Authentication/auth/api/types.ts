export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    password?: string;
    role: "doctor" | "staff" | "admin";
    department?: string
}

export interface LoginResponse {
    success: true;
    message: string;
    token: string
    user: User;
}

// Error response
interface LoginErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type LoginApiResponse = LoginResponse | LoginErrorResponse;


export interface RegisterRequest extends Omit<User, "id"> { }


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