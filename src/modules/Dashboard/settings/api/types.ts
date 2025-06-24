export interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
    email: string;
}

export interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
    _id?: string;
}

export interface Insurance {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    subscriberId: string;
    relationshipToSubscriber: string;
    effectiveDate: string;
    expirationDate: string;
}

export interface PatientRequest {
    patientId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    ssn: string;
    phone: string;
    email: string;
    address: Address;
    emergencyContact: EmergencyContact;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: Medication[];
    insurance: Insurance;
    status: string;
    registrationDate: string;
    preferredLanguage: string;
    createdBy: string;
    updatedBy: string;
}

// ✅ Response Patient Object (full data from backend)
export interface Patient {
    _id: string;
    patientId: string;
    firstName: string;
    lastName: string;
    fullName: string;
    dateOfBirth: string;
    age: number;
    gender: string;
    ssn: string;
    phone: string;
    email: string;
    address: Address;
    emergencyContact: EmergencyContact;
    allergies: string[];
    chronicConditions: string[];
    currentMedications: Medication[];
    insurance: Insurance;
    status: string;
    registrationDate: string;
    preferredLanguage: string;
    tags: string[];
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// ✅ Success Response
export interface PatientResponse {
    success: true;
    message: string;
    data: Patient;
}

export interface PatientErrorResponse {
    success: false;
    message: string;
    data: string;
}

// Combined response type
export type PatientApiResponse = PatientResponse | PatientErrorResponse;