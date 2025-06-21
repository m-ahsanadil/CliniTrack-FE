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

// Import components
import { RoleGuard } from "@/components/role-guard"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { getStatusBadgeVariant } from "@/src/constants"
import { useAppSelector } from "@/src/redux/store/reduxHook"
import { MedicalRecordProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/medical-records/page"


export default function index({ dashboardId, role }: MedicalRecordProps) {
    const {user} = useAppSelector(state => state.auth)
    const { handleAddMedicalRecord, filteredMedicalRecords, handleEditMedicalRecord, handleDeleteMedicalRecord } = useGlobalUI();
  
    return (
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-slate-600">Patient</TableHead>
                                    <TableHead className="text-slate-600">Date</TableHead>
                                    <TableHead className="text-slate-600">Doctor</TableHead>
                                    <TableHead className="text-slate-600">Diagnosis</TableHead>
                                    <TableHead className="text-slate-600">Severity</TableHead>
                                    <TableHead className="text-slate-600">Status</TableHead>
                                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMedicalRecords.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{record.patientName}</TableCell>
                                        <TableCell className="text-slate-600">{record.date}</TableCell>
                                        <TableCell className="text-slate-600">{record.doctor}</TableCell>
                                        <TableCell className="text-slate-600">{record.diagnosis}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    record.severity === "Severe"
                                                        ? "destructive"
                                                        : record.severity === "Moderate"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {record.severity}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditMedicalRecord(record)}
                                                    className="text-slate-600 hover:text-slate-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <RoleGuard allowedRoles={["admin"]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteMedicalRecord(record.id)}
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
        </RoleGuard>
    )
}
