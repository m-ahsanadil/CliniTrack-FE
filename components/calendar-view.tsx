"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { format, isSameDay } from "date-fns"
import { Plus } from "lucide-react"

interface CalendarViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointments: any[]
  onAddAppointment: () => void
  onEditAppointment: (appointment: any) => void
}

export default function CalendarView({
  open,
  onOpenChange,
  appointments,
  onAddAppointment,
  onEditAppointment,
}: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((apt) => isSameDay(new Date(apt.date), date))
  }

  const getDayAppointments = (date: Date) => {
    const dayAppointments = getAppointmentsForDate(date)
    return dayAppointments.sort((a, b) => a.time.localeCompare(b.time))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Appointment Calendar</DialogTitle>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className="rounded-none"
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("week")}
                  className="rounded-none"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === "day" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("day")}
                  className="rounded-none"
                >
                  Day
                </Button>
              </div>
              <Button onClick={onAddAppointment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Appointment
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border border-slate-700"
              components={{
                Day: ({ date, ...props }) => {
                  const dayAppointments = getAppointmentsForDate(date)
                  return (
                    <div className="relative">
                      <button {...props} className="w-full h-full">
                        {format(date, "d")}
                        {dayAppointments.length > 0 && (
                          <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  )
                },
              }}
            />
          </div>

          {/* Appointments for Selected Date */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{format(selectedDate, "EEEE, MMMM d")}</h3>
              <Badge variant="secondary">{getDayAppointments(selectedDate).length} appointments</Badge>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getDayAppointments(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No appointments scheduled</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={onAddAppointment}>
                    Schedule Appointment
                  </Button>
                </div>
              ) : (
                getDayAppointments(selectedDate).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700"
                    onClick={() => onEditAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{appointment.time}</span>
                      <Badge
                        variant={
                          appointment.status === "Confirmed"
                            ? "default"
                            : appointment.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-slate-400">{appointment.type}</p>
                    <p className="text-sm text-slate-400">{appointment.doctor}</p>
                    {appointment.notes && <p className="text-xs text-slate-500 mt-1">{appointment.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
