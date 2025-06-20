"use client";

import { Appointments, Invoices, MedicalRecords, Patients } from "@/src/constants";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalUIContextType = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  currentPage: string;
  setCurrentPage: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  patients: typeof Patients;
  setPatients: (val: typeof Patients) => void;
  appointments: typeof Appointments;
  setAppointments: (val: typeof Appointments) => void;
  medicalRecords: typeof MedicalRecords;
  setMedicalRecords: (val: typeof MedicalRecords) => void;
  invoices: typeof Invoices;
  setInvoices: (val: typeof Invoices) => void;
  patientFormOpen: boolean;
  setPatientFormOpen: (val: boolean) => void;
  appointmentFormOpen: boolean;
  setAppointmentFormOpen: (val: boolean) => void;
  medicalRecordFormOpen: boolean;
  setMedicalRecordFormOpen: (val: boolean) => void;
  invoiceFormOpen: boolean;
  setInvoiceFormOpen: (val: boolean) => void;
  reportsModalOpen: boolean;
  setReportsModalOpen: (val: boolean) => void;
  calendarViewOpen: boolean;
  setCalendarViewOpen: (val: boolean) => void;
  editingItem: any;
  setEditingItem: (val: any) => void;
};

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

export const GlobalUIProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState(Patients);
  const [appointments, setAppointments] = useState(Appointments);
  const [medicalRecords, setMedicalRecords] = useState(MedicalRecords);
  const [invoices, setInvoices] = useState(Invoices);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [medicalRecordFormOpen, setMedicalRecordFormOpen] = useState(false);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  return (
    <GlobalUIContext.Provider
      value={{
        isSidebarOpen, setIsSidebarOpen,
        currentPage, setCurrentPage,
        searchTerm, setSearchTerm,
        patients, setPatients,
        appointments, setAppointments,
        medicalRecords, setMedicalRecords,
        invoices, setInvoices,
        patientFormOpen, setPatientFormOpen,
        appointmentFormOpen, setAppointmentFormOpen,
        medicalRecordFormOpen, setMedicalRecordFormOpen,
        invoiceFormOpen, setInvoiceFormOpen,
        reportsModalOpen, setReportsModalOpen,
        calendarViewOpen, setCalendarViewOpen,
        editingItem, setEditingItem
      }}
    >
      {children}
    </GlobalUIContext.Provider>
  );
};

export function useGlobalUI() {
  const context = useContext(GlobalUIContext);
  if (!context) throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  return context;
}
