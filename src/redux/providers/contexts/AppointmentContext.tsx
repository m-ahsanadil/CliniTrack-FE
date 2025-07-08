"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
    Appointment,
    AppointmentFilters,
    AppointmentRequest,
    AppointmentStats,
    RescheduleAppointmentRequest
} from "@/src/modules/Dashboard/appointments/api/types";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { cancelAppointment, clearCancelError, clearCreateError, clearCreateSuccess, clearDeleteError, clearError, clearRescheduleError, clearUpdateError, clearUpdateSuccess, createAppointment, deleteAppointment, fetchAllAppointments, rescheduleAppointment, updateAppointment } from "@/src/modules/Dashboard/appointments/api/slice";

type AppointmentContextType = {
    // State
    appointment: Appointment | null;
    setAppointment: (val: Appointment | null) => void;

    // ModalStates
    appointmentFormOpen: boolean;
    setAppointmentFormOpen: (val: boolean) => void;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    // Filtered
    filteredAppointments: Appointment[];

    // CRUD operations
    handleAddAppointment: () => void;
    handleEditAppointment: (appointment: Appointment) => void;
    handleSaveAppointment: (appointmentData: AppointmentRequest, onSuccess?: () => void) => void;
    handleDeleteAppointment: (appointmentId: string) => void;
    handleCancelAppointment: (appointmentId: string) => void;
    handleRescheduleAppointment: (appointmentId: string, newData: Partial<RescheduleAppointmentRequest>) => Promise<void>;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const appointments = useAppSelector(state => state.appointment.appointments);

    // states
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const filteredAppointments = appointments || [];

    const resetAllAppointmentFlags = () => {
        dispatch(clearCreateSuccess());
        dispatch(clearUpdateSuccess());
        dispatch(clearUpdateError());
        dispatch(clearDeleteError());
        dispatch(clearCreateError());

        dispatch(clearError());
        dispatch(clearCancelError());
        dispatch(clearRescheduleError());

    };

    // CRUD Operations
    const handleAddAppointment = () => {
        resetAllAppointmentFlags();
        setAppointment(null);
        setIsEditing(false);
        setAppointmentFormOpen(true);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        resetAllAppointmentFlags();
        setAppointment(appointment);
        setIsEditing(true);
        setAppointmentFormOpen(true);
    };

    const handleSaveAppointment = async (appointmentData: AppointmentRequest, onSuccess?: () => void) => {
        try {
            resetAllAppointmentFlags();
            let resultAction;

            if (isEditing && appointment?._id) {
                resultAction = await dispatch(updateAppointment({ id: appointment._id, payload: appointmentData }));
            } else {
                resultAction = await dispatch(createAppointment(appointmentData));
            }


            if (createAppointment.fulfilled.match(resultAction) || updateAppointment.fulfilled.match(resultAction)) {
                // Refresh the providers list
                await dispatch(fetchAllAppointments());

                // ✅ Reset modal state
                setAppointment(null);
                setIsEditing(false);
                setAppointmentFormOpen(false);

                // Call optional success callback
                if (onSuccess) onSuccess();
            }

        } catch (error) {
            console.error("Error saving appointment:", error);
            dispatch(clearCreateError());
            dispatch(clearUpdateError());
        }
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        try {
            const resultAction = await dispatch(deleteAppointment(appointmentId));

            if (deleteAppointment.fulfilled.match(resultAction)) {
                // Optionally refresh the list (though the reducer should handle this)
                dispatch(clearDeleteError());
            }
        } catch (err) {
            console.error("Error deleting provider:", err);
        }
    };


    const handleRescheduleAppointment = async (appointmentId: string, newData: Partial<RescheduleAppointmentRequest>) => {
        try {
            resetAllAppointmentFlags();
            const result = await dispatch(
                rescheduleAppointment({
                    id: appointmentId,
                    payload: newData as RescheduleAppointmentRequest,
                })
            );
            if (rescheduleAppointment.fulfilled.match(result)) {
                await dispatch(fetchAllAppointments());
            }
        } catch (error) {
            console.error("Reschedule Appointment Error:", error);
            dispatch(clearRescheduleError());
        }
    }


    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            resetAllAppointmentFlags();
            const result = await dispatch(cancelAppointment(appointmentId));
            if (cancelAppointment.fulfilled.match(result)) {
                await dispatch(fetchAllAppointments());
            }
        } catch (error) {
            console.error("Cancel Appointment Error:", error);
            dispatch(clearCancelError());
        }
    }

    return (
        <AppointmentContext.Provider
            value={{
                appointment,
                setAppointment,
                setAppointmentFormOpen,
                appointmentFormOpen,
                isEditing,
                setIsEditing,
                filteredAppointments,
                handleAddAppointment,
                handleEditAppointment,
                handleSaveAppointment,
                handleDeleteAppointment,
                handleCancelAppointment,
                handleRescheduleAppointment,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointment = () => {
    const context = useContext(AppointmentContext);
    if (!context) throw new Error("useAppointmentContext must be used within AppointmentProvider");
    return context;
};