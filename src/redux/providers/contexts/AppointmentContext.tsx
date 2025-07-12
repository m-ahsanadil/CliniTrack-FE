"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import {
    Appointment,
    AppointmentRequest,
    RescheduleAppointmentRequest
} from "@/src/modules/Dashboard/appointments/api/types";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { cancelAppointment, clearCancelError, clearCreateError, clearCreateSuccess, clearDeleteError, clearError, clearRescheduleError, clearUpdateError, clearUpdateSuccess, createAppointment, deleteAppointment, fetchAllAppointments, rescheduleAppointment, updateAppointment } from "@/src/modules/Dashboard/appointments/api/slice";
import { fetchProfile } from "@/src/modules/Authentication/profile/api/slice";
import { fetchProvidersName } from "@/src/modules/Dashboard/Provider/api/slice";
import { fetchPatientsName } from "@/src/modules/Dashboard/patients/api/slice";
import { GetUserProfile } from "@/src/modules/Authentication/profile/api/types";
import { PatientNames } from "@/src/modules/Dashboard/patients/api/types";
import { ProviderNames } from "@/src/modules/Dashboard/Provider/api/types";
import { useToast } from "@/hooks/use-toast";

type AppointmentContextType = {
    // State
    appointment: Appointment | null;
    setAppointment: (val: Appointment | null) => void;
    profile: GetUserProfile | null;
    patientNames: PatientNames[];
    providerNames: ProviderNames[];

    // ModalStates
    appointmentFormOpen: boolean;
    setAppointmentFormOpen: (val: boolean) => void;

    // Data fetching status
    isDataFetched: boolean;
    isDataLoading: boolean;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    isRescheduleFormOpen: boolean;
    setIsRescheduleFormOpen: (val: boolean) => void;

    // Filtered
    filteredAppointments: Appointment[];

    // CRUD operations
    handleAddAppointment: () => void;
    handleEditAppointment: (appointment: Appointment) => void;
    handleEditRescheduledAppointment: (appointment: Appointment) => void;
    handleSaveAppointment: (appointmentData: AppointmentRequest, onSuccess?: () => void) => void;
    handleDeleteAppointment: (appointmentId: string) => void;
    handleCancelAppointment: (appointmentId: string) => void;
    handleRescheduleAppointment: (appointmentId: string, newData: Partial<RescheduleAppointmentRequest>, onSuccess?: () => void) => Promise<void>;
};

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const appointments = useAppSelector(state => state.appointment.appointments);
    const { basicInfo: patientNames, loading: patientsLoading } = useAppSelector(state => state.patients);
    const { basicInfo: providerNames, loading: providersLoading } = useAppSelector(state => state.provider);
    const { profile, loading: profileLoading } = useAppSelector(state => state.profile);

    // states
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isRescheduleFormOpen, setIsRescheduleFormOpen] = useState(false);

    const filteredAppointments = useMemo(() => appointments, [appointments])


    // Calculate if data is still loading
    const isDataLoading = profileLoading || patientsLoading || providersLoading;

    // Fetch required data when context is first loaded
    useEffect(() => {
        const fetchRequiredData = async () => {
            if (!isDataFetched) {
                try {
                    await Promise.all([
                        dispatch(fetchProfile()),
                        dispatch(fetchProvidersName()),
                        dispatch(fetchPatientsName())
                    ]);
                    setIsDataFetched(true);
                } catch (error) {
                    console.error("Error fetching required data:", error);
                }
            }
        };

        fetchRequiredData();
    }, [dispatch, isDataFetched]);

    // Re-fetch data if it's not available or if explicitly requested
    const refetchData = async () => {
        try {
            await Promise.all([
                dispatch(fetchProfile()),
                dispatch(fetchProvidersName()),
                dispatch(fetchPatientsName())
            ]);
            setIsDataFetched(true);
        } catch (error) {
            console.error("Error refetching data:", error);
        }
    };

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
    const handleAddAppointment = async () => {
        resetAllAppointmentFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile || !patientNames || !providerNames) {
            await refetchData();
        }

        setAppointment(null);
        setIsEditing(false);
        setAppointmentFormOpen(true);
    };

    const handleEditAppointment = async (appointment: Appointment) => {
        resetAllAppointmentFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile || !patientNames || !providerNames) {
            await refetchData();
        }

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
            } else {
                // Handle the rejected case
                console.error("Operation failed:", resultAction.payload);
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

    const handleEditRescheduledAppointment = async (appointment: Appointment) => {
        resetAllAppointmentFlags();
        setAppointment(appointment);
        setIsEditing(true);
        setIsRescheduleFormOpen(true);
    };

    const handleRescheduleAppointment = async (appointmentId: string, newData: Partial<RescheduleAppointmentRequest>, onSuccess?: () => void) => {
        try {
            resetAllAppointmentFlags();
            let resultAction
            if (isEditing && appointmentId) {
                resultAction = await dispatch(rescheduleAppointment({ id: appointmentId, payload: newData as RescheduleAppointmentRequest }))
            }

            if (rescheduleAppointment.fulfilled.match(resultAction)) {
                await dispatch(fetchAllAppointments());
                if (onSuccess) onSuccess();
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
                isRescheduleFormOpen,
                setIsRescheduleFormOpen,
                profile,
                patientNames,
                providerNames,
                setAppointmentFormOpen,
                appointmentFormOpen,
                isEditing,
                setIsEditing,
                isDataFetched,
                isDataLoading,
                filteredAppointments,
                handleAddAppointment,
                handleEditAppointment,
                handleEditRescheduledAppointment,
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