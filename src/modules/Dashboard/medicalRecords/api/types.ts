export interface PatientRef {
    _id: string;
    fullName: string;
}

export interface ProviderRef {
    _id: string;
    name: string;
}

export interface MedicalRecord {
    _id: string;
    patientId: PatientRef;
    providerId: ProviderRef;
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
    success: true;
    count: number;
    data: MedicalRecord[];
}

export interface MedicalRecordDeleteResponse {
    success: false;
    message: string;
    data?: string;
}