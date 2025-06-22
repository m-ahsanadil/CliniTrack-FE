import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { MedicalRecordDeleteResponse, MedicalRecordGetResponse } from "./types";

export const medicalRecordApi = {
        // Create a new Medical Record
        create: (payload: MedicalRecordPostRequest): Promise<MedicalRecordPostApiResponse> => {
                return apiService.post(ENDPOINTS.MEDICAL_RECORDS.CREATE, payload)
        },

        // Get all Medical Record
        getAll: (): Promise<MedicalRecordGetResponse> => {
                return apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_ALL)
        },

        // Get a single Medical Record by ID
        getById: (id: string | number): Promise<MedicalRecordGetApiResponse> => {
                return apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_BY_ID(id))
        },


        // Update Medical Record by ID
        update: (id: string | number, payload: MedicalRecordPostRequest): Promise<MedicalRecordPostApiResponse> => {
                return apiService.put(ENDPOINTS.MEDICAL_RECORDS.UPDATE(id), payload)
        },

        // Delete Medical Record by ID
        delete: (id: string | number): Promise<MedicalRecordDeleteResponse> => {
                return apiService.delete(ENDPOINTS.MEDICAL_RECORDS.DELETE(id))
        }
};

