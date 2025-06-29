"use client"

import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Shield,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import form components
import { Appointments, getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { AppointmentProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/appointments/page"
import { RoleGuard } from "@/components/role-guard"
import { useState } from "react"
import { ViewAppointmentDialog } from "./organisms/ViewAppointmentDialog"
import { Appointment } from "./api/types"
import { useAppointmentsFetcher } from "./api/useAppointmentsFetcher"
import { deleteAppointment, fetchAllAppointments } from "./api/slice"
import AppointmentForm from "@/src/components/appointment-form"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"

export default function index({ dashboardId, role }: AppointmentProps) {
    const dispatch = useAppDispatch();
    useAppointmentsFetcher()

    // FIXED: Local state management
    const [updateAppointmentFormOpen, setUpdateAppointmentFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Appointment | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // FIXED: Destructure Redux state properly
    const { handleAddAppointment } = useGlobalUI();
    const {
        updateError,
        updateLoading,
        appointments: apiAppointments,
        loading: appointmentsLoading,
        error: appointmentsError,
        count: appointmentsCount
        
    } = useAppSelector(state => state.appointment);

    // FIXED: Proper type for the parameter
    // const handleViewAppointment = (appointment: Appointment) => {
    //     setSelectedAppointment(appointment);
    //     setIsViewOpen(true);
    // }

    // FIXED: Better error handling and loading state management
    // const handleDeleteAppointment = async (appointmentId: string) => {
    //     await dispatch(deleteAppointment(appointmentId)).unwrap();
    //     dispatch(fetchAllAppointments());
    // }

    // FIXED: Handle view dialog close properly
    // const handleCloseViewDialog = () => {
    //     setIsViewOpen(false);
    //     setSelectedAppointment(null);
    // }

    const handleEditAppointment = (appointment: Appointment) => {
        console.log('Editing appointment:', appointment);
        setEditingItem(appointment);
        setUpdateAppointmentFormOpen(true);
    };

    const handleCloseEditForm = () => {
        setUpdateAppointmentFormOpen(false);
        setEditingItem(null);
    };

    const handleViewAppointment = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsViewOpen(true);
    }

    const handleDeleteAppointment = async (appointmentId: string) => {
        try {
            await dispatch(deleteAppointment(appointmentId)).unwrap();
            await dispatch(fetchAllAppointments());
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    }

    const handleCloseViewDialog = () => {
        setIsViewOpen(false);
        setSelectedAppointment(null);
    }

    const handleUpdatedAppointment = async (updatedAppointment: Appointment) => {
        try {
            // Close the form
            setUpdateAppointmentFormOpen(false);

            // Clear the editing item
            setEditingItem(null);

            // Refresh the appointments list to show updated data
            await dispatch(fetchAllAppointments());

            // Optional: Show success message
            console.log('Appointment updated successfully:', updatedAppointment);

        } catch (error) {
            console.error('Error handling updated appointment:', error);
            // Optional: Show error message to user
        }
    };

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>

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
                                {appointmentsCount === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                                            No appointment found. Please add a new appointment to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
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
                onClose={handleCloseViewDialog}
            />
            <AppointmentForm
                open={updateAppointmentFormOpen}
                appointment={editingItem}
                onOpenChange={handleCloseEditForm}
                mode={"edit"}
                onSave={handleUpdatedAppointment}
            />
        </ProtectedRoleGuard>
    )
}
