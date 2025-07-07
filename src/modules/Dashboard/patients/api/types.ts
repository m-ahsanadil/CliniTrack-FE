import { PatientStatus } from "@/src/enum";

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

export interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string; // ISO date string
}

export interface Patient {
  address: Address;
  emergencyContact: EmergencyContact;
  insurance: Insurance;
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
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Medication[];
  status: PatientStatus.ACTIVE | PatientStatus.DECEASED | PatientStatus.INACTIVE;
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

export interface PatientGetErrorResponse {
  success: false;
  message: string;
  data?: string;
}

export type PatientGetApiResponse = PatientGetResponse | PatientGetErrorResponse;

export interface PatientPostRequest {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  ssn: string;
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: Omit<Medication, "_id">[]; // when creating, _id isn't required
  insurance: Insurance;
  status: PatientStatus.ACTIVE | PatientStatus.DECEASED | PatientStatus.INACTIVE;
  registrationDate: string; // ISO date string
  preferredLanguage: string;
  createdBy: string;
  updatedBy: string;
}

export interface PatientPostResponse {
  success: boolean;
  message?: string;
  data: Patient;
}

export interface PatientPostErrorResponse {
  success: false;
  message: string;
  errors?: string[];
}

export type PatientPostApiResponse = PatientPostResponse | PatientPostErrorResponse;

// DELETE Patient
export interface PatientDeleteResponse {
  success: boolean;
  message: string;
}

export interface PatientDeleteErrorResponse {
  success: false;
  message: string;
  data?: string;
}

export type PatientDeleteApiResponse = PatientDeleteResponse | PatientDeleteErrorResponse;

// GET by ID — returns a single Patient
export interface PatientGetByIdResponse {
  success: boolean;
  data: Patient;
}

export interface PatientNames {
  _id: string;
  patientId: string;
  fullName: string;
}

export interface PatientListGetResponse {
  success: boolean;
  count: number;
  message?: string;
  data: PatientNames[];
}
