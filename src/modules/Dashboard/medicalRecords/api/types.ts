export interface MedicalRecordPostRequest {
    patientId: string;
    providerId: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    recordDate: string;
    createdBy: string;
    updatedBy: string;
}

export interface MedicalRecordPostResponse {
    success: true;
    message: string;
}

export interface MedicalRecordPostErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type MedicalRecordPostApiResponse = MedicalRecordPostResponse | MedicalRecordPostErrorResponse;

// GET ALL 
export interface MedicalRecord {
    _id: string;
    patientId: {
        _id: string;
        fullName: string;
    };
    providerId: {
        _id: string;
        name: string;
    };
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    recordDate: string; // ISO Date string
    createdBy: string;
    updatedBy: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    __v: number;
}

export interface MedicalRecordGetResponse {
    success: boolean;
    count: number;
    data: MedicalRecord[];
}

// Combined response type
export type MedicalRecordGetApiResponse = MedicalRecordGetResponse | MedicalRecordPostErrorResponse;