"use client";
import Header from '@/src/components/header';
import Sidebar from '@/src/components/sidebar';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';

// Import form components
import PatientForm from "@/src/components/patient-form"
import AppointmentForm from "@/src/components/appointment-form"
import MedicalRecordForm from "@/src/components/medical-record-form"
import InvoiceForm from "@/src/components/invoice-form"

import ReportsModal from "@/src/modules/Dashboard/reports/organisms/reports-modal"
import CalendarView from "@/components/calendar-view"
import { ReactNode } from 'react';
import { useAppSelector } from '@/src/redux/store/reduxHook';
import { useRoleValidation } from '@/src/redux/hook/useRoleValidation';
import { DashboardLoading } from '@/src/components/Loading';
import { useMedicalRecord } from '@/src/redux/providers/contexts/MedicalRecordContext';
import { usePatient } from '@/src/redux/providers/contexts/PatientContext';
import { useProvider } from '@/src/redux/providers/contexts/ProviderContext';
import { ProviderForm } from '@/src/components/provider-form';
import { useAppointment } from '@/src/redux/providers/contexts/AppointmentContext';


export default function DashboardShell({ children }: { children: ReactNode }) {
    const { loginLoading, user } = useAppSelector(state => state.auth)
    const { isValidating, isAuthorized } = useRoleValidation();


    const {
        isSidebarOpen, setIsSidebarOpen,
        // patients,
        // appointments,
        // invoices,
        // patientFormOpen, setPatientFormOpen,
        invoiceFormOpen, setInvoiceFormOpen,
        reportsModalOpen, setReportsModalOpen,
        calendarViewOpen, setCalendarViewOpen,
        editingItem,
        // handleSaveInvoice,
        // handleSavePatient,
        handleSaveMedicalRecord,
        // handleAddAppointment,
        // handleEditAppointment,
        // handleSaveAppointment
    } = useGlobalUI();

    const {
        medicalRecordFormOpen,
        setMedicalRecordFormOpen,
    } = useMedicalRecord();

    const {
        providerFormOpen,
        setProviderFormOpen,
    } = useProvider()

    const {
        appointmentFormOpen,
        setAppointmentFormOpen,
    } = useAppointment();

    const {
        setPatientFormOpen,
        patientFormOpen
    } = usePatient()

    // Show loading while validation is happening OR while still loading
    if (isValidating || loginLoading) {
        return <DashboardLoading />;
    }

    // Don't render anything if not authorized (redirect will happen)
    if (!isAuthorized || !user) {
        return null;
    }

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
                {medicalRecordFormOpen && (
                    <MedicalRecordForm
                        open={medicalRecordFormOpen}
                        onOpenChange={setMedicalRecordFormOpen}
                    />
                )}

                {patientFormOpen && (
                    <PatientForm
                        open={patientFormOpen}
                        onOpenChange={setPatientFormOpen}
                    />
                )}

                {providerFormOpen && (
                    <ProviderForm
                        open={providerFormOpen}
                        onOpenChange={setProviderFormOpen}
                    />
                )}
                {appointmentFormOpen && (
                    <AppointmentForm
                        open={appointmentFormOpen}
                        onOpenChange={setAppointmentFormOpen}
                    />
                )}



                <InvoiceForm
                    open={invoiceFormOpen}
                    onOpenChange={setInvoiceFormOpen}
                    providers={[]}
                    patients={[]}
                    onSave={function (invoice: any): void {
                        throw new Error('Function not implemented.');
                    }}
                    mode={'create'}
                    currentUser={undefined}
                />

                <ReportsModal
                    open={reportsModalOpen}
                    onOpenChange={setReportsModalOpen}
                    patients={[]}
                    appointments={[]}
                    invoices={[]}
                />

                <CalendarView
                    open={calendarViewOpen}
                    onOpenChange={setCalendarViewOpen}
                    appointments={[]}
                    onAddAppointment={function (): void {
                        throw new Error('Function not implemented.');
                    }}
                    onEditAppointment={function (appointment: any): void {
                        throw new Error('Function not implemented.');
                    }}
                // appointments={appointments}
                // onAddAppointment={handleAddAppointment}
                // onEditAppointment={handleEditAppointment}
                />
            </div>
        </div>
    )
}
