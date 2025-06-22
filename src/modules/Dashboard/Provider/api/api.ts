import { PatientApiResponse, PatientRequest } from "./types";
import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";

export const patientApi = {
        // Create a new patient
        createPatient: (patientData: PatientRequest): Promise<PatientApiResponse> => {
                return apiService.post(ENDPOINTS.PATIENT.CREATE, patientData);
        },

        // Get all patients
        getAllPatients: (): Promise<PatientApiResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_ALL);
        },

        // Get a single patient by ID
        getPatientById: (id: string | number): Promise<PatientApiResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_BY_ID(id));
        },

        // Update patient by ID
        updatePatient: (
                id: string | number,
                patientData: PatientRequest
        ): Promise<PatientApiResponse> => {
                return apiService.put(ENDPOINTS.PATIENT.UPDATE(id), patientData);
        },

        // Delete patient by ID
        deletePatient: (id: string | number): Promise<PatientApiResponse> => {
                return apiService.delete(ENDPOINTS.PATIENT.DELETE(id));
        }
};
