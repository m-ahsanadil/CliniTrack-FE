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
import { TableRowActions } from "../patients/atoms/TableRowActions"

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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
                        <p className="text-slate-600">Schedule and manage patient appointments</p>
                    </div>
                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN]}>
                        <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
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
                                                    //   ,
                                                    // ,
                                                    // ,
                                                    // ,
                                                    />

                                                    {/* <Button variant="ghost" onClick={() => handleViewAppointment(appointment)} size="sm" className="text-slate-600 hover:text-slate-900">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN]}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditAppointment(appointment)}
                                                            className="text-slate-600 hover:text-slate-900"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </RoleGuard>
                                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]} >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteAppointment(appointment._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </RoleGuard> */}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            </Table>
                        )
                        }
                    </CardContent >
                </Card >
            </div >
            <ViewAppointmentDialog
                appointment={appointment}
                isOpen={isViewOpen}
                onClose={handleCloseViewDialog}
            />
        </ProtectedRoleGuard >
    )
}
