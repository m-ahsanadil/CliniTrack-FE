"use client";
import { SetStateAction, useState } from "react"
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
import { Appointments, getStatusBadgeVariant, Invoices, MedicalRecords, Patients } from "@/src/constants";
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext";


export default function index() {
const {setPatientFormOpen, setEditingItem, searchTerm, patients, setAppointments, setPatients, appointments, medicalRecords, setMedicalRecords, setInvoices, invoices} = useGlobalUI();

    // Filter functions
    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // CRUD handlers
    const handleAddPatient = () => {
        setEditingItem(null)
        setPatientFormOpen(true)
    }

    const handleEditPatient = (patient: { id: number; name: string; age: number; gender: string; phone: string; email: string; address: string; bloodType: string; allergies: string; emergencyContact: string; insuranceProvider: string; insuranceNumber: string; status: string; lastVisit: string; }) => {
        setEditingItem(patient)
        setPatientFormOpen(true)
    }

    const handleDeletePatient = (patientId: number) => {
        if (confirm("Are you sure you want to delete this patient?")) {
            setPatients(patients.filter((p) => p.id !== patientId))
            // Also remove related appointments, records, and invoices
            setAppointments(appointments.filter((a) => a.patientId !== patientId))
            setMedicalRecords(medicalRecords.filter((r) => r.patientId !== patientId))
            setInvoices(invoices.filter((i) => i.patientId !== patientId))
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Patients</h2>
                    <p className="text-slate-600">Manage patient information and records</p>
                </div>
                <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Patient
                </Button>
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
                            {filteredPatients.map((patient) => (
                                <TableRow key={patient.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium text-slate-900">{patient.name}</TableCell>
                                    <TableCell className="text-slate-600">{patient.age}</TableCell>
                                    <TableCell className="text-slate-600">{patient.gender}</TableCell>
                                    <TableCell className="text-slate-600">{patient.phone}</TableCell>
                                    <TableCell className="text-slate-600">{patient.lastVisit}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditPatient(patient)}
                                                className="text-slate-600 hover:text-slate-900"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <RoleGuard allowedRoles={["admin"]}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeletePatient(patient.id)}
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
    )
}
