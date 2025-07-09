"use client";
import { MedicalRecordGetAll, MedicalRecordPost } from "@/src/modules/Dashboard/medicalRecords/api/types";
import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { clearCreateError, clearCreateSuccess, clearDeleteError, clearError, clearUpdateError, clearUpdateSuccess, createMedicalRecord, deleteMedicalRecord, fetchAllMedicalRecord, updateMedicalRecord } from "@/src/modules/Dashboard/medicalRecords/api/slice";
import { GetUserProfile } from "@/src/modules/Authentication/profile/api/types";
import { fetchProfile } from "@/src/modules/Authentication/profile/api/slice";


type MedicalRecordContextType = {
    // Data States
    medicalRecord: MedicalRecordGetAll | null;
    setMedicalRecord: (val: MedicalRecordGetAll | null) => void;
    profile: GetUserProfile | null;

    // ModalStates
    medicalRecordFormOpen: boolean;
    setMedicalRecordFormOpen: (val: boolean) => void;

    // Data fetching status
    isDataFetched: boolean;
    isDataLoading: boolean;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    // Filtered
    filteredMedicalRecords: MedicalRecordGetAll[];

    // Medical Record CRUD
    handleAddMedicalRecord: () => void;
    handleEditMedicalRecord: (record: MedicalRecordGetAll) => void;
    handleSaveMedicalRecord: (recordData: MedicalRecordPost, onSuccess?: () => void) => void;
    handleDeleteMedicalRecord: (recordId: string) => void;
};

const MedicalRecordContext = createContext<MedicalRecordContextType | undefined>(undefined);

export const MedicalRecordProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const medicalRecords = useAppSelector(state => state.medicalRecord.medicalRecords)
    const { profile } = useAppSelector(state => state.profile);
    const profileLoading = useAppSelector(state => state.profile.loading);

    // states
    const [medicalRecord, setMedicalRecord] = useState<MedicalRecordGetAll | null>(null);
    const [medicalRecordFormOpen, setMedicalRecordFormOpen] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const filteredMedicalRecords = useMemo(() => medicalRecords, [medicalRecords]);

    // Calculate if data is still loading
    const isDataLoading = profileLoading;

    // Fetch required data when context is first loaded
    useEffect(() => {
        const fetchRequiredData = async () => {
            if (!isDataFetched) {
                try {
                    await Promise.all([
                        dispatch(fetchProfile()),

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
            ]);
            setIsDataFetched(true);
        } catch (error) {
            console.error("Error refetching data:", error);
        }
    };


    const resetAllMedicalRecordFlags = () => {
        dispatch(clearCreateSuccess());
        dispatch(clearUpdateSuccess());
        dispatch(clearUpdateError());
        dispatch(clearDeleteError());
        dispatch(clearCreateError());
        dispatch(clearError());
    };


    const handleAddMedicalRecord = async () => {
        resetAllMedicalRecordFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }

        setMedicalRecord(null); // Clear the current state for creation
        setIsEditing(false);
        setMedicalRecordFormOpen(true);
    };

    const handleEditMedicalRecord = async (record: MedicalRecordGetAll) => {
        resetAllMedicalRecordFlags();

        // Ensure data is available before opening modal
        if (!isDataFetched || !profile) {
            await refetchData();
        }
        setMedicalRecord(record); // Load the record into the form
        setIsEditing(true);
        setMedicalRecordFormOpen(true);
    };

    const handleSaveMedicalRecord = async (recordData: MedicalRecordPost, onSuccess?: () => void) => {
        try {
            resetAllMedicalRecordFlags();
            let resultAction;

            if (isEditing && medicalRecord?._id) {
                resultAction = await dispatch(updateMedicalRecord({ id: medicalRecord._id, medicalRecordData: recordData }));
            } else {
                resultAction = await dispatch(createMedicalRecord(recordData));
            }


            if (createMedicalRecord.fulfilled.match(resultAction) || updateMedicalRecord.fulfilled.match(resultAction)) {

                await dispatch(fetchAllMedicalRecord());

                // ✅ Reset modal state
                setMedicalRecordFormOpen(false);
                setMedicalRecord(null);
                setIsEditing(false);

                // Call optional success callback
                if (onSuccess) onSuccess();
            }

        } catch (err) {
            console.error("Error in context handleSaveMedicalRecord", err);
            dispatch(clearCreateError());
            dispatch(clearUpdateError());
        }
    };

    const handleDeleteMedicalRecord = async (recordId: string) => {
        try {
            const resultAction = await dispatch(deleteMedicalRecord(recordId));
            if (deleteMedicalRecord.fulfilled.match(resultAction)) {
                dispatch(fetchAllMedicalRecord());
            }
        } catch (err) {
            console.error("Error deleting medical record", err);
        }
    };



    return (
        <MedicalRecordContext.Provider
            value={{
                medicalRecord,
                setMedicalRecord,
                profile,
                isDataFetched,
                isDataLoading,
                medicalRecordFormOpen,
                setMedicalRecordFormOpen,
                isEditing,
                setIsEditing,
                filteredMedicalRecords,
                handleAddMedicalRecord,
                handleEditMedicalRecord,
                handleSaveMedicalRecord,
                handleDeleteMedicalRecord,
            }}
        >
            {children}
        </MedicalRecordContext.Provider>
    );
};
export const useMedicalRecord = () => {
    const context = useContext(MedicalRecordContext);
    if (!context) throw new Error("useMedicalRecord must be used within a MedicalRecordProvider");
    return context;
};
