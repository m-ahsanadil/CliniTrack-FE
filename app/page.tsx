"use client"

import { useState } from "react"
import {
  Bell,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  Menu,
  Receipt,
  Search,
  Settings,
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Activity,
  TrendingUp,
  UserCheck,
  CalendarDays,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

// Mock Data
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    age: 35,
    gender: "Male",
    phone: "+1-555-0123",
    email: "john.doe@email.com",
    lastVisit: "2024-01-15",
    status: "Active",
    condition: "Hypertension",
    address: "123 Main St, City, State 12345",
    emergencyContact: "Jane Doe - +1-555-0124",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 28,
    gender: "Female",
    phone: "+1-555-0124",
    email: "jane.smith@email.com",
    lastVisit: "2024-01-14",
    status: "Active",
    condition: "Diabetes",
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: "John Smith - +1-555-0125",
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 45,
    gender: "Male",
    phone: "+1-555-0125",
    email: "robert.j@email.com",
    lastVisit: "2024-01-13",
    status: "Inactive",
    condition: "Asthma",
    address: "789 Pine St, City, State 12345",
    emergencyContact: "Mary Johnson - +1-555-0126",
  },
  {
    id: 4,
    name: "Emily Davis",
    age: 32,
    gender: "Female",
    phone: "+1-555-0126",
    email: "emily.davis@email.com",
    lastVisit: "2024-01-12",
    status: "Active",
    condition: "Migraine",
    address: "321 Elm St, City, State 12345",
    emergencyContact: "Mike Davis - +1-555-0127",
  },
  {
    id: 5,
    name: "Michael Wilson",
    age: 52,
    gender: "Male",
    phone: "+1-555-0127",
    email: "michael.w@email.com",
    lastVisit: "2024-01-11",
    status: "Active",
    condition: "Arthritis",
    address: "654 Maple Ave, City, State 12345",
    emergencyContact: "Sarah Wilson - +1-555-0128",
  },
]

const mockAppointments = [
  {
    id: 1,
    patientName: "John Doe",
    patientId: 1,
    date: "2024-01-20",
    time: "09:00 AM",
    doctor: "Dr. Smith",
    type: "Consultation",
    status: "Scheduled",
    notes: "Regular checkup for hypertension",
    duration: "30 minutes",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientId: 2,
    date: "2024-01-20",
    time: "10:30 AM",
    doctor: "Dr. Johnson",
    type: "Follow-up",
    status: "Confirmed",
    notes: "Diabetes management follow-up",
    duration: "45 minutes",
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    patientId: 3,
    date: "2024-01-21",
    time: "02:00 PM",
    doctor: "Dr. Brown",
    type: "Check-up",
    status: "Pending",
    notes: "Asthma evaluation",
    duration: "30 minutes",
  },
  {
    id: 4,
    patientName: "Emily Davis",
    patientId: 4,
    date: "2024-01-22",
    time: "11:00 AM",
    doctor: "Dr. Wilson",
    type: "Consultation",
    status: "Scheduled",
    notes: "Migraine treatment consultation",
    duration: "60 minutes",
  },
  {
    id: 5,
    patientName: "Michael Wilson",
    patientId: 5,
    date: "2024-01-23",
    time: "03:30 PM",
    doctor: "Dr. Smith",
    type: "Treatment",
    status: "Confirmed",
    notes: "Arthritis treatment session",
    duration: "45 minutes",
  },
]

