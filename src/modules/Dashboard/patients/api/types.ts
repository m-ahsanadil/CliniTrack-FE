interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  subscriberId: string;
  relationshipToSubscriber: string;
  effectiveDate: string; // ISO date string
  expirationDate: string; // ISO date string
}

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string; // ISO date string
}

export interface Patient {
  _id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string; // ISO date string
  age: number;
  gender: string;
  ssn: string;
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  insurance: Insurance;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Medication[];
  status: string;
  registrationDate: string; // ISO date string
  preferredLanguage: string;
  tags: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface PatientGetResponse {
  message?: string;
  success: boolean;
  count: number;
  data: Patient[];
}



export interface PatientDeleteResponse {
    success: false;
    message: string;
    data?: string;
}