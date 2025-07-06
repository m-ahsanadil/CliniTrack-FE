"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Appointment, AppointmentFilters, AppointmentRequest, AppointmentStats } from "@/src/modules/Dashboard/appointments/api/types";

type AppointmentContextType = {
    // State
    appointments: Appointment[];
    setAppointments: (val: Appointment[]) => void;

    // Loading states
    loading: boolean;
    setLoading: (val: boolean) => void;

    // Error states
    error: string | null;
    setError: (val: string | null) => void;

    // Filtered data (requires searchTerm from UI context)
    getFilteredAppointments: (searchTerm: string) => Appointment[];

    // Filter and search
    filters: AppointmentFilters;
    setFilters: (filters: AppointmentFilters) => void;
    filteredAppointments: Appointment[];
    appointmentStats: AppointmentStats;

    // CRUD operations
    handleAddAppointment: () => void;
    handleEditAppointment: (appointment: Appointment) => void;
    handleSaveAppointment: (appointmentData: AppointmentRequest) => Promise<void>;
    handleDeleteAppointment: (appointmentId: string) => Promise<void>;
    handleCancelAppointment: (appointmentId: string) => Promise<void>;
    handleRescheduleAppointment: (appointmentId: string, newData: Partial<AppointmentRequest>) => Promise<void>;

    // Utility functions
    getAppointmentById: (id: string) => Appointment | undefined;
    getAppointmentsByPatient: (patientId: string) => Appointment[];
    getAppointmentsByProvider: (providerId: string) => Appointment[];
    getAppointmentsByStatus: (status: string) => Appointment[];
    getAppointmentsByDate: (date: string) => Appointment[];
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filtered appointments function (takes searchTerm as parameter)
    const getFilteredAppointments = (searchTerm: string): Appointment[] => {
        if (!searchTerm.trim()) return appointments;

        return appointments.filter((appointment) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                appointment.patientId.fullName.toLowerCase().includes(searchLower) ||
                appointment.providerId.name.toLowerCase().includes(searchLower) ||
                appointment.type.toLowerCase().includes(searchLower) ||
                appointment.status.toLowerCase().includes(searchLower) ||
                appointment.departmentName.toLowerCase().includes(searchLower) ||
                appointment.appointmentNumber.toLowerCase().includes(searchLower) ||
                appointment.reasonForVisit.toLowerCase().includes(searchLower)
            );
        });
    };

    // CRUD Operations
    const handleAddAppointment = () => {
        // This should probably open a modal or navigate to add form
        // You'll need to communicate with UI context for modal state
        console.log("Add appointment triggered");
    };

    const handleEditAppointment = (appointment: Appointment) => {
        // This should probably open a modal with pre-filled data
        // You'll need to communicate with UI context for modal state and editing data
        console.log("Edit appointment triggered", appointment);
    };

    const handleSaveAppointment = async (appointmentData: AppointmentRequest) => {
        try {
            setLoading(true);
            setError(null);

            // If it's an edit (has _id), update existing appointment
            if (appointmentData._id) {
                // Make API call to update appointment
                // const response = await updateAppointment(appointmentData);

                // Update local state
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === appointmentData._id
                            ? {
                                ...apt,
                                ...appointmentData,
                                // Ensure patientId is properly typed if needed
                                patientId: typeof appointmentData.patientId === 'string'
                                    ? { _id: appointmentData.patientId, fullName: appointmentData.patientName || '' }
                                    : appointmentData.patientId
                            } as Appointment
                            : apt
                    )
                );

            } else {
                // Create new appointment
                // const response = await createAppointment(appointmentData);

                // Add to local state (you'd normally get the full object from API response)
                const newAppointment: Appointment = {
                    ...appointmentData,
                    _id: Date.now().toString(), // Temporary ID, should come from API
                    patientName: appointmentData.patientId, // This should be populated from API
                    providerName: appointmentData.providerId, // This should be populated from API
                    remindersSent: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    __v: 0
                } as Appointment;

                setAppointments(prev => [...prev, newAppointment]);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Make API call to delete appointment
            // const response = await deleteAppointment(appointmentId);

            // Remove from local state
            setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            setLoading(true);
            setError(null);

            // Make API call to cancel appointment
            // const response = await cancelAppointment(appointmentId);

            // Update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt._id === appointmentId
                        ? { ...apt, status: 'cancelled', updatedAt: new Date().toISOString() }
                        : apt
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleRescheduleAppointment = async (appointmentId: string, newData: Partial<AppointmentRequest>) => {
        try {
            setLoading(true);
            setError(null);

            // Make API call to reschedule appointment
            // const response = await rescheduleAppointment(appointmentId, newData);

            // Update local state
            setAppointments(prev =>
                prev.map(apt =>
                    apt._id === appointmentId
                        ? { ...apt, ...newData, updatedAt: new Date().toISOString() }
                        : apt
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reschedule appointment');
        } finally {
            setLoading(false);
        }
    };

    // Utility functions
    const getAppointmentById = (id: string): Appointment | undefined => {
        return appointments.find(apt => apt._id === id);
    };

    const getAppointmentsByPatient = (patientId: string): Appointment[] => {
        return appointments.filter(apt => apt.patientId._id === patientId);
    };

    const getAppointmentsByProvider = (providerId: string): Appointment[] => {
        return appointments.filter(apt => apt.providerId._id === providerId);
    };

    const getAppointmentsByStatus = (status: string): Appointment[] => {
        return appointments.filter(apt => apt.status === status);
    };

    const getAppointmentsByDate = (date: string): Appointment[] => {
        return appointments.filter(apt => {
            const appointmentDate = new Date(apt.appointmentDate).toDateString();
            const searchDate = new Date(date).toDateString();
            return appointmentDate === searchDate;
        });
    };

    return (
        <AppointmentContext.Provider
            value={{
                appointments,
                setAppointments,
                loading,
                setLoading,
                error,
                setError,
                getFilteredAppointments,
                handleAddAppointment,
                handleEditAppointment,
                handleSaveAppointment,
                handleDeleteAppointment,
                handleCancelAppointment,
                handleRescheduleAppointment,
                getAppointmentById,
                getAppointmentsByPatient,
                getAppointmentsByProvider,
                getAppointmentsByStatus,
                getAppointmentsByDate,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};
