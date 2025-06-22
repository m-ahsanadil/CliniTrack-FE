"use client"

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

// Import form components
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { AppointmentProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/appointments/page"
import { RoleGuard } from "@/components/role-guard"
import { SetStateAction, useEffect, useState } from "react"
import { ViewAppointmentDialog } from "./organisms/ViewAppointmentDialog"
import { Appointment } from "./api/types"
import { useAppointmentsFetcher } from "./api/useAppointmentsFetcher"
import { deleteAppointment, clearDeleteError } from "./api/slice"
import { useInvoiceFetcher } from "../billing/api/useInvoiceFetcher"
import { useReportsFetcher } from "../reports/api/useReportsFetcher"
import { usePatientsFetcher } from "../patients/api/usePatientsFetcher"

export default function index({ dashboardId, role }: AppointmentProps) {
    const dispatch = useAppDispatch();

    // FIXED: Destructure Redux state properly
    const {
        appointments: apiAppointments,
        loading: appointmentsLoading,
        error: appointmentsError,
        count: appointmentsCount,
        deleteLoading,
        deleteError
    } = useAppSelector(state => state.appointment);

    const { user } = useAppSelector(state => state.auth);

    // Custom hook for fetching appointments
    useAppointmentsFetcher();
    useInvoiceFetcher();
    useReportsFetcher();
    usePatientsFetcher();


    // FIXED: Local state management
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const {
        handleAddAppointment,
        handleEditAppointment,
        filteredAppointments
    } = useGlobalUI();

    // FIXED: Proper type for the parameter
    const handleViewAppointment = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsViewOpen(true);
    }

    // FIXED: Better error handling and loading state management
    const handleDeleteAppointment = async (appointmentId: string) => {
        // Clear any previous delete errors
        if (deleteError) {
            dispatch(clearDeleteError());
        }

        // Optional: Add confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return;

        try {
            setDeletingAppointmentId(appointmentId);
            await dispatch(deleteAppointment(appointmentId)).unwrap();
            // Optional: Show success message
            console.log("Appointment deleted successfully");
        } catch (error) {
            // Error is already handled by Redux state
            console.error("Failed to delete appointment:", error);
        } finally {
            setDeletingAppointmentId(null);
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

    // FIXED: Handle view dialog close properly
    const handleCloseViewDialog = () => {
        setIsViewOpen(false);
        setSelectedAppointment(null);
    }



    // FIXED: Determine which appointments to display
    const appointmentsToDisplay = filteredAppointments && filteredAppointments.length > 0
        ? filteredAppointments
        : apiAppointments;
    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                        <p className="text-slate-600">Schedule and manage patient appointments</p>
                    </div>
                    <RoleGuard allowedRoles={['admin', 'staff']}>
                        <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-slate-600">Patient</TableHead>
                                    <TableHead className="text-slate-600">Date</TableHead>
                                    <TableHead className="text-slate-600">Time</TableHead>
                                    <TableHead className="text-slate-600">Doctor</TableHead>
                                    <TableHead className="text-slate-600">Type</TableHead>
                                    <TableHead className="text-slate-600">Status</TableHead>
                                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiAppointments.map((appointment) => (
                                    <TableRow key={appointment._id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{appointment.patientName}</TableCell>
                                        <TableCell className="text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.startTime}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.providerName}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" onClick={() => handleViewAppointment(appointment)} size="sm" className="text-slate-600 hover:text-slate-900">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <RoleGuard allowedRoles={['admin', 'staff']}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditAppointment(appointment)}
                                                        className="text-slate-600 hover:text-slate-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </RoleGuard>
                                                <RoleGuard allowedRoles={['admin']} >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteAppointment(appointment._id)}
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
            <ViewAppointmentDialog
                appointment={selectedAppointment}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
        </>
    )
}
