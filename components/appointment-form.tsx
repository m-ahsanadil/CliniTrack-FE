// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { AppointmentRequest } from "@/src/modules/Dashboard/appointments/api/types"

// interface AppointmentFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   appointment?: any
//   onSave: (appointment: any) => void
//   patients: any[]
// }

// export default function AppointmentForm({ open, onOpenChange, appointment, onSave, patients }: AppointmentFormProps) {
//   const [formData, setFormData] = useState<AppointmentRequest>({
//     appointmentNumber: appointment?.appointmentNumber || "APP-" + Date.now(),
//     patientId: appointment?.patientId || "",
//     providerId: appointment?.providerId || "",
//     departmentName: appointment?.departmentName || "",
//     appointmentDate: appointment?.appointmentDate || "",
//     startTime: appointment?.startTime || "",
//     endTime: appointment?.endTime || "",
//     duration: appointment?.duration?.toString() || "30",
//     timeZone: appointment?.timeZone || "Asia/Riyadh",
//     type: appointment?.type || "",
//     priority: appointment?.priority || "Medium",
//     status: appointment?.status || "Scheduled",
//     location: {
//       facilityId: appointment?.location?.facilityId || "FAC-001",
//       facilityName: appointment?.location?.facilityName || "",
//       roomNumber: appointment?.location?.roomNumber || "",
//       address: appointment?.location?.address || "",
//     },
//     reasonForVisit: appointment?.reasonForVisit || "",
//     symptoms: appointment?.symptoms?.join(", ") || "",
//     notes: appointment?.notes || "",
//     createdBy: "clinicadmin",
//     updatedBy: "clinicadmin",
//   });


//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//     appointment?.date ? new Date(appointment.date) : undefined,
//   )

//   const calculateEndTime = (startTime: string, duration: string) => {
//     const [time, modifier] = startTime.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);
//     if (modifier === "PM" && hours < 12) hours += 12;
//     const totalMinutes = hours * 60 + minutes + parseInt(duration);
//     const endHours = Math.floor(totalMinutes / 60) % 24;
//     const endMinutes = totalMinutes % 60;
//     const endModifier = endHours >= 12 ? "PM" : "AM";
//     const formattedHours = ((endHours + 11) % 12 + 1).toString().padStart(2, "0");
//     const formattedMinutes = endMinutes.toString().padStart(2, "0");
//     return `${formattedHours}:${formattedMinutes} ${endModifier}`;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
//     onSave({
//       appointmentNumber: formData.appointmentNumber,
//       patientId: formData.patientId,
//       providerId: formData.providerId,
//       departmentName: formData.departmentName,
//       appointmentDate: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : formData.appointmentDate,
//       startTime: formData.startTime, // rename `time` to `startTime` in formData for clarity
//       endTime: calculateEndTime(formData.startTime, formData.duration.toString()),
//       duration: parseInt(formData.duration.toString()),
//       timeZone: formData.timeZone,
//       type: formData.type,
//       priority: formData.priority,
//       status: formData.status,
//       location: formData.location,
//       reasonForVisit: formData.reasonForVisit,
//       symptoms: formData.symptoms.map((s: string) => s.trim()),
//       notes: formData.notes,
//       createdBy: "clinicadmin",
//       updatedBy: "clinicadmin",
//     });
//     onOpenChange(false)
//   }

//   const timeSlots = [
//     "08:00 AM",
//     "08:30 AM",
//     "09:00 AM",
//     "09:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "12:00 PM",
//     "12:30 PM",
//     "01:00 PM",
//     "01:30 PM",
//     "02:00 PM",
//     "02:30 PM",
//     "03:00 PM",
//     "03:30 PM",
//     "04:00 PM",
//     "04:30 PM",
//     "05:00 PM",
//     "05:30 PM",
//   ]

//   const doctors = [
//     "Dr. Smith",
//     "Dr. Johnson",
//     "Dr. Brown",
//     "Dr. Wilson",
//     "Dr. Davis",
//     "Dr. Miller",
//     "Dr. Garcia",
//     "Dr. Rodriguez",
//     "Dr. Martinez",
//   ]

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
//         <DialogHeader>
//           <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6">

//           {/* Appointment Number (Read-only if auto-generated) */}
//           <div className="space-y-2">
//             <Label htmlFor="appointmentNumber">Appointment Number</Label>
//             <input
//               type="text"
//               id="appointmentNumber"
//               value={formData.appointmentNumber}
//               disabled
//               className="bg-slate-700 border-slate-600 w-full rounded px-3 py-2"
//             />
//           </div>

