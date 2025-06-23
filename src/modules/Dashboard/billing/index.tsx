"use client"

import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Shield
    , CreditCard
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { BillingProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/billing/page"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { useInvoiceFetcher } from "./api/useInvoiceFetcher"
import { Invoice } from "./api/types"
import { useAppointmentsFetcher } from "../appointments/api/useAppointmentsFetcher"
import { usePatientsFetcher } from "../patients/api/usePatientsFetcher"
import { useReportsFetcher } from "../reports/api/useReportsFetcher"
import { ViewInvoicesDialog } from "./organisms/ViewBillingDialog"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { deleteInvoice, fetchAllInvoices } from "./api/slice"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { formatDate } from "@/src/utils/dateFormatter"


export default function index({ dashboardId, role }: BillingProps) {
    const dispatch = useAppDispatch();

    // Custom hook for fetching appointments
    useInvoiceFetcher();

    const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [paymentLoading, setPaymentLoading] = useState<string | null>(null) // Track which invoice is being processed
 
    const { invoices, isLoadingInvoices, getInvoicesError, totalCount } = useAppSelector(state => state.invoice)
    const { handleAddInvoice, filteredInvoices, handleEditInvoice } = useGlobalUI();


    // Helper function to get first service description
    const getFirstServiceDescription = (services: Invoice['services']) => {
        if (services && services.length > 0) {
            return services[0].description;
        }
        return 'No services';
    };

    // Helper function to get services count
    const getServicesCount = (services: Invoice['services']) => {
        if (!services || services.length === 0) return '';
        if (services.length === 1) return '';
        return ` (+${services.length - 1} more)`;
    };


    if (getInvoicesError) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                    <h3 className="text-lg font-medium mb-2">Error Loading Invoices</h3>
                    <p>{getInvoicesError}</p>
                </div>
            </div>
        );
    }

    const handleMarkAsPaid = async (invoiceId: string) => {
        console.log(invoiceId)
        setPaymentLoading(invoiceId)
    }

    const handleViewInvoices = (billing: Invoice) => {
        setSelectedInvoice(billing);
        setIsViewOpen(true);
    }

    const handleDeleteInvoice = async (invoiceId: string) => {
        await dispatch(deleteInvoice(invoiceId))
            .unwrap()
            .then(() => {
                dispatch(fetchAllInvoices()); // Replaces old data in Redux with updated one
            });
    }

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>

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
                            <p className="text-slate-600">
                                Manage patient billing and payment records
                                {totalCount > 0 && <span className="ml-2">({totalCount} total)</span>}
                            </p>                    </div>
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
                                        <TableHead className="text-slate-600">Invoice #</TableHead>
                                        <TableHead className="text-slate-600">Patient</TableHead>
                                        <TableHead className="text-slate-600">Provider</TableHead>
                                        <TableHead className="text-slate-600">Issue Date</TableHead>
                                        <TableHead className="text-slate-600">Due Date</TableHead>
                                        <TableHead className="text-slate-600">Services</TableHead>
                                        <TableHead className="text-slate-600">Amount</TableHead>
                                        <TableHead className="text-slate-600">Status</TableHead>
                                        <TableHead className="text-right text-slate-600">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {invoices.map((invoice: Invoice) => (
                                        <TableRow key={invoice._id} className="hover:bg-slate-50">
                                            <TableCell className="font-medium text-slate-900">
                                                {invoice.invoiceNumber}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {invoice.patientId?.fullName || 'Unknown Patient'}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {invoice.providerId?.name || 'Unknown Provider'}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {formatDate(invoice.issueDate)}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {formatDate(invoice.dueDate)}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                <div className="max-w-[200px] truncate">
                                                    {getFirstServiceDescription(invoice.services)}
                                                    {getServicesCount(invoice.services)}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                ${invoice.totalAmount?.toFixed(2) || '0.00'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => handleViewInvoices(invoice)}
                                                        size="sm"
                                                        className="text-slate-600 hover:text-slate-900"
                                                        title="View Invoice"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditInvoice(invoice)}
                                                        className="text-slate-600 hover:text-slate-900"
                                                        title="Edit Invoice"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {/* NEW: Mark as Paid Button - Only show for unpaid invoices */}
                                                    {invoice.status !== 'paid' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleMarkAsPaid(invoice._id)}
                                                            disabled={paymentLoading === invoice._id}
                                                            className="text-green-600 hover:text-green-900 hover:bg-green-50"
                                                            title="Mark as Paid"
                                                        >
                                                            {paymentLoading === invoice._id ? (
                                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                                                            ) : (
                                                                <CreditCard className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    )}
                                                    <RoleGuard allowedRoles={["admin"]}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteInvoice(invoice._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete Invoice"
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
            <ViewInvoicesDialog
                invoice={selectedInvoice}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
        </ProtectedRoleGuard>
    )
}
