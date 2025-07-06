"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { generateId } from "../utils/idGenerator"
import { InvoiceStatusValues } from "../enum"

// interface InvoiceFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   invoice?: any
//   onSave: (invoice: any) => void
//   patients: any[]
// }

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: any
  onSave: (invoice: any) => void
  mode: 'create' | 'edit'
  patients: any[]
  providers: any[]
  currentUser: any
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
interface InvoiceService {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}


interface FormData {
  invoiceNumber: string;
  patientId: string;
  providerId: string;
  amount: number;
  totalAmount: number;
  status: "Pending" | "Paid" | "Overdue";
  issueDate: string;
  dueDate: string;
  services: InvoiceService[];
  notes?: string;
  createdBy: string;
  updatedBy: string;
  // Legacy fields for backward compatibility
  patientName: string;
  paymentMethod: string;
  insuranceClaim: string;
  subtotal: number;
  tax: number;
  discount: number;
}


export default function InvoiceForm({ open, onOpenChange, invoice, onSave, patients, providers, currentUser, mode }: InvoiceFormProps) {


  const [formData, setFormData] = useState<FormData>({
    invoiceNumber: invoice?.invoiceNumber || "",
    patientId: invoice?.patientId || "",
    providerId: invoice?.providerId || "",
    amount: invoice?.amount || 0,
    totalAmount: invoice?.totalAmount || 0,
    status: invoice?.status || "Pending",
    issueDate: invoice?.issueDate || "",
    dueDate: invoice?.dueDate || "",
    services: invoice?.services?.map((service: Partial<InvoiceService>) => ({
      description: service.description || "",
      quantity: service.quantity || 0,
      unitPrice: service.unitPrice || 0,
      total: service.total || 0,
    })) || [],
    notes: invoice?.notes || "",
    createdBy: invoice?.createdBy || currentUser?.id || "",
    updatedBy: currentUser?.id || "",
    // Legacy fields
    patientName: invoice?.patientName || "",
    paymentMethod: invoice?.paymentMethod || "",
    insuranceClaim: invoice?.insuranceClaim || "Not Submitted",
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    discount: invoice?.discount || 0,
  })

  const [selectedIssueDate, setSelectedIssueDate] = useState<Date | undefined>(
    invoice?.issueDate ? new Date(invoice.issueDate) : new Date(),
  )

  const [selectedDueDate, setSelectedDueDate] = useState<Date | undefined>(
    invoice?.dueDate ? new Date(invoice.dueDate) : undefined
  )

  const [newService, setNewService] = useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
  })

  // GENERATED NEW INVOICE ID
  // const [id, setId] = useState(() =>
  //   generateId({ prefix: "INV", suffix: 'BILLING' })
  // );

  // const regenerateId = () => {
  //   setId(generateId({ prefix: "INV", suffix: "BILLING" }));
  // };

  const regenerateId = () => {
    // Only allow regeneration in create mode
    if (mode === 'create') {
      const newId = generateId({ prefix: "INV", suffix: "BILLING" });
      setFormData({ ...formData, invoiceNumber: newId });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
    const selectedProvider = providers.find((p) => p.id.toString() === formData.providerId)

    onSave({
      ...formData,
      patientName: selectedPatient?.name || formData.patientName,
      issueDate: selectedIssueDate ? format(selectedIssueDate, "yyyy-MM-dd") : formData.issueDate,
      dueDate: selectedDueDate ? format(selectedDueDate, "yyyy-MM-dd") : "",
      updatedBy: currentUser?.id || formData.updatedBy,
      id: invoice?.id || Date.now(),
    })
    onOpenChange(false)
  }

  const addService = () => {
    if (newService.description.trim()) {
      const total = newService.quantity * newService.unitPrice
      const service = { ...newService, total }
      const updatedServices = [...formData.services, service]
      setFormData({
        ...formData,
        services: updatedServices,
      })
      setNewService({ description: "", quantity: 1, unitPrice: 0, total: 0 })
      calculateTotals(updatedServices)
    }
  }

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index)
    setFormData({ ...formData, services: newServices })
    calculateTotals(newServices)
  }

  const calculateTotals = (services: InvoiceService[]) => {
    const subtotal = services.reduce((sum, service) => sum + service.total, 0)
    const tax = subtotal * 0.08 // 8% tax
    const totalAmount = subtotal + tax - formData.discount
    const amount = subtotal // Base amount before tax and discount

    setFormData((prev) => ({
      ...prev,
      subtotal,
      tax,
      totalAmount,
      amount
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{mode ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invoice Number and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            <div className="flex items-end gap-2">
              <div className="space-y-2 w-full">
                <Label htmlFor="invoiceNumber">{mode === 'edit' ? 'Invoice Number *' : 'Generated Invoice ID'}</Label>
                <Input
                  id="invoiceNumber"
                  readOnly
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="INV-001"
                  required
                />
              </div>
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={regenerateId}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Regenerate
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Pending" | "Paid" | "Overdue") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem> */}
                  {InvoiceStatusValues.map((invoice) => (
                    <SelectItem key={invoice} value={invoice}>
                      {invoice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Patient and Provider Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient, index) => (
                    <SelectItem key={index} value={patient._id}>
                      {patient.fullName} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => setFormData({ ...formData, providerId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider._id}>
                      {provider.name} - {provider.specialty}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedIssueDate ? format(selectedIssueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={selectedIssueDate} onSelect={setSelectedIssueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDueDate ? format(selectedDueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={selectedDueDate} onSelect={setSelectedDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Services</Label>

            {/* Add New Service */}
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Service description"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newService.quantity}
                  onChange={(e) => setNewService({ ...newService, quantity: Number.parseInt(e.target.value) || 1 })}
                  className="bg-slate-700 border-slate-600"
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="unitPrice">Unit Price ($)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={newService.unitPrice}
                  onChange={(e) => setNewService({ ...newService, unitPrice: Number.parseFloat(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <Label>Total</Label>
                <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm">
                  ${(newService.quantity * newService.unitPrice).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                <Button type="button" onClick={addService} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Services List */}
            <div className="space-y-2">
              {formData.services.map((service, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-700/50 p-2 rounded">
                  <div className="col-span-5">{service.description}</div>
                  <div className="col-span-2 text-center">{service.quantity}</div>
                  <div className="col-span-2 text-center">${service.unitPrice.toFixed(2)}</div>
                  <div className="col-span-2 text-center">${service.total.toFixed(2)}</div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeService(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Fields and Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Insurance">Insurance</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceClaim">Insurance Claim</Label>
                  <Select
                    value={formData.insuranceClaim}
                    onValueChange={(value) => setFormData({ ...formData, insuranceClaim: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Submitted">Not Submitted</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Denied">Denied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="createdBy">Created By</Label>
                  <Input
                    id="createdBy"
                    value={formData.createdBy}
                    onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                    className="bg-slate-700 border-slate-600"
                    placeholder="User ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="updatedBy">Updated By</Label>
                  <Input
                    id="updatedBy"
                    value={formData.updatedBy}
                    className="bg-slate-600 border-slate-500"
                    placeholder="User ID"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal (Amount):</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%):</span>
                  <span>${formData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => {
                      const discount = Number.parseFloat(e.target.value) || 0
                      setFormData({ ...formData, discount })
                    }}
                    className="w-20 h-6 text-right bg-slate-600 border-slate-500"
                    step="0.01"
                  />
                </div>
                <hr className="border-slate-600" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>${(formData.subtotal + formData.tax - formData.discount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Additional notes or payment terms"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {invoice ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    // <Dialog open={open} onOpenChange={onOpenChange}>
    //   <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
    //     <DialogHeader>
    //       <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
    //     </DialogHeader>

    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       {/* Patient and Dates */}
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="patient">Patient *</Label>
    //           <Select
    //             value={formData.patientId}
    //             onValueChange={(value) => setFormData({ ...formData, patientId: value })}
    //           >
    //             <SelectTrigger className="bg-slate-700 border-slate-600">
    //               <SelectValue placeholder="Select patient" />
    //             </SelectTrigger>
    //             <SelectContent>
    //               {patients.map((patient) => (
    //                 <SelectItem key={patient.id} value={patient.id.toString()}>
    //                   {patient.name} - {patient.phone}
    //                 </SelectItem>
    //               ))}
    //             </SelectContent>
    //           </Select>
    //         </div>
    //         <div className="space-y-2">
    //           <Label>Invoice Date *</Label>
    //           <Popover>
    //             <PopoverTrigger asChild>
    //               <Button
    //                 variant="outline"
    //                 className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
    //               >
    //                 <CalendarIcon className="mr-2 h-4 w-4" />
    //                 {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
    //               </Button>
    //             </PopoverTrigger>
    //             <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
    //               <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
    //             </PopoverContent>
    //           </Popover>
    //         </div>
    //         <div className="space-y-2">
    //           <Label>Due Date</Label>
    //           <Popover>
    //             <PopoverTrigger asChild>
    //               <Button
    //                 variant="outline"
    //                 className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
    //               >
    //                 <CalendarIcon className="mr-2 h-4 w-4" />
    //                 {dueDate ? format(dueDate, "PPP") : "Pick a date"}
    //               </Button>
    //             </PopoverTrigger>
    //             <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
    //               <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
    //             </PopoverContent>
    //           </Popover>
    //         </div>
    //       </div>

    //       {/* Service Items */}
    //       <div className="space-y-4">
    //         <Label className="text-lg font-semibold">Service Items</Label>

    //         {/* Add New Item */}
    //         <div className="grid grid-cols-12 gap-2 items-end">
    //           <div className="col-span-5">
    //             <Label htmlFor="description">Description</Label>
    //             <Input
    //               id="description"
    //               value={newItem.description}
    //               onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
    //               className="bg-slate-700 border-slate-600"
    //               placeholder="Service description"
    //             />
    //           </div>
    //           <div className="col-span-2">
    //             <Label htmlFor="quantity">Qty</Label>
    //             <Input
    //               id="quantity"
    //               type="number"
    //               value={newItem.quantity}
    //               onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
    //               className="bg-slate-700 border-slate-600"
    //               min="1"
    //             />
    //           </div>
    //           <div className="col-span-2">
    //             <Label htmlFor="rate">Rate ($)</Label>
    //             <Input
    //               id="rate"
    //               type="number"
    //               value={newItem.rate}
    //               onChange={(e) => setNewItem({ ...newItem, rate: Number.parseFloat(e.target.value) || 0 })}
    //               className="bg-slate-700 border-slate-600"
    //               step="0.01"
    //             />
    //           </div>
    //           <div className="col-span-2">
    //             <Label>Amount</Label>
    //             <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm">
    //               ${(newItem.quantity * newItem.rate).toFixed(2)}
    //             </div>
    //           </div>
    //           <div className="col-span-1">
    //             <Button type="button" onClick={addItem} size="sm">
    //               <Plus className="h-4 w-4" />
    //             </Button>
    //           </div>
    //         </div>

    //         {/* Items List */}
    //         <div className="space-y-2">
    //           {formData.items.map((item, index) => (
    //             <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-700/50 p-2 rounded">
    //               <div className="col-span-5">{item.description}</div>
    //               <div className="col-span-2 text-center">{item.quantity}</div>
    //               <div className="col-span-2 text-center">${item.rate.toFixed(2)}</div>
    //               <div className="col-span-2 text-center">${item.amount.toFixed(2)}</div>
    //               <div className="col-span-1">
    //                 <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
    //                   <X className="h-4 w-4" />
    //                 </Button>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Totals */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         <div className="space-y-4">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             <div className="space-y-2">
    //               <Label htmlFor="status">Status</Label>
    //               <Select
    //                 value={formData.status}
    //                 onValueChange={(value) => setFormData({ ...formData, status: value })}
    //               >
    //                 <SelectTrigger className="bg-slate-700 border-slate-600">
    //                   <SelectValue placeholder="Select status" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="Pending">Pending</SelectItem>
    //                   <SelectItem value="Paid">Paid</SelectItem>
    //                   <SelectItem value="Overdue">Overdue</SelectItem>
    //                   <SelectItem value="Cancelled">Cancelled</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //             <div className="space-y-2">
    //               <Label htmlFor="paymentMethod">Payment Method</Label>
    //               <Select
    //                 value={formData.paymentMethod}
    //                 onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
    //               >
    //                 <SelectTrigger className="bg-slate-700 border-slate-600">
    //                   <SelectValue placeholder="Select method" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="Cash">Cash</SelectItem>
    //                   <SelectItem value="Credit Card">Credit Card</SelectItem>
    //                   <SelectItem value="Debit Card">Debit Card</SelectItem>
    //                   <SelectItem value="Insurance">Insurance</SelectItem>
    //                   <SelectItem value="Check">Check</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>
    //           </div>
    //           <div className="space-y-2">
    //             <Label htmlFor="insuranceClaim">Insurance Claim</Label>
    //             <Select
    //               value={formData.insuranceClaim}
    //               onValueChange={(value) => setFormData({ ...formData, insuranceClaim: value })}
    //             >
    //               <SelectTrigger className="bg-slate-700 border-slate-600">
    //                 <SelectValue placeholder="Select status" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="Not Submitted">Not Submitted</SelectItem>
    //                 <SelectItem value="Submitted">Submitted</SelectItem>
    //                 <SelectItem value="Processing">Processing</SelectItem>
    //                 <SelectItem value="Approved">Approved</SelectItem>
    //                 <SelectItem value="Denied">Denied</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //         </div>

    //         <div className="space-y-4">
    //           <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
    //             <div className="flex justify-between">
    //               <span>Subtotal:</span>
    //               <span>${formData.subtotal.toFixed(2)}</span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span>Tax (8%):</span>
    //               <span>${formData.tax.toFixed(2)}</span>
    //             </div>
    //             <div className="flex justify-between">
    //               <span>Discount:</span>
    //               <Input
    //                 type="number"
    //                 value={formData.discount}
    //                 onChange={(e) => {
    //                   const discount = Number.parseFloat(e.target.value) || 0
    //                   setFormData({ ...formData, discount })
    //                 }}
    //                 className="w-20 h-6 text-right bg-slate-600 border-slate-500"
    //                 step="0.01"
    //               />
    //             </div>
    //             <hr className="border-slate-600" />
    //             <div className="flex justify-between font-bold text-lg">
    //               <span>Total:</span>
    //               <span>${(formData.subtotal + formData.tax - formData.discount).toFixed(2)}</span>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Notes */}
    //       <div className="space-y-2">
    //         <Label htmlFor="notes">Notes</Label>
    //         <Textarea
    //           id="notes"
    //           value={formData.notes}
    //           onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
    //           className="bg-slate-700 border-slate-600"
    //           placeholder="Additional notes or payment terms"
    //         />
    //       </div>

    //       <div className="flex justify-end space-x-2">
    //         <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
    //           Cancel
    //         </Button>
    //         <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
    //           {invoice ? "Update Invoice" : "Create Invoice"}
    //         </Button>
    //       </div>
    //     </form>
    //   </DialogContent>
    // </Dialog>
  )
}
