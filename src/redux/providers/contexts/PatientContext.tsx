"use client";

import { createContext, useContext, useState, ReactNode } from "react";
// import { Patients } from "@/src/constants";

type PatientContextType = {
  patients: typeof Patients;
  setPatients: (val: typeof Patients) => void;
  filteredPatients: typeof Patients;
  handleAddPatient: () => void;
  handleEditPatient: (patient: any) => void;
  handleSavePatient: (patientData: any) => void;
  handleDeletePatient: (patientId: number) => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState(Patients);

  // Filter function (you'll need to pass searchTerm from UI context or make it a prop)
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes("") || // You'll need to get searchTerm
      patient.phone.includes("") ||
      patient.email.toLowerCase().includes(""),
  );

  const handleAddPatient = () => {
    // Implementation here - you might need to communicate with UI context for modal state
  };

  const handleEditPatient = (patient: any) => {
    // Implementation here
  };

  const handleSavePatient = (patientData: any) => {
    // Your existing logic
  };

  const handleDeletePatient = (patientId: number) => {
    // Your existing logic
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        setPatients,
        filteredPatients,
        handleAddPatient,
        handleEditPatient,
        handleSavePatient,
        handleDeletePatient,
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