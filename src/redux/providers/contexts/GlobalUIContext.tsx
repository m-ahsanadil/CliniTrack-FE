"use client";

import { Appointment } from "@/src/modules/Dashboard/appointments/api/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalUIContextType = {
  //Show password states
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  togglePasswordVisibility: () => void;

  // Specific password states
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
  invoiceFormOpen: boolean;
  setInvoiceFormOpen: (val: boolean) => void;
  calendarViewOpen: boolean;
  setCalendarViewOpen: (val: boolean) => void;
  editingItem: any;
  setEditingItem: (val: any) => void;

  // Filtered Lists

  // Invoice CRUD
  handleAddInvoice: () => void;
  handleEditInvoice: (invoice: any) => void;
  handleSaveInvoice: (invoiceData: any) => void;
  handleDeleteInvoice: (invoiceId: number | string) => void;
};

const GlobalUIContext = createContext<GlobalUIContextType | undefined>(undefined);

export const GlobalUIProvider = ({ children }: { children: ReactNode }) => {
  // General Password visibility states
  const [showPassword, setShowPassword] = useState(false);

  // Specific password Visibility states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Data States
  const [invoices, setInvoices] = useState();

  // Modal States
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false);
  const [reportsModalOpen, setReportsModalOpen] = useState(false);
  const [calendarViewOpen, setCalendarViewOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Toggle functions for Password Visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleLoginPasswordVisibility = () => setShowLoginPassword(!showLoginPassword);
  const toggleRegisterPasswordVisibility = () => setShowRegisterPassword(!showRegisterPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Filter functions
  // const filteredPatients = patients.filter(
  //   (patient) =>
  //     patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     patient.phone.includes(searchTerm) ||
  //     patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // const filteredAppointments = appointments.filter(
  //   (appointment) =>
  //     appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // const filteredMedicalRecords = medicalRecords.filter(
  //   (record) =>
  //     (record?.patientId.fullName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
  //     record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     record.providerId.name.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // const filteredInvoices = invoices.filter(
  //   (invoice) =>
  //     invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  // )

  // CRUD handlers
  const handleAddInvoice = () => {
    setEditingItem(null)
    setInvoiceFormOpen(true)
  }

  const handleEditInvoice = (invoice: { id: number; patientId: number; patientName: string; date: string; dueDate: string; service: string; amount: number; status: string; paymentMethod: string; insuranceClaim: string; items: { description: string; quantity: number; rate: number; amount: number }[]; subtotal: number; tax: number; discount: number; total: number }) => {
    setEditingItem(invoice)
    setInvoiceFormOpen(true)
  }

  const handleSaveInvoice = (invoiceData: { id: number; patientId: number; patientName: string; date: string; dueDate: string; service: string; amount: number; status: string; paymentMethod: string; insuranceClaim: string; items: { description: string; quantity: number; rate: number; amount: number }[]; subtotal: number; tax: number; discount: number; total: number }) => {
    if (editingItem) {
      setInvoices(invoices.map((i: { id: any; }) => (i.id === editingItem.id ? { ...invoiceData, id: editingItem.id } : i)))
    } else {
      setInvoices([...invoices, { ...invoiceData, id: Date.now() }])
    }
  }

  const handleDeleteInvoice = (invoiceId: number | string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter((i: { id: string | number; }) => i.id !== invoiceId))
    }
  }

  return (
    <GlobalUIContext.Provider
      value={{
        // Password visibility
        showPassword,
        setShowPassword,
        togglePasswordVisibility,
        handleAddInvoice,
        handleDeleteInvoice,
        handleEditInvoice,
        handleSaveInvoice,
        toggleLoginPasswordVisibility,
        showLoginPassword,
        setShowLoginPassword,

        showRegisterPassword,
        setShowRegisterPassword,
        toggleRegisterPasswordVisibility,
        showConfirmPassword,
        setShowConfirmPassword,
        toggleConfirmPasswordVisibility,

        // UI States
        isSidebarOpen,
        setIsSidebarOpen,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,

        // Data States
        // patients,
        // setPatients,
        // appointments,
        // setAppointments,
        // medicalRecords,
        // setMedicalRecords,
        // invoices,
        // setInvoices,

        // Modal States
        invoiceFormOpen,
        setInvoiceFormOpen,
        calendarViewOpen,
        setCalendarViewOpen,
        editingItem,
        setEditingItem,

        // Invoice CRUD
        // handleAddInvoice,
        // handleEditInvoice,
        // handleSaveInvoice,
        // handleDeleteInvoice,
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
