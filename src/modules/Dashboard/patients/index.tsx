"use client";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { getStatusBadgeVariant } from "@/src/constants";
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext";
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { PatientsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/patients/page";
import { usePatientsFetcher } from "./api/usePatientsFetcher";
import { ViewPatientDialog } from "./organisms/ViewPatientsDialog";
import { useEffect, useState } from "react";
import { Patient } from "./api/types";
import { clearDeleteError, deletePatient } from "./api/slice";
import { useMedicalRecordsFetcher } from "../medicalRecords/api/useMedicalRecord";
import { useAppointmentsFetcher } from "../appointments/api/useAppointmentsFetcher";
import { useInvoiceFetcher } from "../billing/api/useInvoiceFetcher";
import { useReportsFetcher } from "../reports/api/useReportsFetcher";


export default function index({ dashboardId, role }: PatientsProps) {
    const dispatch = useAppDispatch();

    // Custom hook for fetching appointments
    useAppointmentsFetcher();
    useInvoiceFetcher();
    useReportsFetcher();
    usePatientsFetcher();
    useMedicalRecordsFetcher();

    const { patients: apipatients, loading: patientsLoading, error: patientsError, count: patientsCount, deleteError, deleteLoading } = useAppSelector(state => state.patients)
    const { user } = useAppSelector(state => state.auth)
    const { setPatients, handleAddPatient, filteredPatients, handleEditPatient } = useGlobalUI();
    // FIXED: Local state management
    const [selectedPatients, setSelectedPatients] = useState<Patient | null>(null);
    const [deletingPatientsId, setDeletingPatientsId] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // FIXED: Proper type for the parameter
    const handleViewPatients = (patient: Patient) => {
        setSelectedPatients(patient);
        setIsViewOpen(true);
    }


    const handleDeletePatient = async (patientId: string) => {
        // Clear any previous delete errors
        if (deleteError) {
            dispatch(clearDeleteError());
        }

        // Optional: Add confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return;

        try {
            setDeletingPatientsId(patientId);
            await dispatch(deletePatient(patientId)).unwrap();
            // Optional: Show success message
            console.log("Appointment deleted successfully");
        } catch (error) {
            // Error is already handled by Redux state
            console.error("Failed to delete appointment:", error);
        } finally {
            setDeletingPatientsId(null);
        }
    }

    // FIXED: Effect to handle delete errors
    useEffect(() => {
        if (deleteError) {
            // You could show a toast notification here
            console.error("Delete error:", deleteError);
            // Clear the error after showing it
            setTimeout(() => {
                dispatch(clearDeleteError());
            }, 5000);
        }
    }, [deleteError, dispatch]);

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Patients</h2>
                        <p className="text-slate-600">Manage patient information and records</p>
                    </div>
                    <RoleGuard allowedRoles={['admin', 'staff']}>
                        <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Patient
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-slate-600">Name</TableHead>
                                    <TableHead className="text-slate-600">Age</TableHead>
                                    <TableHead className="text-slate-600">Gender</TableHead>
                                    <TableHead className="text-slate-600">Phone</TableHead>
                                    <TableHead className="text-slate-600">Last Visit</TableHead>
                                    <TableHead className="text-slate-600">Status</TableHead>
                                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apipatients.map((patient: Patient) => (
                                    <TableRow key={patient._id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{patient.fullName}</TableCell>
                                        <TableCell className="text-slate-600">{patient.age}</TableCell>
                                        <TableCell className="text-slate-600">{patient.gender}</TableCell>
                                        <TableCell className="text-slate-600">{patient.phone}</TableCell>
                                        <TableCell className="text-slate-600">{patient.registrationDate}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewPatients(patient)} className="text-slate-600 hover:text-slate-900">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <RoleGuard allowedRoles={['admin', 'staff']}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditPatient(patient)}
                                                        className="text-slate-600 hover:text-slate-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </RoleGuard>
                                                <RoleGuard allowedRoles={["admin"]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeletePatient(patient._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </RoleGuard>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <ViewPatientDialog
                patient={selectedPatients}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
        </>
    )
}
