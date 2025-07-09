"use client";
import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Loader2,
    Shield,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { getStatusBadgeVariant } from "@/src/constants";
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { usePatientsFetcher } from "./api/usePatientsFetcher";
import { ViewPatientDialog } from "./organisms/ViewPatientsDialog";
import { useState } from "react";
import { Patient } from "./api/types";
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute";
import { UserRole } from "@/src/enum";
import { usePatient } from "@/src/redux/providers/contexts/PatientContext";
import { PatientsProps } from "@/app/(DASHBOARD)/[role]/patients/page";


export default function index({ role }: PatientsProps) {

    // Custom hook for fetching appointments
    usePatientsFetcher();
    const { patients: apipatients, loading: patientsLoading, error: patientsError, count: patientsCount } = useAppSelector(state => state.patients)

    const [patient, setPatient] = useState<Patient | null>(null);

    const {
        handleAddPatient,
        handleDeletePatient,
        handleEditPatient,
    } = usePatient();



    const [isViewOpen, setIsViewOpen] = useState(false);


    // FIXED: Proper type for the parameter
    const handleViewPatients = (patient: Patient) => {
        setPatient(patient);
        setIsViewOpen(true);
    }

    return (
        <ProtectedRoleGuard role={role}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Patients</h2>
                        <p className="text-slate-600">Manage patient information and records</p>
                    </div>
                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF]}>
                        <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Patient
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        {patientsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                <span className="ml-2 text-slate-600">Loading Patients...</span>
                            </div>
                        ) : patientsError ? (
                            <div className="text-red-600 text-center py-6">
                                <p>{patientsError}</p>
                            </div>
                        ) : (
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
                                    {patientsCount === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10">
                                                <div className="flex flex-col items-center justify-center space-y-2">
                                                    <Shield className="w-10 h-10 text-slate-400" />
                                                    <p className="text-slate-600">No patients found</p>
                                                    <p className="text-sm text-slate-400">Please add a new patient to get started.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
                                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF]}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditPatient(patient)}
                                                            className="text-slate-600 hover:text-slate-900"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </RoleGuard>
                                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
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
                        )}
                    </CardContent>
                </Card>
            </div>
            <ViewPatientDialog
                patient={patient}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />

        </ProtectedRoleGuard>
    )
}
