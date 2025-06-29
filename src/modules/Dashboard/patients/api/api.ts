import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";
import {
        PatientDeleteApiResponse,
        PatientGetResponse,
        PatientPostRequest,
        PatientPostResponse,
        PatientGetApiResponse,
        PatientBasicInfoResponse
} from "./types";
import { ProviderGetApiByIdResponse } from "../../Provider/api/types";

export const patientsApi = {
        // Create a new patient
        create: (patientData: PatientPostRequest): Promise<PatientPostResponse> => {
                return apiService.post(ENDPOINTS.PATIENT.CREATE, patientData);
        },

        // Getting basic info
        getBasicInfo: (): Promise<PatientBasicInfoResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_BASIC_INFO);
        },

        // Get all patients
        getAll: (): Promise<PatientGetResponse> => {
                return apiService.get(ENDPOINTS.PATIENT.GET_ALL);
        },

        // Get a single patient by ID
        getById: (id: string | number): Promise<ProviderGetApiByIdResponse> => {
                return apiService.get(ENDPOINTS.PROVIDER.GET_BY_ID(id));
        },

        // Update patient by ID
        update: (id: string | number, patientData: PatientPostRequest): Promise<PatientPostResponse> => {
                return apiService.put(ENDPOINTS.PATIENT.UPDATE(id), patientData);
        },

        // Delete patient by ID
        delete: (id: string | number): Promise<PatientDeleteApiResponse> =>
                apiService.delete(ENDPOINTS.PATIENT.DELETE(id)),

};
