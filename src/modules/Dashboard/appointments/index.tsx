"use client"

import {
    Plus,
    Shield,
    Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import {
    getAppointmentTypeBadgeVariant as getTypeVariant,
    getAppointmentStatusBadgeVariant as getStatusVariant,
    getAppointmentTypeCustomStyles,
    getAppointmentStatusCustomStyles
} from '@/src/utils/appointment-badge.utils'
// Import form components
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { RoleGuard } from "@/components/role-guard"
import { useState } from "react"
import { ViewAppointmentDialog } from "./organisms/ViewAppointmentDialog"
import { Appointment } from "./api/types"
import { useAppointmentsFetcher } from "./api/useAppointmentsFetcher"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { UserRole } from "@/src/enum"
import { useAppointment } from "@/src/redux/providers/contexts/AppointmentContext"
import { AppointmentProps } from "@/app/(DASHBOARD)/[role]/appointments/page"
import { TableRowActions } from "../../../components/ui/TableRowActions"

export default function index({ role }: AppointmentProps) {
    useAppointmentsFetcher()

    const {
        appointments: apiAppointments,
        loading: appointmentsLoading,
        error: appointmentsError,
        count: appointmentsCount
    } = useAppSelector(state => state.appointment);

    const {
        handleAddAppointment,
        handleDeleteAppointment,
        handleCancelAppointment,
        setAppointment,
        appointment,
        handleEditAppointment,
        handleEditRescheduledAppointment,
    } = useAppointment();


    const [isViewOpen, setIsViewOpen] = useState(false);


    const handleViewAppointment = (appointment: Appointment) => {
        setAppointment(appointment);
        setIsViewOpen(true);
    }

    const handleCloseViewDialog = () => {
        setIsViewOpen(false);
        setAppointment(null);
    }

    return (
        <ProtectedRoleGuard role={role}>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                        <p className="text-slate-600">Schedule and manage patient appointments</p>
                    </div>
                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN]}>
                        <Button onClick={handleAddAppointment} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-4 sm:p-6 overflow-x-auto">
                        {appointmentsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                <span className="ml-2 text-slate-600">Loading appointments...</span>
                            </div>
                        ) : appointmentsError ? (
                            <div className="text-center text-red-600 py-6">
                                <p>{appointmentsError}</p>
                            </div>
                        ) : (
                            <div className="min-w-[768px]">

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
                                                <TableCell colSpan={7} className="text-center py-10">
                                                    <div className="flex flex-col items-center justify-center space-y-2">
                                                        <Shield className="w-10 h-10 text-slate-400" />
                                                        <p className="text-slate-600">No appointment found</p>
                                                        <p className="text-sm text-slate-400">Start by scheduling a new appointment with a doctor.</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {apiAppointments.map((appointment) => (
                                            <TableRow key={appointment._id} className="hover:bg-slate-50">
                                                <TableCell className="font-medium text-slate-900">{appointment.patientId?.fullName}</TableCell>
                                                <TableCell className="text-slate-600">{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-slate-600">{appointment.startTime}</TableCell>
                                                <TableCell className="text-slate-600">{appointment.providerId?.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={getAppointmentTypeCustomStyles(appointment.type)}>
                                                        {appointment.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={getAppointmentStatusCustomStyles(appointment.status)}>
                                                        {appointment.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <TableRowActions
                                                            onView={() => handleViewAppointment(appointment)}
                                                            onEdit={() => handleEditAppointment(appointment)}
                                                            onDelete={() => handleDeleteAppointment(appointment._id)}
                                                            onReschedule={() => handleEditRescheduledAppointment(appointment)}
                                                            onCancel={() => handleCancelAppointment(appointment._id)}
                                                        />

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                    </TableBody>
                                </Table>
                            </div>

                        )}
                    </CardContent>
                </Card>
            </div >
            <ViewAppointmentDialog
                appointment={appointment}
                isOpen={isViewOpen}
                onClose={handleCloseViewDialog}
            />
        </ProtectedRoleGuard >
    )
}
