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
import { useAppSelector } from "@/src/redux/store/reduxHook"
import { AppointmentProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/appointments/page"
import { RoleGuard } from "@/components/role-guard"
import { SetStateAction, useState } from "react"
import { ViewAppointmentDialog } from "./organisms/ViewAppointmentDialog"

export default function index({ dashboardId, role }: AppointmentProps) {
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const { user } = useAppSelector(state => state.auth)
    const {
        handleDeleteAppointment,
        handleAddAppointment,
        handleEditAppointment,
        filteredAppointments
    } = useGlobalUI();

    const handleViewAppointment = (appointment: SetStateAction<null>) => {
        setSelectedAppointment(appointment)
        setIsViewOpen(true)
    }
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
                                {filteredAppointments.map((appointment) => (
                                    <TableRow key={appointment.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{appointment.patientName}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.date}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.time}</TableCell>
                                        <TableCell className="text-slate-600">{appointment.doctor}</TableCell>
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
                                                        onClick={() => handleDeleteAppointment(appointment.id)}
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
