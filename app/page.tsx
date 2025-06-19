"use client"

import { useState } from "react"
import {
  Bell,
  Calendar,
  FileText,
  Menu,
  Receipt,
  Settings,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  CalendarDays,
  Home,
  Search,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

// Import the form components
import PatientForm from "@/components/patient-form"
import AppointmentForm from "@/components/appointment-form"
import MedicalRecordForm from "@/components/medical-record-form"
import InvoiceForm from "@/components/invoice-form"
import ReportsModal from "@/components/reports-modal"
import CalendarView from "@/components/calendar-view"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")

  // Enhanced dummy data with more realistic information
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "John Doe",
      age: 45,
      gender: "Male",
      phone: "(555) 123-4567",
      email: "john.doe@email.com",
      address: "123 Main St, City, State 12345",
      bloodType: "A+",
      allergies: "Penicillin",
      emergencyContact: "Jane Doe - (555) 123-4568",
      insuranceProvider: "Blue Cross",
      insuranceNumber: "BC123456789",
      status: "Active",
      lastVisit: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      gender: "Female",
      phone: "(555) 987-6543",
      email: "jane.smith@email.com",
      address: "456 Oak Ave, City, State 12345",
      bloodType: "O-",
      allergies: "None",
      emergencyContact: "Bob Smith - (555) 987-6544",
      insuranceProvider: "Aetna",
      insuranceNumber: "AE987654321",
      status: "Active",
      lastVisit: "2024-01-20",
    },
    {
      id: 3,
      name: "Robert Johnson",
      age: 58,
      gender: "Male",
      phone: "(555) 456-7890",
      email: "robert.j@email.com",
      address: "789 Pine St, City, State 12345",
      bloodType: "B+",
      allergies: "Shellfish",
      emergencyContact: "Mary Johnson - (555) 456-7891",
      insuranceProvider: "Cigna",
      insuranceNumber: "CG456789123",
      status: "Active",
      lastVisit: "2024-01-18",
    },
  ])

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: "John Doe",
      date: "2024-01-25",
      time: "10:00 AM",
      doctor: "Dr. Smith",
      type: "Check-up",
      duration: "30 minutes",
      status: "Confirmed",
      notes: "Annual physical examination",
    },
    {
      id: 2,
      patientId: 2,
      patientName: "Jane Smith",
      date: "2024-01-26",
      time: "2:00 PM",
      doctor: "Dr. Johnson",
      type: "Follow-up",
      duration: "45 minutes",
      status: "Pending",
      notes: "Follow-up for blood pressure monitoring",
    },
    {
      id: 3,
      patientId: 3,
      patientName: "Robert Johnson",
      date: "2024-01-27",
      time: "11:30 AM",
      doctor: "Dr. Brown",
      type: "Consultation",
      duration: "60 minutes",
      status: "Scheduled",
      notes: "Initial consultation for joint pain",
    },
  ])

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: "John Doe",
      date: "2024-01-15",
      doctor: "Dr. Smith",
      diagnosis: "Hypertension",
      treatment: "Lifestyle changes and medication",
      severity: "Moderate",
      status: "Active",
      vitals: { bp: "140/90", pulse: "78", temp: "98.6°F", weight: "180 lbs", height: "5'10\"", oxygen: "98%" },
      prescriptions: ["Lisinopril 10mg daily", "Hydrochlorothiazide 25mg daily"],
      symptoms: ["Headache", "Dizziness"],
      notes: "Patient advised to reduce sodium intake and increase exercise",
    },
    {
      id: 2,
      patientId: 2,
      patientName: "Jane Smith",
      date: "2024-01-20",
      doctor: "Dr. Johnson",
      diagnosis: "Seasonal Allergies",
      treatment: "Antihistamines and nasal spray",
      severity: "Mild",
      status: "Resolved",
      vitals: { bp: "120/80", pulse: "72", temp: "98.4°F", weight: "135 lbs", height: "5'6\"", oxygen: "99%" },
      prescriptions: ["Claritin 10mg daily", "Flonase nasal spray"],
      symptoms: ["Sneezing", "Runny nose", "Itchy eyes"],
      notes: "Symptoms improved with treatment",
    },
  ])

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      patientId: 1,
      patientName: "John Doe",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      service: "Annual Physical Examination",
      amount: 250,
      status: "Paid",
      paymentMethod: "Insurance",
      insuranceClaim: "Approved",
      items: [
        { description: "Office Visit", quantity: 1, rate: 150, amount: 150 },
        { description: "Blood Work", quantity: 1, rate: 100, amount: 100 },
      ],
      subtotal: 250,
      tax: 20,
      discount: 0,
      total: 270,
    },
    {
      id: 2,
      patientId: 2,
      patientName: "Jane Smith",
      date: "2024-01-20",
      dueDate: "2024-02-20",
      service: "Allergy Consultation",
      amount: 180,
      status: "Pending",
      paymentMethod: "",
      insuranceClaim: "Submitted",
      items: [
        { description: "Consultation", quantity: 1, rate: 120, amount: 120 },
        { description: "Allergy Test", quantity: 1, rate: 60, amount: 60 },
      ],
      subtotal: 180,
      tax: 14.4,
      discount: 0,
      total: 194.4,
    },
  ])

  // Modal states
  const [patientFormOpen, setPatientFormOpen] = useState(false)
  const [appointmentFormOpen, setAppointmentFormOpen] = useState(false)
  const [medicalRecordFormOpen, setMedicalRecordFormOpen] = useState(false)
  const [invoiceFormOpen, setInvoiceFormOpen] = useState(false)
  const [reportsModalOpen, setReportsModalOpen] = useState(false)
  const [calendarViewOpen, setCalendarViewOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Filter functions
  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAppointments = appointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMedicalRecords = medicalRecords.filter(
    (record) =>
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // CRUD handlers
  const handleAddPatient = () => {
    setEditingItem(null)
    setPatientFormOpen(true)
  }

  const handleEditPatient = (patient) => {
    setEditingItem(patient)
    setPatientFormOpen(true)
  }

  const handleSavePatient = (patientData) => {
    if (editingItem) {
      setPatients(patients.map((p) => (p.id === editingItem.id ? { ...patientData, id: editingItem.id } : p)))
    } else {
      setPatients([...patients, { ...patientData, id: Date.now() }])
    }
  }

  const handleDeletePatient = (patientId) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      setPatients(patients.filter((p) => p.id !== patientId))
      // Also remove related appointments, records, and invoices
      setAppointments(appointments.filter((a) => a.patientId !== patientId))
      setMedicalRecords(medicalRecords.filter((r) => r.patientId !== patientId))
      setInvoices(invoices.filter((i) => i.patientId !== patientId))
    }
  }

  const handleAddAppointment = () => {
    setEditingItem(null)
    setAppointmentFormOpen(true)
  }

  const handleEditAppointment = (appointment) => {
    setEditingItem(appointment)
    setAppointmentFormOpen(true)
  }

  const handleSaveAppointment = (appointmentData) => {
    if (editingItem) {
      setAppointments(
        appointments.map((a) => (a.id === editingItem.id ? { ...appointmentData, id: editingItem.id } : a)),
      )
    } else {
      setAppointments([...appointments, { ...appointmentData, id: Date.now() }])
    }
  }

  const handleDeleteAppointment = (appointmentId) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      setAppointments(appointments.filter((a) => a.id !== appointmentId))
    }
  }

  const handleAddMedicalRecord = () => {
    setEditingItem(null)
    setMedicalRecordFormOpen(true)
  }

  const handleEditMedicalRecord = (record) => {
    setEditingItem(record)
    setMedicalRecordFormOpen(true)
  }

  const handleSaveMedicalRecord = (recordData) => {
    if (editingItem) {
      setMedicalRecords(
        medicalRecords.map((r) => (r.id === editingItem.id ? { ...recordData, id: editingItem.id } : r)),
      )
    } else {
      setMedicalRecords([...medicalRecords, { ...recordData, id: Date.now() }])
    }
  }

  const handleDeleteMedicalRecord = (recordId) => {
    if (confirm("Are you sure you want to delete this medical record?")) {
      setMedicalRecords(medicalRecords.filter((r) => r.id !== recordId))
    }
  }

  const handleAddInvoice = () => {
    setEditingItem(null)
    setInvoiceFormOpen(true)
  }

  const handleEditInvoice = (invoice) => {
    setEditingItem(invoice)
    setInvoiceFormOpen(true)
  }

  const handleSaveInvoice = (invoiceData) => {
    if (editingItem) {
      setInvoices(invoices.map((i) => (i.id === editingItem.id ? { ...invoiceData, id: editingItem.id } : i)))
    } else {
      setInvoices([...invoices, { ...invoiceData, id: Date.now() }])
    }
  }

  const handleDeleteInvoice = (invoiceId) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      setInvoices(invoices.filter((i) => i.id !== invoiceId))
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
      case "paid":
      case "approved":
        return "default"
      case "pending":
      case "scheduled":
      case "submitted":
        return "secondary"
      case "cancelled":
      case "overdue":
      case "denied":
        return "destructive"
      case "resolved":
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const renderSidebar = () => (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">CliniTrack</h1>
        <p className="text-sm text-slate-400">Medical Dashboard</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Button
              variant={currentPage === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("dashboard")}
            >
              <Home className="mr-3 h-4 w-4" />
              Dashboard
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "patients" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("patients")}
            >
              <Users className="mr-3 h-4 w-4" />
              Patients
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "appointments" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("appointments")}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Appointments
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "medicalRecords" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("medicalRecords")}
            >
              <FileText className="mr-3 h-4 w-4" />
              Medical Records
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "billing" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("billing")}
            >
              <Receipt className="mr-3 h-4 w-4" />
              Billing
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "calendar" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCalendarViewOpen(true)}
            >
              <CalendarDays className="mr-3 h-4 w-4" />
              Calendar View
            </Button>
          </li>
          <li>
            <Button
              variant={currentPage === "settings" ? "secondary" : "ghost"}
              className="w-full justify-start text-white hover:bg-slate-800"
              onClick={() => setCurrentPage("settings")}
            >
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{patients.length}</div>
            <p className="text-xs text-slate-500">Active patients in system</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{appointments.length}</div>
            <p className="text-xs text-slate-500">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Invoices</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {invoices.filter((invoice) => invoice.status === "Pending").length}
            </div>
            <p className="text-xs text-slate-500">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              $
              {invoices
                .filter((i) => i.status === "Paid")
                .reduce((sum, i) => sum + i.total, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
            <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Button>
            <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Medical Record
            </Button>
            <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{appointment.patientName}</p>
                    <p className="text-sm text-slate-500">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Recent Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {medicalRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{record.patientName}</p>
                    <p className="text-sm text-slate-500">{record.diagnosis}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patients</h2>
          <p className="text-slate-600">Manage patient information and records</p>
        </div>
        <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card className="bg-white border border-slate-200">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-600">Name</TableHead>
                <TableHead className="text-slate-600">Age</TableHead>
                <TableHead className="text-slate-600">Gender</TableHead>
                <TableHead className="text-slate-600">Phone</TableHead>
                <TableHead className="text-slate-600">Last Visit</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-right text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{patient.name}</TableCell>
                  <TableCell className="text-slate-600">{patient.age}</TableCell>
                  <TableCell className="text-slate-600">{patient.gender}</TableCell>
                  <TableCell className="text-slate-600">{patient.phone}</TableCell>
                  <TableCell className="text-slate-600">{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPatient(patient)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Appointments</h2>
          <p className="text-slate-600">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <Card className="bg-white border border-slate-200">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-600">Patient</TableHead>
                <TableHead className="text-slate-600">Date</TableHead>
                <TableHead className="text-slate-600">Time</TableHead>
                <TableHead className="text-slate-600">Doctor</TableHead>
                <TableHead className="text-slate-600">Type</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-right text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{appointment.patientName}</TableCell>
                  <TableCell className="text-slate-600">{appointment.date}</TableCell>
                  <TableCell className="text-slate-600">{appointment.time}</TableCell>
                  <TableCell className="text-slate-600">{appointment.doctor}</TableCell>
                  <TableCell className="text-slate-600">{appointment.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>{appointment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderMedicalRecords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Medical Records</h2>
          <p className="text-slate-600">Patient medical history and treatment records</p>
        </div>
        <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Medical Record
        </Button>
      </div>

      <Card className="bg-white border border-slate-200">
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-600">Patient</TableHead>
                <TableHead className="text-slate-600">Date</TableHead>
                <TableHead className="text-slate-600">Doctor</TableHead>
                <TableHead className="text-slate-600">Diagnosis</TableHead>
                <TableHead className="text-slate-600">Severity</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-right text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedicalRecords.map((record) => (
                <TableRow key={record.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{record.patientName}</TableCell>
                  <TableCell className="text-slate-600">{record.date}</TableCell>
                  <TableCell className="text-slate-600">{record.doctor}</TableCell>
                  <TableCell className="text-slate-600">{record.diagnosis}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.severity === "Severe"
                          ? "destructive"
                          : record.severity === "Moderate"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {record.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditMedicalRecord(record)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedicalRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Invoices</h2>
          <p className="text-slate-600">Manage patient billing and payment records</p>
        </div>
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
                <TableHead className="text-slate-600">Patient</TableHead>
                <TableHead className="text-slate-600">Date</TableHead>
                <TableHead className="text-slate-600">Service</TableHead>
                <TableHead className="text-slate-600">Amount</TableHead>
                <TableHead className="text-slate-600">Status</TableHead>
                <TableHead className="text-slate-600">Insurance</TableHead>
                <TableHead className="text-right text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{invoice.patientName}</TableCell>
                  <TableCell className="text-slate-600">{invoice.date}</TableCell>
                  <TableCell className="text-slate-600">{invoice.service}</TableCell>
                  <TableCell className="text-slate-600">${invoice.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(invoice.status)}>{invoice.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(invoice.insuranceClaim)}>{invoice.insuranceClaim}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditInvoice(invoice)}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full Name
              </Label>
              <Input id="name" defaultValue="Dr. John Smith" className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email Address
              </Label>
              <Input id="email" type="email" defaultValue="dr.smith@clinic.com" className="border-slate-300" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-700">
                Phone Number
              </Label>
              <Input id="phone" defaultValue="(555) 123-4567" className="border-slate-300" />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-slate-700">
                  Email Notifications
                </Label>
                <p className="text-sm text-slate-500">Receive appointment reminders via email</p>
              </div>
              <Switch id="emailNotifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications" className="text-slate-700">
                  SMS Notifications
                </Label>
                <p className="text-sm text-slate-500">Receive urgent alerts via SMS</p>
              </div>
              <Switch id="smsNotifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reportNotifications" className="text-slate-700">
                  Weekly Reports
                </Label>
                <p className="text-sm text-slate-500">Get weekly summary reports</p>
              </div>
              <Switch id="reportNotifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50">
      {renderSidebar()}

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 capitalize">
                {currentPage.replace(/([A-Z])/g, " $1")}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentPage === "dashboard" && (
              <Button
                onClick={() => setReportsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Generate Report
              </Button>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64 border-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-600 text-white">DS</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentPage === "dashboard" && renderDashboard()}
          {currentPage === "patients" && renderPatients()}
          {currentPage === "appointments" && renderAppointments()}
          {currentPage === "medicalRecords" && renderMedicalRecords()}
          {currentPage === "billing" && renderBilling()}
          {currentPage === "settings" && renderSettings()}
        </main>

        {/* Modal Components */}
        <PatientForm
          open={patientFormOpen}
          onOpenChange={setPatientFormOpen}
          patient={editingItem}
          onSave={handleSavePatient}
        />

        <AppointmentForm
          open={appointmentFormOpen}
          onOpenChange={setAppointmentFormOpen}
          appointment={editingItem}
          onSave={handleSaveAppointment}
          patients={patients}
        />

        <MedicalRecordForm
          open={medicalRecordFormOpen}
          onOpenChange={setMedicalRecordFormOpen}
          record={editingItem}
          onSave={handleSaveMedicalRecord}
          patients={patients}
        />

        <InvoiceForm
          open={invoiceFormOpen}
          onOpenChange={setInvoiceFormOpen}
          invoice={editingItem}
          onSave={handleSaveInvoice}
          patients={patients}
        />

        <ReportsModal
          open={reportsModalOpen}
          onOpenChange={setReportsModalOpen}
          patients={patients}
          appointments={appointments}
          invoices={invoices}
        />

        <CalendarView
          open={calendarViewOpen}
          onOpenChange={setCalendarViewOpen}
          appointments={appointments}
          onAddAppointment={handleAddAppointment}
          onEditAppointment={handleEditAppointment}
        />
      </div>
    </div>
  )
}
