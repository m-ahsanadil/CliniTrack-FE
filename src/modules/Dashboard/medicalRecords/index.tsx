"use client"

import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Shield,
    Calendar,
    User,
    FileText
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { getStatusBadgeVariant } from "@/src/constants"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { MedicalRecordProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/medical-records/page"
import { useMedicalRecordsFetcher } from "./api/useMedicalRecord"
import { clearDeleteError, deleteMedicalRecord } from "./api/slice"
import { useCallback, useEffect, useState } from "react"
import { ViewMedicalRecordDialog } from "./organisms/ViewMedicalRecordDialog"
import { useRouter } from "next/navigation"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { formatDate } from "@/src/utils/dateFormatter"
import MedicalRecordForm from "@/src/components/medical-record-form"
import { MedicalRecordGetAll } from "./api/types"

export default function index({ dashboardId, role }: MedicalRecordProps) {
    const dispatch = useAppDispatch();
    const { user, token } = useAppSelector(state => state.auth);
    const router = useRouter();

    // Custom hook for fetching appointments
    useMedicalRecordsFetcher();

    const { handleAddMedicalRecord, filteredMedicalRecords } = useGlobalUI();
    const { medicalRecords: apiMedicalRecord, deleteError, deleteLoading, count: medicalCount } = useAppSelector(state => state.medicalRecord);
    const { basicInfo: patientsBasicInfo } = useAppSelector(state => state.patients);
    const { basicInfo: providerBasicInfo } = useAppSelector(state => state.provider);

    // FIXED: Local state management
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<MedicalRecordGetAll | null>(null);
    const [deletingMedicalRecordId, setDeletingMedicalRecordId] = useState<string | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecordGetAll | null>(null);
    const [formOpen, setFormOpen] = useState(false);


    const handleDeleteMedicalRecord = async (medicalRecordId: string) => {
        // Clear any previous delete errors
        if (deleteError) {
            dispatch(clearDeleteError());
        }

        // Optional: Add confirmation dialog
        const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmDelete) return;

        try {
            setDeletingMedicalRecordId(medicalRecordId);
            await dispatch(deleteMedicalRecord(medicalRecordId)).unwrap();
            // Optional: Show success message
        } catch (error) {
            // Error is already handled by Redux state
        } finally {
            setDeletingMedicalRecordId(null);
        }
    }

    // FIXED: Effect to handle delete errors
    useEffect(() => {
        if (deleteError) {
            // You could show a toast notification here
            // Clear the error after showing it
            setTimeout(() => {
                dispatch(clearDeleteError());
            }, 5000);
        }
    }, [deleteError, dispatch]);

    const handleViewMedicalRecord = (record: MedicalRecordGetAll) => {
        setSelectedMedicalRecord(record);
        setIsViewOpen(true);
    }

    const handleEditMedicalRecord = (record: MedicalRecordGetAll) => {
        setSelectedRecord(record);
        setFormOpen(true);
    };

    const handleSave = useCallback(() => {
        setFormOpen(false);
    }, []);


    return (  
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
            <RoleGuard
                allowedRoles={["admin", "doctor"]}
                fallback={
                    <div className="text-center py-12">
                        <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Access Restricted</h3>
                        <p className="text-slate-600">You don't have permission to view medical records.</p>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Medical Records</h2>
                            <p className="text-slate-600">Patient medical history and treatment records</p>
                        </div>
                        <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medical Record
                        </Button>
                    </div>

                    <Card className="bg-white border border-slate-200">
                        <CardContent className="p-6">
                            <TooltipProvider>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-slate-600">Patient</TableHead>
                                            <TableHead className="text-slate-600">Date</TableHead>
                                            <TableHead className="text-slate-600">Provider</TableHead>
                                            <TableHead className="text-slate-600">Diagnosis</TableHead>
                                            <TableHead className="text-slate-600">Summary</TableHead>
                                            <TableHead className="text-right text-slate-600">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {medicalCount === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                                                    No medical record found. Please add a new medical record to get started.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {apiMedicalRecord.map((record: MedicalRecordGetAll) => (
                                            <TableRow key={record._id} className="hover:bg-slate-50">
                                                <TableCell className="font-medium text-slate-900">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4 text-slate-400" />
                                                        <span>{record.patientId?.fullName}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4 text-slate-400" />
                                                        <span>{formatDate(record.recordDate)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    {record.providerId?.name}
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="cursor-help">
                                                                {record.diagnosis.length > 30
                                                                    ? `${record.diagnosis.substring(0, 30)}...`
                                                                    : record.diagnosis
                                                                }
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="max-w-xs">{record.diagnosis}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell className="text-slate-600">
                                                    <div className="space-y-1">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <div className="flex items-center space-x-2 text-sm">
                                                                    <FileText className="h-3 w-3 text-slate-400" />
                                                                    <span className="text-xs">
                                                                        Treatment: {record.treatment.length > 20
                                                                            ? `${record.treatment.substring(0, 20)}...`
                                                                            : record.treatment
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <div className="max-w-xs space-y-2">
                                                                    <p><strong>Treatment:</strong> {record.treatment}</p>
                                                                    <p><strong>Prescription:</strong> {record.prescription}</p>
                                                                    {record.notes && <p><strong>Notes:</strong> {record.notes}</p>}
                                                                </div>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                        {record.prescription && (
                                                            <div className="text-xs text-slate-500">
                                                                Rx: {record.prescription.length > 25
                                                                    ? `${record.prescription.substring(0, 25)}...`
                                                                    : record.prescription
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {/* View button - Available to all roles that can access medical records */}
                                                        <RoleGuard allowedRoles={["admin", "doctor", "staff"]}>
                                                            <Button variant="ghost" onClick={() => handleViewMedicalRecord(record)} size="sm" className="text-slate-600 hover:text-slate-900">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </RoleGuard>

                                                        {/* Edit button - Only admin and doctor can update medical records */}
                                                        <RoleGuard allowedRoles={["admin", "doctor"]}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEditMedicalRecord(record)}
                                                                className="text-slate-600 hover:text-slate-900"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </RoleGuard>

                                                        {/* Delete button - Only admin can delete medical records */}
                                                        <RoleGuard allowedRoles={["admin"]}>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteMedicalRecord(record._id)}
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
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                </div>
            </RoleGuard>
            <ViewMedicalRecordDialog
                medicalRecord={selectedMedicalRecord}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
            {/* <MedicalRecordForm
                open={medicalRecordFormOpen}
                onOpenChange={setMedicalRecordFormOpen}
                mode={"edit"}
                patients={patientsBasicInfo}
                provider={providerBasicInfo}
            /> */}
            <MedicalRecordForm
                open={formOpen}
                onOpenChange={setFormOpen}
                record={selectedRecord || undefined}
                mode="edit"
                onSave={handleSave}
                patients={patientsBasicInfo}
                provider={providerBasicInfo}
            />
        </ProtectedRoleGuard>
    )
}
