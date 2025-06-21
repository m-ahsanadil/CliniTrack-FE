export interface MedicalRecordRequest {
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

export interface MedicalRecordResponse {
  success: true;
    message: string;
}

export interface MedicalRecordErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type MedicalRecordApiResponse = MedicalRecordResponse | MedicalRecordErrorResponse;