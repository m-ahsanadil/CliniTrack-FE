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
import { useAuth } from "@/src/redux/providers/contexts/auth-context"
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppSelector } from "@/src/redux/store/reduxHook";



export default function index() {
    const { user } = useAppSelector(state => state.auth)
    // const { user } = useAuth()
    const { setEditingItem, setPatientFormOpen, setAppointmentFormOpen, setMedicalRecordFormOpen, setInvoiceFormOpen, patients, appointments, invoices, medicalRecords } = useGlobalUI();

    // CRUD handlers
    const handleAddPatient = () => {
        setEditingItem(null)
        setPatientFormOpen(true)
    }
    const handleAddAppointment = () => {
        setEditingItem(null)
        setAppointmentFormOpen(true)
    }
    const handleAddMedicalRecord = () => {
        setEditingItem(null)
        setMedicalRecordFormOpen(true)
    }

    const handleAddInvoice = () => {
        setEditingItem(null)
        setInvoiceFormOpen(true)
    }


    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! </h2>
                <p className="opacity-90">
                    {user?.role === "admin" && "You have full access to all system features and user management."}
                    {user?.role === "doctor" && "Access patient records, appointments, and medical documentation."}
                    {user?.role === "staff" && "Manage appointments, patient check-ins, and basic records."}
                </p>
                {user?.email && <p className="text-sm opacity-75 mt-1">Department: {user.email}</p>}
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
                        <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
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
                        <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Patient
                        </Button>
                        <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Appointment
                        </Button>
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
                        <div className="space-y-3">
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
                        </div>
                    </CardContent>
                </Card>

                <RoleGuard allowedRoles={["admin", "doctor"]}>
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
                </RoleGuard>
            </div>
        </div>
    )
}