const mockMedicalRecords = [
  {
    id: 1,
    patientName: "John Doe",
    patientId: 1,
    date: "2024-01-15",
    diagnosis: "Hypertension",
    treatment: "Lisinopril 10mg daily",
    doctor: "Dr. Smith",
    notes: "Patient responding well to treatment. Blood pressure stable at 130/80.",
    vitals: { bp: "130/80", pulse: "72", temp: "98.6°F", weight: "180 lbs" },
    prescriptions: ["Lisinopril 10mg", "Aspirin 81mg"],
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientId: 2,
    date: "2024-01-14",
    diagnosis: "Type 2 Diabetes",
    treatment: "Metformin 500mg twice daily",
    doctor: "Dr. Johnson",
    notes: "Blood sugar levels improving with medication and diet changes. HbA1c down to 7.2%.",
    vitals: { bp: "125/75", pulse: "68", temp: "98.4°F", weight: "145 lbs" },
    prescriptions: ["Metformin 500mg", "Glipizide 5mg"],
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    patientId: 3,
    date: "2024-01-13",
    diagnosis: "Asthma",
    treatment: "Albuterol inhaler as needed",
    doctor: "Dr. Brown",
    notes: "Symptoms under control with current medication. Peak flow improved.",
    vitals: { bp: "120/78", pulse: "75", temp: "98.5°F", weight: "165 lbs" },
    prescriptions: ["Albuterol inhaler", "Fluticasone inhaler"],
  },
  {
    id: 4,
    patientName: "Emily Davis",
    patientId: 4,
    date: "2024-01-12",
    diagnosis: "Migraine",
    treatment: "Sumatriptan 50mg as needed",
    doctor: "Dr. Wilson",
    notes: "Frequency of migraines reduced from daily to 2-3 times per week.",
    vitals: { bp: "118/72", pulse: "70", temp: "98.3°F", weight: "125 lbs" },
    prescriptions: ["Sumatriptan 50mg", "Propranolol 40mg"],
  },
  {
    id: 5,
    patientName: "Michael Wilson",
    patientId: 5,
    date: "2024-01-11",
    diagnosis: "Osteoarthritis",
    treatment: "Physical therapy and NSAIDs",
    doctor: "Dr. Smith",
    notes: "Joint mobility improving with physical therapy. Pain reduced with medication.",
    vitals: { bp: "135/85", pulse: "78", temp: "98.7°F", weight: "195 lbs" },
    prescriptions: ["Ibuprofen 600mg", "Glucosamine supplement"],
  },
]

