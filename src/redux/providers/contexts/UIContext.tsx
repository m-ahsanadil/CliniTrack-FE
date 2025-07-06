"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UIContextType = {
  // Password visibility states
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  togglePasswordVisibility: () => void;
  showLoginPassword: boolean;
  setShowLoginPassword: (show: boolean) => void;
  toggleLoginPasswordVisibility: () => void;
  showRegisterPassword: boolean;
  setShowRegisterPassword: (show: boolean) => void;
  toggleRegisterPasswordVisibility: () => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  toggleConfirmPasswordVisibility: () => void;

  // UI States
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  currentPage: string;
  setCurrentPage: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;

  // Modal States
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

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false);
  const [medicalRecordFormOpen, setMedicalRecordFormOpen] = useState(false);
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Toggle functions
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleLoginPasswordVisibility = () => setShowLoginPassword(!showLoginPassword);
  const toggleRegisterPasswordVisibility = () => setShowRegisterPassword(!showRegisterPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <UIContext.Provider
      value={{
        showPassword,
        setShowPassword,
        togglePasswordVisibility,
        showLoginPassword,
        setShowLoginPassword,
        toggleLoginPasswordVisibility,
        showRegisterPassword,
        setShowRegisterPassword,
        toggleRegisterPasswordVisibility,
        showConfirmPassword,
        setShowConfirmPassword,
        toggleConfirmPasswordVisibility,
        isSidebarOpen,
        setIsSidebarOpen,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        patientFormOpen,
        setPatientFormOpen,
        appointmentFormOpen,
        setAppointmentFormOpen,
        medicalRecordFormOpen,
        setMedicalRecordFormOpen,
        invoiceFormOpen,
        setInvoiceFormOpen,
        reportsModalOpen,
        setReportsModalOpen,
        calendarViewOpen,
        setCalendarViewOpen,
        editingItem,
        setEditingItem,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};