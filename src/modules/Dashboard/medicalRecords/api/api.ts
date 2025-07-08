import { ENDPOINTS } from "@/src/redux/config/api";
import { MedicalRecordDeleteResponse, MedicalRecordGetAllApiResponse, MedicalRecordGetAllResponse, MedicalRecordPost, MedicalRecordPostApiResponse, MedicalRecordPostResponse, PatientProviderResponse } from "./types";
import apiService from "@/src/redux/config/apiService";


export const medicalRecordApi = {
  // Create a new Medical Record
  create: (payload: MedicalRecordPost): Promise<MedicalRecordPostApiResponse> => {
    return apiService.post(ENDPOINTS.MEDICAL_RECORDS.CREATE, payload);
  },

  // Get all Medical Records
  getAll: (): Promise<MedicalRecordGetAllApiResponse> => {
    return apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_ALL);
  },

  // Get a single Medical Record by ID
  getById: (id: string | number): Promise<MedicalRecordGetAllResponse> => {
    return apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_BY_ID(id));
  },

  // Update Medical Record by ID
  update: (id: string | number, payload: MedicalRecordPost): Promise<MedicalRecordPostApiResponse> => {
    return apiService.put(ENDPOINTS.MEDICAL_RECORDS.UPDATE(id), payload);
  },

  // Delete Medical Record by ID
  delete: (id: string | number): Promise<MedicalRecordDeleteResponse> => {
    return apiService.delete(ENDPOINTS.MEDICAL_RECORDS.DELETE(id));
  },

  getSelected: (): Promise<PatientProviderResponse> =>
    apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_SELECTED),
};