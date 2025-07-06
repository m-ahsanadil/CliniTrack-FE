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
// import { notFound } from 'next/navigation';


export default function DashboardShell({ children }: { children: ReactNode }) {
    const { loginLoading, user } = useAppSelector(state => state.auth)
    const { isValidating, isAuthorized } = useRoleValidation();

    // SELECTING DATA FROM THE REDUX
    const provider = useAppSelector(state => state.provider.provider)
    const patients = useAppSelector(state => state.patients.patients)
    const { basicInfo: patientBasicInfo } = useAppSelector(state => state.patients)
    const { basicInfo: providerBasicInfo } = useAppSelector(state => state.provider)


    const {
        isSidebarOpen, setIsSidebarOpen,
        // patients,
        appointments,
        invoices,
        patientFormOpen, setPatientFormOpen,
        appointmentFormOpen, setAppointmentFormOpen,
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

    const {
        medicalRecordFormOpen,
        setMedicalRecordFormOpen,
    } = useMedicalRecord();

    // Show loading while validation is happening OR while still loading
    if (isValidating || loginLoading) {
        return <DashboardLoading />;
    }

    // Don't render anything if not authorized (redirect will happen)
    if (!isAuthorized || !user) {
        return null;
    }

    console.log('✅ Rendering dashboard content');

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
                    mode={'create'}
                />

                <AppointmentForm
                    open={appointmentFormOpen}
                    onOpenChange={setAppointmentFormOpen}
                    appointment={editingItem}
                    onSave={handleSaveAppointment}
                    patients={patientBasicInfo}
                    providers={providerBasicInfo}
                    mode={'create'}
                />

                {medicalRecordFormOpen && (
                    <MedicalRecordForm
                        open={medicalRecordFormOpen}
                        onOpenChange={setMedicalRecordFormOpen}
                    />
                )}

                <InvoiceForm
                    open={invoiceFormOpen}
                    onOpenChange={setInvoiceFormOpen}
                    invoice={editingItem}
                    onSave={handleSaveInvoice}
                    patients={patients}
                    providers={provider}
                    mode={'create'}
                    currentUser={undefined}
                />

                <ReportsModal
                    open={reportsModalOpen}
                    onOpenChange={setReportsModalOpen}
                    // patients={patients}
                    appointments={appointments}
                    invoices={invoices}
                    patients={[]}
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
