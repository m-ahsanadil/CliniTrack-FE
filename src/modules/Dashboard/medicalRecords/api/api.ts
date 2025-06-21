// ✅ Medical Records API - src/modules/MedicalRecord/api.ts
import { ENDPOINTS } from "@/src/redux/config/api";
import apiService from "@/src/redux/config/apiService";
import { MedicalRecordRequest, MedicalRecordApiResponse } from "./types";

export const medicalRecordApi = {
        getAll: (): Promise<MedicalRecordApiResponse> => apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_ALL),
        getById: (id: string | number): Promise<MedicalRecordApiResponse> => apiService.get(ENDPOINTS.MEDICAL_RECORDS.GET_BY_ID(id)),
        create: (payload: MedicalRecordRequest): Promise<MedicalRecordApiResponse> => apiService.post(ENDPOINTS.MEDICAL_RECORDS.CREATE, payload),
        update: (id: string | number, payload: MedicalRecordRequest): Promise<MedicalRecordApiResponse> => apiService.put(ENDPOINTS.MEDICAL_RECORDS.UPDATE(id), payload),
        delete: (id: string | number): Promise<MedicalRecordApiResponse> => apiService.delete(ENDPOINTS.MEDICAL_RECORDS.DELETE(id)),
};


export const reportApi = {
        getAll: () => apiService.get(ENDPOINTS.REPORT.GET_ALL),
        getById: (id: string | number) => apiService.get(ENDPOINTS.REPORT.GET_BY_ID(id)),
        create: (payload: unknown) => apiService.post(ENDPOINTS.REPORT.CREATE, payload),
        update: (id: string | number, payload: unknown) => apiService.put(ENDPOINTS.REPORT.UPDATE(id), payload),
        delete: (id: string | number) => apiService.delete(ENDPOINTS.REPORT.DELETE(id)),
};