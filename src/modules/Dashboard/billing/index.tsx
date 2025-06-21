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
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { FC } from "react"
import { BillingProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/billing/page"
import { useAppSelector } from "@/src/redux/store/reduxHook"

export default function index({ dashboardId, role }: BillingProps) {
    const { user } = useAppSelector(state => state.auth);

    const { handleAddInvoice, filteredInvoices, handleEditInvoice, handleDeleteInvoice } = useGlobalUI();

    return (
        <RoleGuard
            allowedRoles={["admin", "staff"]}
            fallback={
                <div className="text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Access Restricted</h3>
                    <p className="text-slate-600">You don't have permission to view billing information.</p>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
                        <p className="text-slate-600">Manage patient billing and payment records</p>
                    </div>
                    <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Invoice
                    </Button>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-slate-600">Patient</TableHead>
                                    <TableHead className="text-slate-600">Date</TableHead>
                                    <TableHead className="text-slate-600">Service</TableHead>
                                    <TableHead className="text-slate-600">Amount</TableHead>
                                    <TableHead className="text-slate-600">Status</TableHead>
                                    <TableHead className="text-slate-600">Insurance</TableHead>
                                    <TableHead className="text-right text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.map((invoice) => (
                                    <TableRow key={invoice.id} className="hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">{invoice.patientName}</TableCell>
                                        <TableCell className="text-slate-600">{invoice.date}</TableCell>
                                        <TableCell className="text-slate-600">{invoice.service}</TableCell>
                                        <TableCell className="text-slate-600">${invoice.total.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(invoice.insuranceClaim)}>{invoice.insuranceClaim}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEditInvoice(invoice)}
                                                    className="text-slate-600 hover:text-slate-900"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <RoleGuard allowedRoles={["admin"]}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteInvoice(invoice.id)}
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
