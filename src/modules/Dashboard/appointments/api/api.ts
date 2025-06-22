import { AppointmentApiResponse, AppointmentGetApiResponse, AppointmentPostApiResponse, AppointmentRequest } from "./types";
import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";

export const appointmentsApi = {
        // Create a new patient
        create: (appointmentData: AppointmentRequest): Promise<AppointmentPostApiResponse> => {
                return apiService.post(ENDPOINTS.APPOINTMENT.CREATE, appointmentData);
        },

        // Get all Appointments
        getAll: (): Promise<AppointmentGetApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_ALL);
        },

        // Get a single Appointment by ID
        getById: (id: string | number): Promise<AppointmentApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_BY_ID(id));
        },

        // Update Appointment by ID
        update: (id: string | number, AppointmentData: AppointmentRequest): Promise<AppointmentApiResponse> => {
                return apiService.put(ENDPOINTS.APPOINTMENT.UPDATE(id), AppointmentData);
        },

        // Delete Appointment by ID
        delete: (id: string | number): Promise<AppointmentApiResponse> => {
                return apiService.delete(ENDPOINTS.APPOINTMENT.DELETE(id));
        }
};
