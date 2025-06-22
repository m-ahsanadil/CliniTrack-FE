"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Invoice } from "../api/types"

type Props = {
    invoice: Invoice | null
    isOpen: boolean
    onClose: () => void
}

export const ViewInvoicesDialog = ({ invoice, isOpen, onClose }: Props) => {
    if (!invoice) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">Invoice Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div><strong>Invoice #:</strong> {invoice.invoiceNumber}</div>
                    <div><strong>Status:</strong> {invoice.status}</div>
                    <div><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</div>
                    <div><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</div>
                    <div><strong>Amount:</strong> ${invoice.amount?.toFixed(2)}</div>
                    <div><strong>Total Amount:</strong> ${invoice.totalAmount?.toFixed(2)}</div>

                    <div><strong>Patient Name:</strong> {invoice.patientId?.fullName || "Unknown"}</div>
                    <div><strong>Provider Name:</strong> {invoice.providerId?.name || "Unknown"}</div>
                    <div><strong>Notes:</strong> {invoice.notes || "N/A"}</div>

                    <div><strong>Created By:</strong> {invoice.createdBy}</div>
                    <div><strong>Updated By:</strong> {invoice.updatedBy}</div>
                    <div><strong>Created At:</strong> {new Date(invoice.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(invoice.updatedAt).toLocaleString()}</div>

                    <div className="col-span-2 mt-4">
                        <strong>Services:</strong>
                        {invoice.services.length > 0 ? (
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                {invoice.services.map(service => (
                                    <li key={service._id}>
                                        <span className="font-medium">{service.description}</span> — Qty: {service.quantity}, Unit: ${service.unitPrice}, Total: ${service.total}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-slate-500">No services listed.</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}