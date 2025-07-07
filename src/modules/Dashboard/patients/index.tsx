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
import { useCallback, useState } from "react";
import { Patient } from "./api/types";
import { deletePatient, fetchAllPatients, clearCreateError, clearCreateSuccess, clearError, clearPatients, clearUpdateError, clearUpdateSuccess, createPatients } from "./api/slice";
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute";
import PatientForm from "@/src/components/patient-form";
import { UserRole } from "@/src/enum";
import { usePatient } from "@/src/redux/providers/contexts/PatientContext";


export default function index({ dashboardId, role }: PatientsProps) {

    // Custom hook for fetching appointments
    usePatientsFetcher();
    const { patients: apipatients, loading: patientsLoading, error: patientsError, count: patientsCount } = useAppSelector(state => state.patients)

    const [patients, setPatients] = useState<Patient | null>(null);
   
    const {
        handleAddPatient,
        handleDeletePatient,
        handleEditPatient,
    } = usePatient();


    const dispatch = useAppDispatch();
    // const [selectedPatients, setSelectedPatients] = useState<Patient | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);


    // FIXED: Proper type for the parameter
    const handleViewPatients = (patient: Patient) => {
        setPatients(patient);
        setIsViewOpen(true);
    }

    // const handleEditPatient = (patient: Patient) => {
    //     setPatients(patient);
    //     setPatientFormOpen(true);
    // };

    // const handleSave = useCallback(() => {
    //     setPatientFormOpen(false);
    // }, []);

    // const handleDeletePatient = async (patientId: string) => {
    //     await dispatch(deletePatient(patientId)).unwrap();
    //     dispatch(fetchAllPatients());
    // }

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
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
                                {patientsCount === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                                            No patients found. Please add a new patient to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    apipatients.map((patient: Patient) => (
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <ViewPatientDialog
                patient={patients}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
            {/* <PatientForm
                open={patientFormOpen}
                onOpenChange={setPatientFormOpen}
                mode={"edit"}
                patient={patients}
                onSave={handleSave}
            /> */}
        </ProtectedRoleGuard>

    )
}
