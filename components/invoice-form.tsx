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

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: any
  onSave: (invoice: any) => void
  patients: any[]
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface FormData {
  patientId: string;
  patientName: string;
  date: string;
  dueDate: string;
  service: string;
  amount: string;
  status: string;
  paymentMethod: string;
  insuranceClaim: string;
  notes: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
}


export default function InvoiceForm({ open, onOpenChange, invoice, onSave, patients }: InvoiceFormProps) {
  const [formData, setFormData] = useState<FormData>({
    patientId: invoice?.patientId || "",
    patientName: invoice?.patientName || "",
    date: invoice?.date || "",
    dueDate: invoice?.dueDate || "",
    service: invoice?.service || "",
    amount: invoice?.amount || "",
    status: invoice?.status || "Pending",
    paymentMethod: invoice?.paymentMethod || "",
    insuranceClaim: invoice?.insuranceClaim || "Not Submitted",
    notes: invoice?.notes || "",
    // items: invoice?.items || [],
    items: invoice?.items?.map((item: Partial<InvoiceItem>) => ({
      description: item.description || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      amount: item.amount || 0,
    })) || [],
    subtotal: invoice?.subtotal || 0,
    tax: invoice?.tax || 0,
    discount: invoice?.discount || 0,
    total: invoice?.total || 0,
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    invoice?.date ? new Date(invoice.date) : new Date(),
  )

  const [dueDate, setDueDate] = useState<Date | undefined>(invoice?.dueDate ? new Date(invoice.dueDate) : undefined)

  const [newItem, setNewItem] = useState({
    description: "",
    quantity: 1,
    rate: 0,
    amount: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
    onSave({
      ...formData,
      patientName: selectedPatient?.name || formData.patientName,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.date,
      dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : "",
      id: invoice?.id || Date.now(),
    })
    onOpenChange(false)
  }

  const addItem = () => {
    if (newItem.description.trim()) {
      const amount = newItem.quantity * newItem.rate
      const item = { ...newItem, amount }
      setFormData({
        ...formData,
        items: [...formData.items, item],
      })
      setNewItem({ description: "", quantity: 1, rate: 0, amount: 0 })
      calculateTotals([...formData.items, item])
    }
  }

  const removeItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
    calculateTotals(newItems)
  }

  const calculateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + tax - formData.discount
    setFormData((prev) => ({ ...prev, subtotal, tax, total }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Invoice Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Service Items */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Service Items</Label>

            {/* Add New Item */}
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Service description"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="quantity">Qty</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                  className="bg-slate-700 border-slate-600"
                  min="1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="rate">Rate ($)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={newItem.rate}
                  onChange={(e) => setNewItem({ ...newItem, rate: Number.parseFloat(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600"
                  step="0.01"
                />
              </div>
              <div className="col-span-2">
                <Label>Amount</Label>
                <div className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm">
                  ${(newItem.quantity * newItem.rate).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-700/50 p-2 rounded">
                  <div className="col-span-5">{item.description}</div>
                  <div className="col-span-2 text-center">{item.quantity}</div>
                  <div className="col-span-2 text-center">${item.rate.toFixed(2)}</div>
                  <div className="col-span-2 text-center">${item.amount.toFixed(2)}</div>
                  <div className="col-span-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
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
                  <span>Total:</span>
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
  )
}
