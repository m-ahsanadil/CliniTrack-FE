import { AppointmentDeleteApiResponse, AppointmentGetAllApiResponse, AppointmentGetByIdApiResponse, AppointmentRequest, AppointmentRequestResponseApiResponse, CancelAppointmentApiResponse, RescheduleAppointmentApiResponse, RescheduleAppointmentRequest } from "./types";
import apiService from "@/src/redux/config/apiService";
import { ENDPOINTS } from "@/src/redux/config/api";

export const appointmentsApi = {
        // Create a new Appointment
        create: (appointmentData: AppointmentRequest): Promise<AppointmentRequestResponseApiResponse> => {
                return apiService.post(ENDPOINTS.APPOINTMENT.CREATE, appointmentData);
        },

        // Get all Appointments
        getAll: (): Promise<AppointmentGetAllApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_ALL);
        },

        // Get a single Appointment by ID
        getById: (id: string | number): Promise<AppointmentGetByIdApiResponse> => {
                return apiService.get(ENDPOINTS.APPOINTMENT.GET_BY_ID(id));
        },

        // Update Appointment by ID
        update: (id: string | number, appointmentData: AppointmentRequest): Promise<AppointmentRequestResponseApiResponse> => {
                return apiService.put(ENDPOINTS.APPOINTMENT.UPDATE(id), appointmentData);
        },

        // Delete Appointment by ID
        delete: (id: string | number): Promise<AppointmentDeleteApiResponse> => {
                return apiService.delete(ENDPOINTS.APPOINTMENT.DELETE(id));
        },

        // Cancel Appointment by ID (PATCH)
        cancel: (id: string | number): Promise<CancelAppointmentApiResponse> => {
                return apiService.patch(ENDPOINTS.APPOINTMENT.CANCEL_APPOINTMENT(id));
        },

        // Reschedule Appointment by ID (PATCH)
        reschedule: (
                id: string | number,
                data: RescheduleAppointmentRequest
        ): Promise<RescheduleAppointmentApiResponse> => {
                return apiService.patch(ENDPOINTS.APPOINTMENT.RESCHEDULE_APPOINTMENT(id), data);
        },
};