//           {/* Patient Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="patient">Patient *</Label>
//             <Select
//               value={formData.patientId}
//               onValueChange={(value) => setFormData({ ...formData, patientId: value })}
//             >
//               <SelectTrigger className="bg-slate-700 border-slate-600">
//                 <SelectValue placeholder="Select patient" />
//               </SelectTrigger>
//               <SelectContent>
//                 {patients.map((patient) => (
//                   <SelectItem key={patient.id} value={patient.id.toString()}>
//                     {patient.name} - {patient.phone}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Date and Time */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Appointment Date *</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
//                   <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
//                 </PopoverContent>
//               </Popover>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="time">Time *</Label>
//               <Select value={formData.startTime} onValueChange={(value) => setFormData({ ...formData, time: value })}>
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select time" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {timeSlots.map((time) => (
//                     <SelectItem key={time} value={time}>
//                       {time}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="departmentName">Department *</Label>
//             <Select
//               value={formData.departmentName}
//               onValueChange={(value) => setFormData({ ...formData, departmentName: value })}
//             >
//               <SelectTrigger className="bg-slate-700 border-slate-600">
//                 <SelectValue placeholder="Select department" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="General Medicine">General Medicine</SelectItem>
//                 <SelectItem value="Pediatrics">Pediatrics</SelectItem>
//                 <SelectItem value="Cardiology">Cardiology</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>


//           {/* Doctor and Type */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="providerId">Doctor *</Label>
//               <Select
//                 value={formData.providerId}
//                 onValueChange={(value) => setFormData({ ...formData, providerId: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select doctor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {/* {providers.map((provider) => (
//                     <SelectItem key={provider._id} value={provider._id}>
//                       {provider.name}
//                     </SelectItem>
//                   ))} */}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="type">Appointment Type *</Label>
//               <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Consultation">Consultation</SelectItem>
//                   <SelectItem value="Follow-up">Follow-up</SelectItem>
//                   <SelectItem value="Check-up">Check-up</SelectItem>
//                   <SelectItem value="Treatment">Treatment</SelectItem>
//                   <SelectItem value="Emergency">Emergency</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="facilityName">Facility Name</Label>
//               <input
//                 type="text"
//                 value={formData.location.facilityName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, location: { ...formData.location, facilityName: e.target.value } })
//                 }
//                 className="bg-slate-700 border-slate-600 w-full rounded px-3 py-2"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="roomNumber">Room Number</Label>
//               <input
//                 type="text"
//                 value={formData.location.roomNumber}
//                 onChange={(e) =>
//                   setFormData({ ...formData, location: { ...formData.location, roomNumber: e.target.value } })
//                 }
//                 className="bg-slate-700 border-slate-600 w-full rounded px-3 py-2"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="address">Address</Label>
//               <input
//                 type="text"
//                 value={formData.location.address}
//                 onChange={(e) =>
//                   setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })
//                 }
//                 className="bg-slate-700 border-slate-600 w-full rounded px-3 py-2"
//               />
//             </div>
//           </div>


//           <div className="space-y-2">
//             <Label htmlFor="reasonForVisit">Reason for Visit</Label>
//             <Textarea
//               value={formData.reasonForVisit}
//               onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
//               className="bg-slate-700 border-slate-600"
//               placeholder="Why is the patient coming in?"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="symptoms">Symptoms (comma separated)</Label>
//             <input
//               type="text"
//               value={formData.symptoms}
//               onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
//               className="bg-slate-700 border-slate-600 w-full rounded px-3 py-2"
//             />
//           </div>


//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="priority">Priority *</Label>
//               <Select
//                 value={formData.priority}
//                 onValueChange={(value) => setFormData({ ...formData, priority: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="High">High</SelectItem>
//                   <SelectItem value="Medium">Medium</SelectItem>
//                   <SelectItem value="Low">Low</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="timeZone">Time Zone *</Label>
//               <Select
//                 value={formData.timeZone}
//                 onValueChange={(value) => setFormData({ ...formData, timeZone: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select time zone" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Asia/Riyadh">Asia/Riyadh</SelectItem>
//                   <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
//                   <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>


//           {/* Duration and Status */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="duration">Duration</Label>
//               <Select
//                 value={formData.duration}
//                 onValueChange={(value) => setFormData({ ...formData, duration: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select duration" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="15 minutes">15 minutes</SelectItem>
//                   <SelectItem value="30 minutes">30 minutes</SelectItem>
//                   <SelectItem value="45 minutes">45 minutes</SelectItem>
//                   <SelectItem value="60 minutes">60 minutes</SelectItem>
//                   <SelectItem value="90 minutes">90 minutes</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Scheduled">Scheduled</SelectItem>
//                   <SelectItem value="Confirmed">Confirmed</SelectItem>
//                   <SelectItem value="Pending">Pending</SelectItem>
//                   <SelectItem value="Cancelled">Cancelled</SelectItem>
//                   <SelectItem value="Completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               className="bg-slate-700 border-slate-600"
//               placeholder="Additional notes or special instructions"
//             />
//           </div>

//           <div className="flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//               {appointment ? "Update Appointment" : "Schedule Appointment"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"

export interface AppointmentRequest {
  appointmentNumber: string
  patientId: string
  providerId: string
  departmentName: string
  appointmentDate: string
  startTime: string
  endTime: string
  duration: number
  timeZone: string
  type: string
  priority: string
  status: string
  location: AppointmentLocation
  reasonForVisit: string
  symptoms: string[]
  notes: string
  createdBy: string
  updatedBy: string
}

