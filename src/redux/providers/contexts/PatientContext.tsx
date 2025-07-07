"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { clearCreateError, clearCreateSuccess, clearDeleteError, clearUpdateError, clearUpdateSuccess, createPatients, deletePatient, fetchAllPatients, updatePatients } from "@/src/modules/Dashboard/patients/api/slice";
import { Patient, PatientPostRequest } from "@/src/modules/Dashboard/patients/api/types";

type PatientContextType = {
  // Data States
  patient: Patient | null;
  setPatient: (val: Patient | null) => void;

  // ModalStates
  patientFormOpen: boolean;
  setPatientFormOpen: (val: boolean) => void;

  //Editing states
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;

  // Filtered
  filteredPatients: Patient[];

  // Medical Record CRUD
  handleAddPatient: () => void;
  handleEditPatient: (patient: Patient) => void;
  handleSavePatient: (patientData: PatientPostRequest) => void;
  handleDeletePatient: (patientId: string) => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(state => state.patients.patients)

  // states
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const filteredPatients = patients;

  const resetAllPatientFlags = () => {
    dispatch(clearCreateError());
    dispatch(clearCreateSuccess());
    dispatch(clearUpdateError());
    dispatch(clearUpdateSuccess());
    dispatch(clearDeleteError());
  };

  const handleAddPatient = () => {
    resetAllPatientFlags();

    setPatient(null);
    setIsEditing(false);
    setPatientFormOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    resetAllPatientFlags();

    setPatient(patient);
    setIsEditing(true);
    setPatientFormOpen(true);
  };

  const handleSavePatient = async (patientData: PatientPostRequest) => {
    try {
      resetAllPatientFlags();

      let resultAction;
      if (isEditing && patient?._id) {
        resultAction = await dispatch(updatePatients({ id: patient._id, patientData: patientData }));
      } else {
        resultAction = await dispatch(createPatients(patientData));
      }

      if (createPatients.fulfilled.match(resultAction) || updatePatients.fulfilled.match(resultAction)) {
        // Refresh the provider list
        await dispatch(fetchAllPatients());

        // Reset modal state
        setPatientFormOpen(false);
        setPatient(null);
        setIsEditing(false);
      }

    } catch (err) {
      console.error("Error in context handlePatient", err);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      const resultAction = await dispatch(deletePatient(patientId));
      if (deletePatient.fulfilled.match(resultAction)) {
        // Optionally refresh the list (though the reducer should handle this)
        await dispatch(fetchAllPatients());
        dispatch(clearDeleteError());
      }

    } catch (err) {
      console.error("Error deleting patient", err);
    }
  };


  return (
    <PatientContext.Provider
      value={{
        patient,
        setPatient,
        filteredPatients,
        handleAddPatient,
        handleEditPatient,
        handleSavePatient,
        handleDeletePatient,
        patientFormOpen,
        setPatientFormOpen,
        isEditing,
        setIsEditing,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (!context) throw new Error("usePatient must be used within a PatientProvider");
  return context;
};