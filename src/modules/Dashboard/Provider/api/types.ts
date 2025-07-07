import { ProviderStatus } from "@/src/enum";

export interface ProviderAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Provider {
    address: ProviderAddress;
    _id: string;
    providerId: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    licenseNumber: string;
    npiNumber: string;
    clinicAffiliation: string;
    status: ProviderStatus.ACTIVE | ProviderStatus.INACTIVE;
    createdBy: string;
    updatedBy: string;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    __v: number;
}

export interface ProviderRequest extends Omit<Provider, '_id' | 'createdAt' | 'updatedAt' | '__v'> {

}

export interface ProviderPostResponse {
    success: true;
    message: string;
    data: Provider;
}

export interface ProviderPostErrorResponse {
    success: false;
    message: string;
    data: string;
}

export type ProviderPostApiResponse = ProviderPostResponse | ProviderPostErrorResponse;


// GET ALL PROVIDER TYPES
export interface ProviderGet extends Provider {

}

export interface ProviderGetResponse {
    success: true;
    count: number;
    data: ProviderGet[];
}

export interface ProviderGetErrorResponse {
    success: false;
    message: string;
    data: string;
}

export type ProviderGetApiResponse = ProviderGetResponse | ProviderGetErrorResponse;

export interface ProviderGetByIdResponse {
    success: boolean;
    data: Provider;
}

export type ProviderGetApiByIdResponse = ProviderGetByIdResponse | ProviderGetErrorResponse;

export interface ProviderNames {
    _id: string;
    providerId: string;
    name: string;
}
export interface ProvideristGetResponse {
    success: boolean;
    count: number;
    message?: string;
    data: ProviderNames[];
}