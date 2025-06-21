interface Address {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface DoctorProfileRequest {
    providerId?: string
    name: string
    specialty: string
    phone: string
    email: string
    address: Address
    licenseNumber: string
    npiNumber: string
    clinicAffiliation: string
    status: string
    createdBy?: string
    updatedBy?: string
}

export interface DoctorResponse {
    success: true;
    message: string;
    data: DoctorProfileRequest;
}

export interface DoctorErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type DoctorApiResponse = DoctorResponse | DoctorErrorResponse;


export interface ProviderAdminProfileRequest extends DoctorProfileRequest {
    _id: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ProviderAdminProfileResponse {
    success: true;
    message: string;
    data: ProviderAdminProfileRequest;
}

export interface ProviderAdminProfileErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type ProviderAdminProfileApiResponse = ProviderAdminProfileResponse | ProviderAdminProfileErrorResponse;