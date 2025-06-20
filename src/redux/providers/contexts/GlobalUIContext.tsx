"use client";

import { Appointments, Invoices, MedicalRecords, Patients } from "@/src/constants";
import React, { createContext, useContext, useState, ReactNode } from "react";

type GlobalUIContextType = {
  // UI States
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  currentPage: string;
  setCurrentPage: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;

  // Data States
  patients: typeof Patients;
  setPatients: (val: typeof Patients) => void;
  appointments: typeof Appointments;
  setAppointments: (val: typeof Appointments) => void;
  medicalRecords: typeof MedicalRecords;
  setMedicalRecords: (val: typeof MedicalRecords) => void;
  invoices: typeof Invoices;
  setInvoices: (val: typeof Invoices) => void;

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

  // Filtered Lists
  filteredPatients: typeof Patients;
  filteredAppointments: typeof Appointments;
  filteredMedicalRecords: typeof MedicalRecords;
  filteredInvoices: typeof Invoices;

  // Patient CRUD
  handleAddPatient: () => void;
  handleEditPatient: (patient: any) => void;
  handleSavePatient: (patientData: any) => void;
  handleDeletePatient: (patientId: number) => void;

  // Appointment CRUD
  handleAddAppointment: () => void;
  handleEditAppointment: (appointment: any) => void;
  handleSaveAppointment: (appointmentData: any) => void;
  handleDeleteAppointment: (appointmentId: number) => void;

  // Medical Record CRUD
  handleAddMedicalRecord: () => void;
  handleEditMedicalRecord: (record: any) => void;
  handleSaveMedicalRecord: (recordData: any) => void;
  handleDeleteMedicalRecord: (recordId: number) => void;

  // Invoice CRUD
  handleAddInvoice: () => void;
  handleEditInvoice: (invoice: any) => void;
  handleSaveInvoice: (invoiceData: any) => void;
  handleDeleteInvoice: (invoiceId: number) => void;
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

  // Filter functions
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMedicalRecords = medicalRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // CRUD handlers
  const handleAddPatient = () => {
    setEditingItem(null)
    setPatientFormOpen(true)
  }

  const handleEditPatient = (patient: { id: number; name: string; age: number; gender: string; phone: string; email: string; address: string; bloodType: string; allergies: string; emergencyContact: string; insuranceProvider: string; insuranceNumber: string; status: string; lastVisit: string }) => {
    setEditingItem(patient)
    setPatientFormOpen(true)
  }

  const handleSavePatient = (patientData: { id: number; name: string; age: number; gender: string; phone: string; email: string; address: string; bloodType: string; allergies: string; emergencyContact: string; insuranceProvider: string; insuranceNumber: string; status: string; lastVisit: string }) => {
    if (editingItem) {
      setPatients(patients.map((p) => (p.id === editingItem.id ? { ...patientData, id: editingItem.id } : p)))
    } else {
      setPatients([...patients, { ...patientData, id: Date.now() }])
    }
  }

  const handleDeletePatient = (patientId: number) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((p) => p.id !== patientId))
      // Also remove related appointments, records, and invoices
      setAppointments(appointments.filter((a) => a.patientId !== patientId))
      setMedicalRecords(medicalRecords.filter((r) => r.patientId !== patientId))
      setInvoices(invoices.filter((i) => i.patientId !== patientId))
    }
  }

  const handleAddAppointment = () => {
    setEditingItem(null)
    setAppointmentFormOpen(true)
  }

  const handleEditAppointment = (appointment: { id: number; patientId: number; patientName: string; date: string; time: string; doctor: string; type: string; duration: string; status: string; notes: string }) => {
    setEditingItem(appointment)
    setAppointmentFormOpen(true)
  }

  const handleSaveAppointment = (appointmentData: { id: number; patientId: number; patientName: string; date: string; time: string; doctor: string; type: string; duration: string; status: string; notes: string }) => {
    if (editingItem) {
      setAppointments(
        appointments.map((a) => (a.id === editingItem.id ? { ...appointmentData, id: editingItem.id } : a)),
      )
    } else {
      setAppointments([...appointments, { ...appointmentData, id: Date.now() }])
    }
  }

  const handleDeleteAppointment = (appointmentId: number) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((a) => a.id !== appointmentId))
    }
  }

  const handleAddMedicalRecord = () => {
    setEditingItem(null)
    setMedicalRecordFormOpen(true)
  }

  const handleEditMedicalRecord = (record: { id: number; patientId: number; patientName: string; date: string; doctor: string; diagnosis: string; treatment: string; severity: string; status: string; vitals: { bp: string; pulse: string; temp: string; weight: string; height: string; oxygen: string }; prescriptions: string[]; symptoms: string[]; notes: string }) => {
    setEditingItem(record)
    setMedicalRecordFormOpen(true)
  }

  const handleSaveMedicalRecord = (recordData: { id: number; patientId: number; patientName: string; date: string; doctor: string; diagnosis: string; treatment: string; severity: string; status: string; vitals: { bp: string; pulse: string; temp: string; weight: string; height: string; oxygen: string }; prescriptions: string[]; symptoms: string[]; notes: string }) => {
    if (editingItem) {
      setMedicalRecords(
        medicalRecords.map((r) => (r.id === editingItem.id ? { ...recordData, id: editingItem.id } : r)),
      )
    } else {
      setMedicalRecords([...medicalRecords, { ...recordData, id: Date.now() }])
    }
  }

  const handleDeleteMedicalRecord = (recordId: number) => {
    if (confirm("Are you sure you want to delete this medical record?")) {
      setMedicalRecords(medicalRecords.filter((r) => r.id !== recordId))
    }
  }

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
      setInvoices(invoices.map((i) => (i.id === editingItem.id ? { ...invoiceData, id: editingItem.id } : i)))
    } else {
      setInvoices([...invoices, { ...invoiceData, id: Date.now() }])
    }
  }

  const handleDeleteInvoice = (invoiceId: number) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter((i) => i.id !== invoiceId))
    }
  }

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
        editingItem, setEditingItem,
        filteredPatients,
        handleAddInvoice,
        filteredAppointments,
        filteredMedicalRecords,
        handleSaveInvoice,
        filteredInvoices,
        handleEditInvoice,
        handleAddPatient,
        handleEditPatient,
        handleSavePatient,
        handleDeletePatient,
        handleDeleteMedicalRecord,
        handleSaveMedicalRecord,
        handleEditMedicalRecord,
        handleAddMedicalRecord,
        handleDeleteAppointment,
        handleDeleteInvoice,
        handleAddAppointment,
        handleEditAppointment,
        handleSaveAppointment,
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
