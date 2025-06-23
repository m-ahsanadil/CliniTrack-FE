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

export interface MedicalRecordGetByIdResponse {
    success: true;
    count: number;
    data: MedicalRecord;
}

export interface MedicalRecordPostRequest {
    patientId: string;      // Patient _id as string
    providerId: string;     // Provider _id as string
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
    recordDate: string;     // ISO date string
    createdBy: string;
    updatedBy: string;
}

export interface MedicalRecordPostApiResponse {
  success: true;
  data: MedicalRecord;
}

// GET /medical-records/:id
export interface MedicalRecordGetApiResponse {
  success: true;
  data: MedicalRecord;
}

// PUT /medical-records/:id
export interface MedicalRecordUpdateRequest {
  patientId?: string;
  providerId?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  recordDate?: string;
  updatedBy: string;
}


export interface MedicalRecordDeleteResponse {
    success: false;
    message: string;
    data?: string;
}