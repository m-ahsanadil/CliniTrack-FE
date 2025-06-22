// components/appointments/ViewAppointmentDialog.tsx
"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Appointment } from "../api/types"

type Props = {
    appointment: Appointment | null
    isOpen: boolean
    onClose: () => void
}

export const ViewAppointmentDialog = ({ appointment, isOpen, onClose }: Props) => {
    if (!appointment) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">Appointment Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div><strong>Appointment #:</strong> {appointment.appointmentNumber}</div>
                    <div><strong>Status:</strong> {appointment.status}</div>
                    <div><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</div>
                    <div><strong>Duration:</strong> {appointment.duration} minutes</div>
                    <div><strong>Time Zone:</strong> {appointment.timeZone}</div>

                    <div><strong>Patient Name:</strong> {appointment.patientId?.fullName}</div>
                    <div><strong>Provider Name:</strong> {appointment.providerId?.name}</div>
                    <div><strong>Department:</strong> {appointment.departmentName}</div>
                    <div><strong>Type:</strong> {appointment.type}</div>
                    <div><strong>Priority:</strong> {appointment.priority}</div>

                    <div><strong>Reason:</strong> {appointment.reasonForVisit}</div>
                    <div><strong>Symptoms:</strong> {appointment.symptoms?.length ? appointment.symptoms.join(", ") : "N/A"}</div>
                    <div><strong>Notes:</strong> {appointment.notes || "N/A"}</div>

                    <div className="col-span-2 mt-2"><strong>Location Details:</strong></div>
                    <div><strong>Facility:</strong> {appointment.location?.facilityName}</div>
                    <div><strong>Room #:</strong> {appointment.location?.roomNumber}</div>
                    <div className="col-span-2"><strong>Address:</strong> {appointment.location?.address}</div>

                    <div><strong>Created By:</strong> {appointment.createdBy}</div>
                    <div><strong>Updated By:</strong> {appointment.updatedBy}</div>
                    <div><strong>Created At:</strong> {new Date(appointment.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(appointment.updatedAt).toLocaleString()}</div>
                </div>
            </DialogContent>
        </Dialog>

    )
}