interface AppointmentLocation {
  building?: string
  floor?: string
  room?: string
  address?: string
}

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment?: AppointmentRequest
  onSave: (appointment: AppointmentRequest) => void
  patients: any[]
  providers: any[]
  currentUserId: string // For createdBy/updatedBy
}

export default function AppointmentForm({
  open,
  onOpenChange,
  appointment,
  onSave,
  patients,
  providers,
  currentUserId
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<AppointmentRequest>({
    appointmentNumber: appointment?.appointmentNumber || "",
    patientId: appointment?.patientId || "",
    providerId: appointment?.providerId || "",
    departmentName: appointment?.departmentName || "",
    appointmentDate: appointment?.appointmentDate || "",
    startTime: appointment?.startTime || "",
    endTime: appointment?.endTime || "",
    duration: appointment?.duration || 30,
    timeZone: appointment?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    type: appointment?.type || "",
    priority: appointment?.priority || "Medium",
    status: appointment?.status || "Scheduled",
    location: appointment?.location || {
      building: "",
      floor: "",
      room: "",
      address: ""
    },
    reasonForVisit: appointment?.reasonForVisit || "",
    symptoms: appointment?.symptoms || [],
    notes: appointment?.notes || "",
    createdBy: appointment?.createdBy || currentUserId,
    updatedBy: currentUserId,
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    appointment?.appointmentDate ? new Date(appointment.appointmentDate) : undefined,
  )

  const [symptomInput, setSymptomInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Calculate end time based on start time and duration
    const endTime = calculateEndTime(formData.startTime, formData.duration)

    const submitData: AppointmentRequest = {
      ...formData,
      appointmentDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.appointmentDate,
      endTime,
      appointmentNumber: formData.appointmentNumber || `APT-${Date.now()}`,
    }

    onSave(submitData)
    onOpenChange(false)
  }

  const calculateEndTime = (startTime: string, duration: number): string => {
    if (!startTime) return ""

    const [time, period] = startTime.split(" ")
    const [hours, minutes] = time.split(":").map(Number)

    let totalMinutes = (period === "PM" && hours !== 12 ? hours + 12 : hours === 12 && period === "AM" ? 0 : hours) * 60 + minutes
    totalMinutes += duration

    const endHours = Math.floor(totalMinutes / 60) % 24
    const endMins = totalMinutes % 60
    const endPeriod = endHours >= 12 ? "PM" : "AM"
    const displayHours = endHours === 0 ? 12 : endHours > 12 ? endHours - 12 : endHours

    return `${displayHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")} ${endPeriod}`
  }

  const addSymptom = () => {
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptomInput.trim()]
      })
      setSymptomInput("")
    }
  }

  const removeSymptom = (index: number) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((_, i) => i !== index)
    })
  }

  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM",
  ]

  const departments = [
    "Cardiology", "Dermatology", "Emergency", "General Medicine", "Neurology",
    "Orthopedics", "Pediatrics", "Psychiatry", "Surgery", "Urology"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{appointment ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appointment Number */}
          <div className="space-y-2">
            <Label htmlFor="appointmentNumber">Appointment Number</Label>
            <Input
              id="appointmentNumber"
              value={formData.appointmentNumber}
              onChange={(e) => setFormData({ ...formData, appointmentNumber: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Auto-generated if empty"
            />
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
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name} - {patient.phone}
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
                  {/* {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id.toString()}>
                      {provider.name} - {provider.specialty}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consultation">Consultation</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Check-up">Check-up</SelectItem>
                  <SelectItem value="Treatment">Treatment</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
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
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select
                value={formData.duration.toString()}
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
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
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

          {/* Location */}
          <div className="space-y-4">
            <Label>Location</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Building"
                value={formData.location.building || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, building: e.target.value }
                })}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                placeholder="Floor"
                value={formData.location.floor || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, floor: e.target.value }
                })}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                placeholder="Room"
                value={formData.location.room || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, room: e.target.value }
                })}
                className="bg-slate-700 border-slate-600"
              />
              <Input
                placeholder="Address"
                value={formData.location.address || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location, address: e.target.value }
                })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              value={formData.reasonForVisit}
              onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Brief description of the visit purpose"
            />
          </div>

          {/* Symptoms */}
          <div className="space-y-2">
            <Label>Symptoms</Label>
            <div className="flex gap-2">
              <Input
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
                className="bg-slate-700 border-slate-600"
                placeholder="Add symptom"
              />
              <Button type="button" onClick={addSymptom} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.symptoms.map((symptom, index) => (
                <div key={index} className="bg-slate-600 px-2 py-1 rounded flex items-center gap-1">
                  <span className="text-sm">{symptom}</span>
                  <button
                    type="button"
                    onClick={() => removeSymptom(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
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

          {/* Time Zone (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="timezone">Time Zone</Label>
            <Input
              id="timezone"
              value={formData.timeZone}
              readOnly
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {appointment ? "Update Appointment" : "Schedule Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

