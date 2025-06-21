"use client";
import Header from '@/src/components/header';
import Sidebar from '@/src/components/sidebar';
import { useAuth } from '@/src/redux/providers/contexts/auth-context';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';

// Import form components
import PatientForm from "@/components/patient-form"
import AppointmentForm from "@/components/appointment-form"
import MedicalRecordForm from "@/components/medical-record-form"
import InvoiceForm from "@/components/invoice-form"

import ReportsModal from "@/components/reports-modal"
import CalendarView from "@/components/calendar-view"
import { ReactNode } from 'react';

export default function DashboardShell({ children }: { children: ReactNode }) {

    const { user, logout, isLoading } = useAuth()

    const {
        isSidebarOpen, setIsSidebarOpen,
        currentPage,
        searchTerm, setSearchTerm,
        patients,
        appointments,
        invoices,
        patientFormOpen, setPatientFormOpen,
        appointmentFormOpen, setAppointmentFormOpen,
        medicalRecordFormOpen, setMedicalRecordFormOpen,
        invoiceFormOpen, setInvoiceFormOpen,
        reportsModalOpen, setReportsModalOpen,
        calendarViewOpen, setCalendarViewOpen,
        editingItem,
        handleSaveInvoice,
        handleSavePatient,
        handleSaveMedicalRecord,
        handleAddAppointment,
        handleEditAppointment,
        handleSaveAppointment
    } = useGlobalUI();
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <div
                className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
            >
                {/* Header */}
                <Header />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>

                {/* Modal Components */}
                <PatientForm
                    open={patientFormOpen}
                    onOpenChange={setPatientFormOpen}
                    patient={editingItem}
                    onSave={handleSavePatient}
                />

                <AppointmentForm
                    open={appointmentFormOpen}
                    onOpenChange={setAppointmentFormOpen}
                    appointment={editingItem}
                    onSave={handleSaveAppointment}
                    patients={patients}
                />

                <MedicalRecordForm
                    open={medicalRecordFormOpen}
                    onOpenChange={setMedicalRecordFormOpen}
                    record={editingItem}
                    onSave={handleSaveMedicalRecord}
                    patients={patients}
                />

                <InvoiceForm
                    open={invoiceFormOpen}
                    onOpenChange={setInvoiceFormOpen}
                    invoice={editingItem}
                    onSave={handleSaveInvoice}
                    patients={patients}
                />

                <ReportsModal
                    open={reportsModalOpen}
                    onOpenChange={setReportsModalOpen}
                    patients={patients}
                    appointments={appointments}
                    invoices={invoices}
                />

                <CalendarView
                    open={calendarViewOpen}
                    onOpenChange={setCalendarViewOpen}
                    appointments={appointments}
                    onAddAppointment={handleAddAppointment}
                    onEditAppointment={handleEditAppointment}
                />
            </div>
        </div>
    )
}
