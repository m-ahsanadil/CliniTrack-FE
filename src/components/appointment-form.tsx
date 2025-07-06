"use client"

import type React from "react"

import { FormEvent, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, FileText } from "lucide-react"
import { AppointmentPriorityValues, AppointmentStatusValues, AppointmentTypeValues, DepartmentNameValues } from "@/src/enum"
import { Input } from "@/components/ui/input"
import { AppointmentRequest } from "../modules/Dashboard/appointments/api/types"
import { ProviderBasicInfo } from "../modules/Dashboard/Provider/api/types"
import { PatientBasicInfo } from "../modules/Dashboard/patients/api/types"
import { useAppDispatch } from "../redux/store/reduxHook"
// import { fetchPatientBasicInfo } from "../modules/Dashboard/patients/api/slice"
// import { fetchProviderBasicInfo } from "../modules/Dashboard/Provider/api/slice"
import { updateAppointment } from "../modules/Dashboard/appointments/api/slice"

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: any
  mode: 'create' | 'edit'
  onSave: (appointment: any) => void
  patients?: any
  providers?: any
}

export default function AppointmentForm({ open, onOpenChange, appointment, onSave, patients, providers, mode }: AppointmentFormProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    {
      // open &&
      //   dispatch(fetchPatientBasicInfo())
      // dispatch(fetchProviderBasicInfo())
    }
  }, [open, dispatch]);

  const [formData, setFormData] = useState<AppointmentRequest>({
    appointmentNumber: "",
    patientId: "",
    providerId: "",
    departmentName: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    duration: 30,
    timeZone: "Asia/Riyadh",
    type: "",
    priority: "Medium",
    status: "Scheduled",
    location: {
      facilityId: "",
      facilityName: "",
      roomNumber: "",
      address: ""
    },
    reasonForVisit: "",
    symptoms: [],
    notes: "",
    createdBy: "",
    updatedBy: "",
  })

  console.log(formData);


  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && appointment) {
      // Edit mode: populate with existing appointment data
      setFormData({
        appointmentNumber: appointment.appointmentNumber || "",
        patientId: appointment.patientId || "",
        providerId: appointment.providerId || "",
        departmentName: appointment.departmentName || "",
        appointmentDate: appointment.appointmentDate || "",
        startTime: appointment.startTime || "",
        endTime: appointment.endTime || "",
        duration: appointment.duration || 30,
        timeZone: appointment.timeZone || "Asia/Riyadh",
        type: appointment.type || "",
        priority: appointment.priority || "Medium",
        status: appointment.status || "Scheduled",
        location: {
          facilityId: appointment.location?.facilityId || "",
          facilityName: appointment.location?.facilityName || "",
          roomNumber: appointment.location?.roomNumber || "",
          address: appointment.location?.address || ""
        },
        reasonForVisit: appointment.reasonForVisit || "",
        symptoms: appointment.symptoms || [],
        notes: appointment.notes || "",
        createdBy: appointment.createdBy || "",
        updatedBy: appointment.updatedBy || "",
        // reminderSent: appointment.reminderSent || false,
      })
      setSelectedDate(appointment.appointmentDate ? new Date(appointment.appointmentDate) : undefined)
    } else if (mode === 'create') {
      // Create mode: reset to default values
      const defaultFormData = {
        appointmentNumber: "", // Will be auto-generated
        patientId: "",
        providerId: "",
        departmentName: "",
        appointmentDate: "",
        startTime: "",
        endTime: "",
        duration: 30,
        timeZone: "Asia/Riyadh",
        type: "",
        priority: "Medium",
        status: "Scheduled",
        location: {
          facilityId: "",
          facilityName: "",
          roomNumber: "",
          address: ""
        },
        reasonForVisit: "",
        symptoms: [],
        notes: "",
        createdBy: "system", // Assuming you have current user context
        updatedBy: "system",
      }
      setFormData(defaultFormData)
      setSelectedDate(undefined)
    }
  }, [mode, appointment, open])

  // Helper function to calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    if (!startTime) return ""

    // Parse start time (assuming format like "10:00 AM")
    const [time, period] = startTime.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    // Convert to 24-hour format
    let hour24 = hours
    if (period === 'PM' && hours !== 12) hour24 += 12
    if (period === 'AM' && hours === 12) hour24 = 0

    // Add duration
    const startDate = new Date()
    startDate.setHours(hour24, minutes, 0, 0)
    startDate.setMinutes(startDate.getMinutes() + durationMinutes)

    // Convert back to 12-hour format
    const endHour = startDate.getHours()
    const endMinute = startDate.getMinutes()
    const endPeriod = endHour >= 12 ? 'PM' : 'AM'
    const displayHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour

    return `${displayHour}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`
  }

  // Update end time when start time or duration changes
  useEffect(() => {
    if (formData.startTime && formData.duration) {
      const calculatedEndTime = calculateEndTime(formData.startTime, formData.duration)
      setFormData(prev => ({ ...prev, endTime: calculatedEndTime }))
    }
  }, [formData.startTime, formData.duration])

  // Update appointment date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        appointmentDate: selectedDate.toISOString()
      }))
    }
  }, [selectedDate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Enhanced validation for required fields
    const requiredFields = [
      { field: formData.patientId, name: 'Patient' },
      { field: formData.providerId, name: 'Provider/Doctor' },
      { field: formData.departmentName, name: 'Department' },
      { field: selectedDate, name: 'Appointment Date' },
      { field: formData.startTime, name: 'Start Time' },
      { field: formData.endTime, name: 'End Time' },
      { field: formData.type, name: 'Appointment Type' },
      { field: formData.priority, name: 'Priority' },
      { field: formData.location.facilityName, name: 'Facility Name' },
      { field: formData.reasonForVisit, name: 'Reason for Visit' }
    ]

    const missingFields = requiredFields.filter(({ field }) => !field)

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ name }) => name).join(', ')
      alert(`Please fill in all required fields: ${fieldNames}`)
      return
    }

    // Get selected patient and provider info for additional data
    const selectedPatient = patients?.find((p: PatientBasicInfo) => p._id.toString() === formData.patientId)
    const selectedProvider = providers?.find((p: ProviderBasicInfo) => p._id.toString() === formData.providerId)

    const appointmentData = {
      ...formData,
      appointmentNumber: mode === 'edit' ? formData.appointmentNumber : `AP-${Date.now().toString().slice(-8)}`, // Generate appointment number for new appointments
      appointmentDate: selectedDate ? selectedDate.toISOString() : formData.appointmentDate,
      updatedBy: "system",
      // Add any computed fields
      patientName: selectedPatient?.name, // For display purposes
      providerName: selectedProvider?.name, // For display purposes
      id: mode === 'edit' ? appointment?._id : Date.now(),
    }

    try {
      if (mode === 'edit' && appointment?._id) {
        // Dispatch update appointment action
        const resultAction = await dispatch(updateAppointment({
          id: appointment._id,
          appointmentData: appointmentData
        }));

        // Check if the update was successful
        if (updateAppointment.fulfilled.match(resultAction)) {
          console.log('Appointment updated successfully:', resultAction.payload);
          onSave(resultAction.payload); // Pass the updated appointment to parent
        } else {
          console.error('Failed to update appointment:', resultAction.error);
          alert('Failed to update appointment. Please try again.');
          return;
        }
      } else if (mode === 'create') {
        // Dispatch create appointment action
        // const resultAction = await dispatch(createAppointment(appointmentData));

        // // Check if the creation was successful
        // if (createAppointment.fulfilled.match(resultAction)) {
        //   console.log('Appointment created successfully:', resultAction.payload);
        //   onSave(resultAction.payload); // Pass the new appointment to parent
        // } else {
        //   console.error('Failed to create appointment:', resultAction.error);
        //   alert('Failed to create appointment. Please try again.');
        //   return;
        // }
      }

      // Close the dialog only if the operation was successful
      onOpenChange(false)
    } catch (error) {
      console.error('Error processing appointment:', error);
      alert('An error occurred while processing the appointment. Please try again.');
    }
  }

  //   onSave(appointmentData)
  //   onOpenChange(false)
  // }

  const handleReset = () => {
    if (mode === 'create') {
      const defaultFormData = {
        appointmentNumber: "",
        patientId: "",
        providerId: "",
        departmentName: "",
        appointmentDate: "",
        startTime: "",
        endTime: "",
        duration: 30,
        timeZone: "Asia/Riyadh",
        type: "",
        priority: "Medium",
        status: "Scheduled",
        location: {
          facilityId: "",
          facilityName: "",
          roomNumber: "",
          address: ""
        },
        reasonForVisit: "",
        symptoms: [],
        notes: "",
        createdBy: "system",
        updatedBy: "system",
        reminderSent: false,
      }
      setFormData(defaultFormData)
      setSelectedDate(undefined)
    }
  }

  // Helper function to validate time format and logic
  const validateTimeSlots = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return true // Skip validation if times not set

    // Parse times and compare
    const parseTime = (timeStr: string) => {
      const [time, period] = timeStr.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      let hour24 = hours
      if (period === 'PM' && hours !== 12) hour24 += 12
      if (period === 'AM' && hours === 12) hour24 = 0
      return hour24 * 60 + minutes // Return total minutes
    }

    return parseTime(startTime) < parseTime(endTime)
  }

  // Additional validation effect
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      if (!validateTimeSlots(formData.startTime, formData.endTime)) {
        console.warn('End time should be after start time')
      }
    }
  }, [formData.startTime, formData.endTime])

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
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
            )}
          </DialogTitle>
          <p className="text-slate-400">
            {mode === 'create'
              ? "Fill in the details to create a new appointment"
              : "Update the appointment information below"
            }
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appointment Number (Auto-generated for create mode) */}
          {mode === 'edit' && (
            <div className="space-y-2">
              <Label htmlFor="appointmentNumber">Appointment Number</Label>
              <Input
                id="appointmentNumber"
                value={formData.appointmentNumber}
                readOnly
                className="bg-slate-600 border-slate-500 text-slate-300"
              />
            </div>
          )}

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
                  {patients?.map((patient: PatientBasicInfo) => (
                    <SelectItem key={patient._id} value={patient._id.toString()}>
                      {patient.fullName} - {patient.patientId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider/Doctor *</Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => setFormData({ ...formData, providerId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers?.map((provider: ProviderBasicInfo) => (
                    <SelectItem key={provider._id} value={provider._id.toString()}>
                      {provider.name} - {provider.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.departmentName}
              onValueChange={(value) => setFormData({ ...formData, departmentName: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DepartmentNameValues.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => setFormData({ ...formData, startTime: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select start time" />
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

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => setFormData({ ...formData, endTime: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select end time" />
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

          {/* Duration and Time Zone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select
                value={formData.duration?.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) => setFormData({ ...formData, timeZone: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Riyadh">Asia/Riyadh (GMT+3)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GMT+4)</SelectItem>
                  <SelectItem value="Asia/Kuwait">Asia/Kuwait (GMT+3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type, Priority, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
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

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {AppointmentPriorityValues.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  {AppointmentStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facilityId">Facility ID</Label>
                <Input
                  id="facilityId"
                  value={formData.location?.facilityId || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, facilityId: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., FAC-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facilityName">Facility Name *</Label>
                <Input
                  id="facilityName"
                  value={formData.location?.facilityName || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, facilityName: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., Main Clinic"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={formData.location?.roomNumber || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, roomNumber: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="e.g., A-101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.location?.address || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Full address"
                />
              </div>
            </div>
          </div>

          {/* Reason and Symptoms */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reasonForVisit">Reason for Visit *</Label>
              <Input
                id="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="e.g., Routine check-up"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="symptoms">Symptoms</Label>
              <Input
                id="symptoms"
                value={formData.symptoms?.join(', ') || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  symptoms: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                className="bg-slate-700 border-slate-600"
                placeholder="Enter symptoms separated by commas (e.g., Fatigue, Headache)"
              />
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
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
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