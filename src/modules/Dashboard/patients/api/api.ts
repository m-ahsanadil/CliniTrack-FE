import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import { PatientDeleteResponse, PatientGetResponse } from "./types";

export const patientsApi = {
        // Create a new patient
        createPatient: (patientData: PatientRequest): Promise<PatientPostApiResponse> => {
                return apiService.post(ENDPOINTS.PATIENT.CREATE, patientData);
        },

        // Get all patients
        getAllPatients: (): Promise<PatientGetResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_ALL);
        },

        // Get a single patient by ID
        getPatientById: (id: string | number): Promise<PatientsGetApiResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_BY_ID(id));
        },

        // Update patient by ID
        updatePatient: (
                id: string | number,
                patientData: PatientRequest
        ): Promise<PatientPostApiResponse> => {
                return apiService.put(ENDPOINTS.PATIENT.UPDATE(id), patientData);
        },

        // Delete patient by ID
        deletePatient: (id: string | number): Promise<PatientDeleteResponse> => {
                return apiService.delete(ENDPOINTS.PATIENT.DELETE(id));
        }
};
