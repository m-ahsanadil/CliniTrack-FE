"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patients: any[]
  appointments: any[]
  invoices: any[]
}

export default function ReportsModal({ open, onOpenChange, patients, appointments, invoices }: ReportsModalProps) {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState("month")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [generatedReport, setGeneratedReport] = useState<any>(null)

  const generateReport = () => {
    let reportData: any = {}

    switch (reportType) {
      case "revenue":
        reportData = {
          title: "Revenue Report",
          data: {
            totalRevenue: invoices.reduce((sum, inv) => sum + inv.amount, 0),
            paidInvoices: invoices.filter((inv) => inv.status === "Paid").length,
            pendingInvoices: invoices.filter((inv) => inv.status === "Pending").length,
            overdueInvoices: invoices.filter((inv) => inv.status === "Overdue").length,
            averageInvoiceAmount:
              invoices.length > 0 ? invoices.reduce((sum, inv) => sum + inv.amount, 0) / invoices.length : 0,
            monthlyBreakdown: [
              { month: "Jan", revenue: 12500 },
              { month: "Feb", revenue: 15200 },
              { month: "Mar", revenue: 18900 },
              { month: "Apr", revenue: 16700 },
            ],
          },
        }
        break
      case "patients":
        reportData = {
          title: "Patient Report",
          data: {
            totalPatients: patients.length,
            activePatients: patients.filter((p) => p.status === "Active").length,
            newPatients: Math.floor(patients.length * 0.2),
            patientsByAge: {
              "0-18": Math.floor(patients.length * 0.15),
              "19-35": Math.floor(patients.length * 0.35),
              "36-55": Math.floor(patients.length * 0.3),
              "55+": Math.floor(patients.length * 0.2),
            },
            commonConditions: [
              { condition: "Hypertension", count: 15 },
              { condition: "Diabetes", count: 12 },
              { condition: "Asthma", count: 8 },
              { condition: "Arthritis", count: 6 },
            ],
          },
        }
        break
      case "appointments":
        reportData = {
          title: "Appointment Report",
          data: {
            totalAppointments: appointments.length,
            confirmedAppointments: appointments.filter((a) => a.status === "Confirmed").length,
            pendingAppointments: appointments.filter((a) => a.status === "Pending").length,
            cancelledAppointments: appointments.filter((a) => a.status === "Cancelled").length,
            appointmentsByType: {
              Consultation: appointments.filter((a) => a.type === "Consultation").length,
              "Follow-up": appointments.filter((a) => a.type === "Follow-up").length,
              "Check-up": appointments.filter((a) => a.type === "Check-up").length,
              Treatment: appointments.filter((a) => a.type === "Treatment").length,
            },
            doctorSchedule: [
              { doctor: "Dr. Smith", appointments: 25 },
              { doctor: "Dr. Johnson", appointments: 20 },
              { doctor: "Dr. Brown", appointments: 18 },
              { doctor: "Dr. Wilson", appointments: 15 },
            ],
          },
        }
        break
    }

    setGeneratedReport(reportData)
  }

  const exportReport = (format: string) => {
    // In a real app, this would generate and download the actual file
    alert(`Exporting ${generatedReport.title} as ${format.toUpperCase()}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>Generate Reports</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="patients">Patient Report</SelectItem>
                  <SelectItem value="appointments">Appointment Report</SelectItem>
                  <SelectItem value="medical">Medical Records Report</SelectItem>
                  <SelectItem value="insurance">Insurance Claims Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Button onClick={generateReport} disabled={!reportType} className="bg-blue-600 hover:bg-blue-700 mt-6">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === "custom" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Generated Report Display */}
          {generatedReport && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{generatedReport.title}</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportReport("excel")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>

              {/* Revenue Report */}
              {reportType === "revenue" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">
                          ${generatedReport.data.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-400">Total Revenue</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{generatedReport.data.paidInvoices}</p>
                        <p className="text-sm text-slate-400">Paid Invoices</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-400">{generatedReport.data.pendingInvoices}</p>
                        <p className="text-sm text-slate-400">Pending</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">{generatedReport.data.overdueInvoices}</p>
                        <p className="text-sm text-slate-400">Overdue</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Patient Report */}
              {reportType === "patients" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle>Patient Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Patients:</span>
                        <span className="font-bold">{generatedReport.data.totalPatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Patients:</span>
                        <span className="font-bold text-green-400">{generatedReport.data.activePatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>New Patients (This Month):</span>
                        <span className="font-bold text-blue-400">{generatedReport.data.newPatients}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle>Age Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(generatedReport.data.patientsByAge).map(([age, count]) => (
                        <div key={age} className="flex justify-between">
                          <span>{age} years:</span>
                          <span className="font-bold">{count as number}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Appointment Report */}
              {reportType === "appointments" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle>Appointment Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Appointments:</span>
                        <span className="font-bold">{generatedReport.data.totalAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmed:</span>
                        <span className="font-bold text-green-400">{generatedReport.data.confirmedAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-bold text-yellow-400">{generatedReport.data.pendingAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cancelled:</span>
                        <span className="font-bold text-red-400">{generatedReport.data.cancelledAppointments}</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader>
                      <CardTitle>Doctor Schedule</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {generatedReport.data.doctorSchedule.map((doctor: any) => (
                        <div key={doctor.doctor} className="flex justify-between">
                          <span>{doctor.doctor}:</span>
                          <span className="font-bold">{doctor.appointments} appointments</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
