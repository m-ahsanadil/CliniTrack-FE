"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, FileText } from "lucide-react"
import { AppointmentTypeValues } from "@/src/enum"

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: any
  mode: 'create' | 'edit'
  onSave: (appointment: any) => void
  patients?: any[]
}

export default function AppointmentForm({ open, onOpenChange, appointment, onSave, patients, mode }: AppointmentFormProps) {

  console.log(appointment)
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    date: "",
    time: "",
    doctor: "",
    type: "",
    duration: "30 minutes",
    status: "Scheduled",
    notes: "",
    reminderSent: false,
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && appointment) {
      // Edit mode: populate with existing appointment data
      setFormData({
        patientId: appointment.appointmentNumber || "",
        patientName: appointment.patientName || "",
        date: appointment.date || "",
        time: appointment.time || "",
        doctor: appointment.doctor || "",
        type: appointment.type || "",
        duration: appointment.duration || "30 minutes",
        status: appointment.status || "Scheduled",
        notes: appointment.notes || "",
        reminderSent: appointment.reminderSent || false,
      })
      setSelectedDate(appointment.date ? new Date(appointment.date) : undefined)
    } else if (mode === 'create') {
      // Create mode: reset to default values
      setFormData({
        patientId: "",
        patientName: "",
        date: "",
        time: "",
        doctor: "",
        type: "",
        duration: "30 minutes",
        status: "Scheduled",
        notes: "",
        reminderSent: false,
      })
      setSelectedDate(undefined)
    }
  }, [mode, appointment, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.patientId || !selectedDate || !formData.time || !formData.doctor || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    const selectedPatient = patients?.find((p) => p.id.toString() === formData.patientId)

    const appointmentData = {
      ...formData,
      patientName: selectedPatient?.name || formData.patientName,
      date: format(selectedDate, "yyyy-MM-dd"),
      id: mode === 'edit' ? appointment?.id : Date.now(),
    }

    onSave(appointmentData)
    onOpenChange(false)
  }
  const handleReset = () => {
    if (mode === 'create') {
      setFormData({
        patientId: "",
        patientName: "",
        date: "",
        time: "",
        doctor: "",
        type: "",
        duration: "30 minutes",
        status: "Scheduled",
        notes: "",
        reminderSent: false,
      })
      setSelectedDate(undefined)
    }
  }

  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM",
  ]

  const doctors = [
    "Dr. Smith", "Dr. Johnson", "Dr. Brown", "Dr. Wilson", "Dr. Davis",
    "Dr. Miller", "Dr. Garcia", "Dr. Rodriguez", "Dr. Martinez",
  ]

  const appointmentTypes = [
    "Consultation", "Follow-up", "Check-up", "Treatment", "Emergency"
  ]

  const durations = [
    "15 minutes", "30 minutes", "45 minutes", "60 minutes", "90 minutes"
  ]

  const statuses = [
    "Scheduled", "Confirmed", "Pending", "Cancelled", "Completed"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <FileText className="h-6 w-6" />
                Schedule New Appointment
              </>
            ) : (
              <>
                <FileText className="h-6 w-6" />
                Edit Appointment
              </>
            )}</DialogTitle>
          <p className="text-slate-400">
            {mode === 'create'
              ? "Fill in the details to create a new appointment"
              : "Update the appointment information below"
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
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
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id.toString()}>
                    {patient.name} - {patient.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Appointment Date *</Label>
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
              <Label htmlFor="time">Time *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Doctor and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mode === 'create' ? (
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {AppointmentTypeValues.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutes">15 minutes</SelectItem>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="45 minutes">45 minutes</SelectItem>
                  <SelectItem value="60 minutes">60 minutes</SelectItem>
                  <SelectItem value="90 minutes">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
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
              placeholder="Additional notes or special instructions"
            />
          </div>
          <div className="flex justify-between">
            <div>
              {mode === 'create' && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Reset Form
                </Button>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSubmit}
              >
                {mode === 'create' ? "Schedule Appointment" : "Update Appointment"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}