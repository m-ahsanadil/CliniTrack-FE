"use client";
import { MedicalRecordGetAll, MedicalRecordPost } from "@/src/modules/Dashboard/medicalRecords/api/types";
import { createContext, useContext, useState, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { createMedicalRecord, deleteMedicalRecord, fetchAllMedicalRecord, updateMedicalRecord } from "@/src/modules/Dashboard/medicalRecords/api/slice";


type MedicalRecordContextType = {
    // Data States
    medicalRecord: MedicalRecordGetAll | null;
    setMedicalRecord: (val: MedicalRecordGetAll | null) => void;

    // ModalStates
    medicalRecordFormOpen: boolean;
    setMedicalRecordFormOpen: (val: boolean) => void;

    //Editing states
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;

    // Filtered
    filteredMedicalRecords: MedicalRecordGetAll[];

    // Medical Record CRUD
    handleAddMedicalRecord: () => void;
    handleEditMedicalRecord: (record: MedicalRecordGetAll) => void;
    handleSaveMedicalRecord: (recordData: MedicalRecordPost) => void;
    handleDeleteMedicalRecord: (recordId: string) => void;
};

const MedicalRecordContext = createContext<MedicalRecordContextType | undefined>(undefined);

export const MedicalRecordProvider = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const medicalRecords = useAppSelector(state => state.medicalRecord.medicalRecords)

    // states
    const [medicalRecord, setMedicalRecord] = useState<MedicalRecordGetAll | null>(null);
    const [medicalRecordFormOpen, setMedicalRecordFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const filteredMedicalRecords = medicalRecords;

    const handleAddMedicalRecord = () => {
        setMedicalRecord(null); // Clear the current state for creation
        setIsEditing(false);
        setMedicalRecordFormOpen(true);
    };

    const handleEditMedicalRecord = (record: MedicalRecordGetAll) => {
        setMedicalRecord(record); // Load the record into the form
        setIsEditing(true);
        setMedicalRecordFormOpen(true);
    };

    const handleSaveMedicalRecord = async (recordData: MedicalRecordPost) => {
        try {
            if (isEditing && medicalRecord?._id) {
                await dispatch(
                    updateMedicalRecord({ id: medicalRecord._id, medicalRecordData: recordData })
                );
            } else {
                await dispatch(createMedicalRecord(recordData));
            }

            // ✅ Optional: re-fetch list
            await dispatch(fetchAllMedicalRecord());

            // ✅ Reset modal state
            setMedicalRecordFormOpen(false);
            setMedicalRecord(null);
            setIsEditing(false);
        } catch (err) {
            console.error("Error in context handleSaveMedicalRecord", err);
        }
    };

    const handleDeleteMedicalRecord = async (recordId: string) => {
        try {
            await dispatch(deleteMedicalRecord(recordId));
            await dispatch(fetchAllMedicalRecord());
        } catch (err) {
            console.error("Error deleting medical record", err);
        }
    };



    return (
        <MedicalRecordContext.Provider
            value={{
                medicalRecord,
                setMedicalRecord,
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
