
export interface PatientRef {
    _id: string;
    fullName: string;
}

export interface ProviderRef {
    _id: string;
    name: string;
}


// REQUESTING DATA
export interface MedicalRecordPost {
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

// export interface MedicalRecord {

// }


// RESPONSE AFTER POSTING THE DATA
export interface MedicalRecordPostResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        patientId: string;
        providerId: string;
        diagnosis: string;
        treatment: string;
        prescription: string;
        notes: string;
        recordDate: string;   // ISO string
        createdBy: string;
        updatedBy: string;
        createdAt: string;    // ISO string
        updatedAt: string;    // ISO string
        __v: number;
    }
}

export interface MedicalRecordPostErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type MedicalRecordPostApiResponse = MedicalRecordPostResponse | MedicalRecordPostErrorResponse;


// GET ALL RESPONSE
export interface MedicalRecordGetAll {
    _id: string;
    patientId: PatientRef;
    providerId: ProviderRef;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    recordDate: string;   // ISO string
    createdBy: string;
    updatedBy: string;
    createdAt: string;    // ISO string
    updatedAt: string;    // ISO string
    __v: number;
}

export interface MedicalRecordGetAllResponse {
    success: boolean;
    message?: string;
    count: number;
    data: MedicalRecordGetAll[];
}

export interface MedicalRecordGetAllErrorResponse {
    success: false;
    message: string;
    data?: string;
}

export type MedicalRecordGetAllApiResponse = MedicalRecordGetAllResponse | MedicalRecordGetAllErrorResponse;


// DELETE /medical-records/:id (delete response)
export interface MedicalRecordDeleteResponse {
    success: boolean;
    message: string;
    data?: string;
}

export interface PatientProviderResponse {
    success: boolean;
    count: number;
    data: {
        patient: {
            id: string;
            name: string;
            provider: {
                id: string;
                name: string;
            };
        };
    }[];
}
