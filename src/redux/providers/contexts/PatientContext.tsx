"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/reduxHook";
import { clearCreateError, clearCreateSuccess, clearDeleteError, clearUpdateError, clearUpdateSuccess, createPatients, deletePatient, fetchAllPatients, updatePatients } from "@/src/modules/Dashboard/patients/api/slice";
import { Patient, PatientPostRequest } from "@/src/modules/Dashboard/patients/api/types";
import { fetchProfile } from "@/src/modules/Authentication/profile/api/slice";
import { GetUserProfile } from "@/src/modules/Authentication/profile/api/types";

type PatientContextType = {
  // Data States
  patient: Patient | null;
  setPatient: (val: Patient | null) => void;
  profile: GetUserProfile | null;

  // ModalStates
  patientFormOpen: boolean;
  setPatientFormOpen: (val: boolean) => void;

  //Editing states
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;

  // Data fetching status
  isDataFetched: boolean;
  isDataLoading: boolean;

  // Filtered
  filteredPatients: Patient[];

  // Medical Record CRUD
  handleAddPatient: () => void;
  handleEditPatient: (patient: Patient) => void;
  handleSavePatient: (patientData: PatientPostRequest, onSucess?: () => void) => void;
  handleDeletePatient: (patientId: string) => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const patients = useAppSelector(state => state.patients.patients)
  const { profile, loading: profileLoading } = useAppSelector(state => state.profile);

  // states
  const [patient, setPatient] = useState<Patient | null>(null);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const filteredPatients = patients;

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


  const resetAllPatientFlags = () => {
    dispatch(clearCreateError());
    dispatch(clearCreateSuccess());
    dispatch(clearUpdateError());
    dispatch(clearUpdateSuccess());
    dispatch(clearDeleteError());
  };

  const handleAddPatient = async () => {
    resetAllPatientFlags();

    // Ensure data is available before opening modal
    if (!isDataFetched || !profile) {
      await refetchData();
    }

    setPatient(null);
    setIsEditing(false);
    setPatientFormOpen(true);
  };

  const handleEditPatient = async (patient: Patient) => {
    resetAllPatientFlags();

    // Ensure data is available before opening modal
    if (!isDataFetched || !profile) {
      await refetchData();
    }

    setPatient(patient);
    setIsEditing(true);
    setPatientFormOpen(true);
  };

  const handleSavePatient = async (
    patientData: PatientPostRequest,
    onSuccess?: () => void
  ) => {
    try {
      resetAllPatientFlags();

      let resultAction;
      if (isEditing && patient?._id) {
        resultAction = await dispatch(updatePatients({ id: patient._id, patientData }));
      } else {
        resultAction = await dispatch(createPatients(patientData));
      }

      if (createPatients.fulfilled.match(resultAction) || updatePatients.fulfilled.match(resultAction)) {
        await dispatch(fetchAllPatients());

        // Reset local context state
        setPatient(null);
        setIsEditing(false);
        setPatientFormOpen(false);

        // Call optional success callback
        if (onSuccess) onSuccess();
      }

    } catch (err) {
      console.error("Error in context handleSavePatient", err);
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
        profile,
        isDataFetched,
        isDataLoading,
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