import { AppointmentApiResponse, AppointmentGetApiResponse, AppointmentRequest } from "./types";
import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";

export const appointmentsApi = {
        // Create a new patient
        createAppointments: (appointmentData: AppointmentRequest): Promise<AppointmentApiResponse> => {
                return apiService.post(ENDPOINTS.APPOINTMENT.CREATE, appointmentData);
        },

        // Get all Appointments
        getAllAppointments: (): Promise<AppointmentGetApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_ALL);
        },

        // Get a single Appointment by ID
        getAppointmentById: (id: string | number): Promise<AppointmentApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_BY_ID(id));
        },

        // Update Appointment by ID
        updateAppointment: (id: string | number, AppointmentData: AppointmentRequest): Promise<AppointmentApiResponse> => {
                return apiService.put(ENDPOINTS.APPOINTMENT.UPDATE(id), AppointmentData);
        },

        // Delete Appointment by ID
        deleteAppointment: (id: string | number): Promise<AppointmentApiResponse> => {
                return apiService.delete(ENDPOINTS.APPOINTMENT.DELETE(id));
        }
};
