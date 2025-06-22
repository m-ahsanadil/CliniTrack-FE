"use client";
import {
    Calendar,
    Users,
    Plus,
    DollarSign,
    TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DoctorProfileDialog } from "../doctor/organisms/DoctorProfileDialog";
import { DoctorProfileRequest } from "../doctor/api/types";
import { DashboardProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/dashboard/page";
import { fetchAllAppointments } from "../appointments/api/slice";
import { fetchAllMedicalRecord } from "../medicalRecords/api/slice";
import { useAppointmentsFetcher } from "../appointments/api/useAppointmentsFetcher";



export default function index({ dashboardId, role }: DashboardProps) {
    const dispatch = useAppDispatch();
    const router = useRouter()
    useAppointmentsFetcher();

    const { user } = useAppSelector(state => state.auth)
    // Get appointments from Redux store
    const { appointments: apiAppointments, loading: appointmentsLoading, error: appointmentsError, count: appointmentsCount } = useAppSelector(state => state.appointment)
    const { medicalRecords: apiMedicalRecords, loading: medicalRecordLoading, error: medicalRecordError, count } = useAppSelector(state => state.medicalRecord);


    const { patients, appointments, invoices, medicalRecords, handleAddAppointment, handleAddInvoice, handleAddPatient, handleAddMedicalRecord } = useGlobalUI();
    const [showDoctorProfileDialog, setShowDoctorProfileDialog] = useState(false)

    useEffect(() => {
        // Check if user is a doctor and show profile dialog
        if (user?.role === 'admin') {
            setShowDoctorProfileDialog(true);
        }
    }, [user])

    // Fetch appointments when component mounts
    useEffect(() => {
        dispatch(fetchAllMedicalRecord());
    }, [dispatch]);

    // Handle doctor profile creation
    const handleDoctorProfileCreate = (newProfile: DoctorProfileRequest) => {
        console.log('Doctor profile created:', newProfile);
        // You can dispatch an action to update the user profile in Redux if needed
    }

    // Handle dialog close (when user clicks "Skip for Now")
    const handleDoctorDialogClose = (open: boolean) => {
        setShowDoctorProfileDialog(open);
        if (!open) {

        }
    }

    // Get today's appointments from API data
    const getTodaysAppointments = () => {
        const today = new Date().toISOString().split('T')[0];
        return apiAppointments.filter(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
            return appointmentDate === today;
        });
    };

    const todaysAppointments = getTodaysAppointments();
    return (
        <>

            {/* Doctor Profile Dialog */}
            {showDoctorProfileDialog ? (
                <DoctorProfileDialog
                    mode="create"
                    isOpen={showDoctorProfileDialog}
                    onOpenChange={handleDoctorDialogClose}
                    // onCreate={handleDoctorProfileCreate}
                    triggerButton={false} // Don't show trigger button since we're controlling it externally
                />
            ) : (
                <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! </h2>
                        <p className="opacity-90">
                            {user?.role === "admin" && "You have full access to all system features and user management."}
                            {user?.role === "doctor" && "Access patient records, appointments, and medical documentation."}
                            {user?.role === "staff" && "Manage appointments, patient check-ins, and basic records."}
                        </p>
                        {user?.department && <p className="text-sm opacity-75 mt-1">Department: {user.department}</p>}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
                                <Users className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
                                <p className="text-xs text-slate-500">Active patients in system</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border border-slate-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600">Today's Appointments</CardTitle>
                                <Calendar className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{appointmentsCount}</div>
                                <p className="text-xs text-slate-500">Scheduled for today</p>
                            </CardContent>
                        </Card>

                        <RoleGuard allowedRoles={["admin", "staff"]}>
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600">Pending Invoices</CardTitle>
                                    <DollarSign className="h-4 w-4 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {invoices.filter((invoice) => invoice.status === "Pending").length}
                                    </div>
                                    <p className="text-xs text-slate-500">Awaiting payment</p>
                                </CardContent>
                            </Card>
                        </RoleGuard>

                        <RoleGuard allowedRoles={["admin"]}>
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-purple-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">
                                        $
                                        {invoices
                                            .filter((i) => i.status === "Paid")
                                            .reduce((sum, i) => sum + i.total, 0)
                                            .toLocaleString()}
                                    </div>
                                    <p className="text-xs text-slate-500">+12% from last month</p>
                                </CardContent>
                            </Card>
                        </RoleGuard>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-white border border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-slate-900">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <RoleGuard allowedRoles={['admin', 'staff']}>
                                    <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Patient
                                    </Button>
                                </RoleGuard>
                                <RoleGuard allowedRoles={['admin', 'staff']}>
                                    <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Schedule Appointment
                                    </Button>
                                </RoleGuard>
                                <RoleGuard allowedRoles={["admin", "doctor"]}>
                                    <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Medical Record
                                    </Button>
                                </RoleGuard>
                                <RoleGuard allowedRoles={["admin", "staff"]}>
                                    <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700 text-white">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Invoice
                                    </Button>
                                </RoleGuard>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white border border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Recent Appointments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* <div className="space-y-3">
                                    {appointments.slice(0, 3).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-slate-900">{appointment.patientName}</p>
                                                <p className="text-sm text-slate-500">
                                                    {appointment.date} at {appointment.time}
                                                </p>
                                            </div>
                                            <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                                        </div>
                                    ))}
                                </div> */}
                                {appointmentsLoading ? (
                                    <div className="text-center py-4">Loading appointments...</div>
                                ) : appointmentsError ? (
                                    <div className="text-center py-4 text-red-500">Error: {appointmentsError}</div>
                                ) : (
                                    <div className="space-y-3">
                                        {apiAppointments.slice(0, 3).map((appointment) => (
                                            <div
                                                key={appointment._id}
                                                className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                    <div>
                                                        <p className="font-semibold text-lg text-slate-800">{appointment.patientName}</p>
                                                        <p className="text-sm text-slate-600 mt-1">
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-0.5 italic">
                                                            Reason: {appointment.reasonForVisit || "N/A"}
                                                        </p>
                                                    </div>
                                                    <Badge className="min-w-[80px] justify-center" variant={getStatusBadgeVariant(appointment.status)}>
                                                        {appointment.status}
                                                    </Badge>
                                                </div>
                                            </div>

                                        ))}
                                        {apiAppointments.length === 0 && (
                                            <div className="text-center py-4 text-slate-500">No appointments found</div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* <RoleGuard allowedRoles={["admin", "doctor"]}>
                            <Card className="bg-white border border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Recent Medical Records</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {medicalRecords.slice(0, 3).map((record) => (
                                            <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-slate-900">{record.patientName}</p>
                                                    <p className="text-sm text-slate-500">{record.diagnosis}</p>
                                                </div>
                                                <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </RoleGuard> */}
                        <RoleGuard allowedRoles={["admin", "doctor", 'staff']}>
                            <Card className="bg-white border border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Recent Medical Records</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {medicalRecordLoading ? (
                                            <div className="text-center py-4">Loading medical records...</div>
                                        ) : medicalRecordError ? (
                                            <div className="text-center py-4 text-red-500">Error: {medicalRecordError}</div>
                                        ) : (
                                            <div className="space-y-4">
                                                {apiMedicalRecords.slice(0, 3).map((record) => (
                                                    <div key={record._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                                            <div>
                                                                <p className="font-semibold text-lg text-slate-800">{record.patientId.fullName}</p>
                                                                <p className="text-sm text-slate-600 mt-1">{record.diagnosis}</p>
                                                                <p className="text-xs text-slate-500 mt-0.5 italic">Treatment: {record.treatment || "N/A"}</p>
                                                                <p className="text-xs text-slate-400 mt-0.5">Date: {new Date(record.recordDate).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="text-right mt-2">
                                                                <Button variant="link" className="text-blue-600" onClick={() => router.push(`/${user?.id}/${user?.role}/appointments`)}>
                                                                    View All Appointments →
                                                                </Button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}
                                                {apiMedicalRecords.length === 0 && (
                                                    <div className="text-center py-4 text-slate-500">No medical records found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </RoleGuard>

                    </div>
                </div>
            )}
        </>
    )
}