const mockInvoices = [
  {
    id: 1,
    patientName: "John Doe",
    patientId: 1,
    date: "2024-01-15",
    amount: 250,
    status: "Paid",
    service: "Consultation",
    dueDate: "2024-01-30",
    paymentMethod: "Credit Card",
    insuranceClaim: "Submitted",
  },
  {
    id: 2,
    patientName: "Jane Smith",
    patientId: 2,
    date: "2024-01-14",
    amount: 180,
    status: "Pending",
    service: "Lab Tests",
    dueDate: "2024-01-29",
    paymentMethod: "Insurance",
    insuranceClaim: "Pending",
  },
  {
    id: 3,
    patientName: "Robert Johnson",
    patientId: 3,
    date: "2024-01-13",
    amount: 320,
    status: "Overdue",
    service: "Treatment",
    dueDate: "2024-01-28",
    paymentMethod: "Cash",
    insuranceClaim: "Denied",
  },
  {
    id: 4,
    patientName: "Emily Davis",
    patientId: 4,
    date: "2024-01-12",
    amount: 150,
    status: "Paid",
    service: "Check-up",
    dueDate: "2024-01-27",
    paymentMethod: "Debit Card",
    insuranceClaim: "Approved",
  },
  {
    id: 5,
    patientName: "Michael Wilson",
    patientId: 5,
    date: "2024-01-11",
    amount: 280,
    status: "Pending",
    service: "Therapy",
    dueDate: "2024-01-26",
    paymentMethod: "Insurance",
    insuranceClaim: "Processing",
  },
]

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [patients, setPatients] = useState(mockPatients)
  const [appointments, setAppointments] = useState(mockAppointments)
  const [medicalRecords, setMedicalRecords] = useState(mockMedicalRecords)
  const [invoices, setInvoices] = useState(mockInvoices)

  // Dashboard Analytics
  const totalPatients = patients.length
  const activePatients = patients.filter((p) => p.status === "Active").length
  const todayAppointments = appointments.filter((a) => a.date === "2024-01-20").length
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const pendingPayments = invoices.filter((inv) => inv.status === "Pending" || inv.status === "Overdue").length

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Patients</p>
                <p className="text-3xl font-bold">{totalPatients}</p>
                <p className="text-sm text-green-400 flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  12% increase
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Active Patients</p>
                <p className="text-3xl font-bold">{activePatients}</p>
                <p className="text-sm text-green-400 flex items-center mt-1">
                  <UserCheck className="mr-1 h-3 w-3" />
                  {Math.round((activePatients / totalPatients) * 100)}% active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Today's Appointments</p>
                <p className="text-3xl font-bold">{todayAppointments}</p>
                <p className="text-sm text-blue-400 flex items-center mt-1">
                  <CalendarDays className="mr-1 h-3 w-3" />
                  Scheduled today
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Total Revenue</p>
                <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-yellow-400 flex items-center mt-1">
                  <DollarSign className="mr-1 h-3 w-3" />
                  {pendingPayments} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <p className="text-sm text-slate-400">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-slate-400">{patient.condition}</p>
                    </div>
                  </div>
                  <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
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
        <h2 className="text-2xl font-semibold">Patients Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Patients ({patients.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search patients..." className="w-64 bg-slate-700 border-slate-600" />
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead>Patient</TableHead>
                <TableHead>Age/Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="border-slate-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-slate-400">ID: {patient.id.toString().padStart(4, "0")}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{patient.age} years</p>
                      <p className="text-sm text-slate-400">{patient.gender}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {patient.phone}
                      </p>
                      <p className="flex items-center text-sm text-slate-400">
                        <Mail className="mr-1 h-3 w-3" />
                        {patient.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.condition}</TableCell>
                  <TableCell>
                    <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
        <h2 className="text-2xl font-semibold">Appointments</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{appointments.length}</p>
              <p className="text-sm text-slate-400">Total Appointments</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {appointments.filter((a) => a.status === "Confirmed").length}
              </p>
              <p className="text-sm text-slate-400">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {appointments.filter((a) => a.status === "Pending").length}
              </p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">{todayAppointments}</p>
              <p className="text-sm text-slate-400">Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Appointment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead>Patient</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id} className="border-slate-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {appointment.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {appointment.date}
                      </p>
                      <p className="flex items-center text-sm text-slate-400">
                        <Clock className="mr-1 h-3 w-3" />
                        {appointment.time}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.type}</TableCell>
                  <TableCell>{appointment.duration}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
        <h2 className="text-2xl font-semibold">Medical Records</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Record
        </Button>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient Records ({medicalRecords.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search records..." className="w-64 bg-slate-700 border-slate-600" />
              <Select>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="diagnosis">By Diagnosis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicalRecords.map((record) => (
                <TableRow key={record.id} className="border-slate-700">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {record.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{record.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
        <h2 className="text-2xl font-semibold">Billing & Invoices</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{invoices.filter((i) => i.status === "Paid").length}</p>
              <p className="text-sm text-slate-400">Paid Invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {invoices.filter((i) => i.status === "Pending").length}
              </p>
              <p className="text-sm text-slate-400">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{invoices.filter((i) => i.status === "Overdue").length}</p>
              <p className="text-sm text-slate-400">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead>Invoice #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-slate-700">
                  <TableCell>#{invoice.id.toString().padStart(4, "0")}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {invoice.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{invoice.patientName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{invoice.service}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>${invoice.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
      <h2 className="text-2xl font-semibold">Clinic Settings</h2>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name</Label>
                  <Input
                    id="clinicName"
                    defaultValue="CliniTrack Medical Center"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1-555-0100" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" defaultValue="info@clinitrack.com" className="bg-slate-700 border-slate-600" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="www.clinitrack.com" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  defaultValue="123 Medical Center Drive, Healthcare City, HC 12345"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-slate-400">Receive notifications via email</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-slate-400">Receive notifications via SMS</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Appointment Reminders</h4>
                  <p className="text-sm text-slate-400">Send reminders to patients</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Notifications</h4>
                  <p className="text-sm text-slate-400">Notify about payment status</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-400">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Session Timeout</h4>
                  <p className="text-sm text-slate-400">Auto logout after inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" defaultValue="30" className="bg-slate-700 border-slate-600" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Login Notifications</h4>
                  <p className="text-sm text-slate-400">Notify on new device login</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" defaultValue="8.5" className="bg-slate-700 border-slate-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-generate Invoices</h4>
                  <p className="text-sm text-slate-400">Automatically create invoices after appointments</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Reminders</h4>
                  <p className="text-sm text-slate-400">Send automatic payment reminders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminderDays">Reminder Days Before Due</Label>
                <Input id="reminderDays" defaultValue="3" className="bg-slate-700 border-slate-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboard()
      case "patients":
        return renderPatients()
      case "appointments":
        return renderAppointments()
      case "medical-records":
        return renderMedicalRecords()
      case "billing":
        return renderBilling()
      case "settings":
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block">CliniTrack</span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 bg-red-500 text-xs">2</Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-slate-800 border-slate-700">
                <div className="p-3 border-b border-slate-700">
                  <h4 className="font-medium">Notifications (2)</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="p-3 hover:bg-slate-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Receipt className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment Received</p>
                        <p className="text-xs text-slate-400">John Doe paid $250 for consultation</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 hover:bg-slate-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Appointment Reminder</p>
                        <p className="text-xs text-slate-400">Jane Smith appointment in 1 hour</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <div className="p-3 border-t border-slate-700">
                  <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300">
                    View all
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="hover:bg-slate-700">
                  <Users className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-slate-700" onClick={() => setCurrentPage("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Clinic Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="hover:bg-slate-700">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto transform transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          {/* User Profile */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>AA</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Mr. Ahsan Adil</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Main</h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "dashboard" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("dashboard")
                      setSidebarOpen(false)
                    }}
                  >
                    <Home className="mr-3 h-4 w-4" />
                    Dashboard
                    <Badge className="ml-auto bg-red-500">9+</Badge>
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Clinic</h4>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "patients" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("patients")
                      setSidebarOpen(false)
                    }}
                  >
                    <Users className="mr-3 h-4 w-4" />
                    Patients
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "appointments" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("appointments")
                      setSidebarOpen(false)
                    }}
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    Appointments
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "medical-records" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("medical-records")
                      setSidebarOpen(false)
                    }}
                  >
                    <FileText className="mr-3 h-4 w-4" />
                    Medical Records
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "billing" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("billing")
                      setSidebarOpen(false)
                    }}
                  >
                    <Receipt className="mr-3 h-4 w-4" />
                    Billing & Invoices
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${currentPage === "settings" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-300 hover:text-white hover:bg-slate-700"}`}
                    onClick={() => {
                      setCurrentPage("settings")
                      setSidebarOpen(false)
                    }}
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    Clinic Settings
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold flex items-center">
                  {currentPage === "dashboard" && (
                    <>
                      <Home className="mr-2 h-6 w-6" />
                      Dashboard
                    </>
                  )}
                  {currentPage === "patients" && (
                    <>
                      <Users className="mr-2 h-6 w-6" />
                      Patients
                    </>
                  )}
                  {currentPage === "appointments" && (
                    <>
                      <Calendar className="mr-2 h-6 w-6" />
                      Appointments
                    </>
                  )}
                  {currentPage === "medical-records" && (
                    <>
                      <FileText className="mr-2 h-6 w-6" />
                      Medical Records
                    </>
                  )}
                  {currentPage === "billing" && (
                    <>
                      <Receipt className="mr-2 h-6 w-6" />
                      Billing & Invoices
                    </>
                  )}
                  {currentPage === "settings" && (
                    <>
                      <Settings className="mr-2 h-6 w-6" />
                      Clinic Settings
                    </>
                  )}
                </h1>
                <nav className="flex items-center space-x-2 text-sm text-slate-400 mt-1">
                  <span>CliniTrack</span>
                  <span>/</span>
                  <span className="capitalize">{currentPage.replace("-", " ")}</span>
                </nav>
              </div>
              {currentPage === "dashboard" && <Button className="bg-blue-600 hover:bg-blue-700">Create Report</Button>}
            </div>
          </div>

          {/* Dynamic Content */}
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
