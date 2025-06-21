import {
    User,
    Shield,
    Stethoscope,
    UserCheck,
    Users,
} from "lucide-react"

export const getRoleIcon = (role?: string) => {
    switch (role) {
        case "admin":
            return Shield
        case "doctor":
            return Stethoscope
        case "staff":
            return UserCheck
        default:
            return User
    }
}

export const getRoleColor = (role?: string) => {
    switch (role) {
        case "admin":
            return "text-red-600 bg-red-100"
        case "doctor":
            return "text-blue-600 bg-blue-100"
        case "staff":
            return "text-green-600 bg-green-100"
        default:
            return "text-gray-600 bg-gray-100"
    }
}

export type UserRole = "admin" | "doctor" | "staff"


export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
    department?: string
    specialization?: string
}

// Mock users for demonstration
export const mockUsers: Record<string, User & { password: string }> = {
    "admin@clinitrack.com": {
        id: "1",
        name: "Dr. Sarah Wilson",
        email: "admin@clinitrack.com",
        role: "admin",
        password: "admin123",
        avatar: "/placeholder-user.jpg",
        department: "Administration",
    },
    "doctor@clinitrack.com": {
        id: "2",
        name: "Dr. Michael Chen",
        email: "doctor@clinitrack.com",
        role: "doctor",
        password: "doctor123",
        avatar: "/placeholder-user.jpg",
        department: "Cardiology",
        specialization: "Interventional Cardiology",
    },
    "staff@clinitrack.com": {
        id: "3",
        name: "Jennifer Martinez",
        email: "staff@clinitrack.com",
        role: "staff",
        password: "staff123",
        avatar: "/placeholder-user.jpg",
        department: "Reception",
    },
}

export const demoAccounts = [
    {
        role: "admin",
        email: "admin@clinitrack.com",
        password: "admin123",
        name: "Dr. Sarah Wilson",
        icon: Shield,
        color: "bg-red-500",
        description: "Full system access, user management, reports",
    },
    {
        role: "doctor",
        email: "doctor@clinitrack.com",
        password: "doctor123",
        name: "Dr. Michael Chen",
        icon: Stethoscope,
        color: "bg-blue-500",
        description: "Patient records, appointments, medical notes",
    },
    {
        role: "staff",
        email: "staff@clinitrack.com",
        password: "staff123",
        name: "Jennifer Martinez",
        icon: Users,
        color: "bg-green-500",
        description: "Appointments, patient check-in, basic records",
    },
]

export const getStatusBadgeVariant = (status: string) => {
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

export const Patients = [
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
]

export const Appointments = [
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
]

export const MedicalRecords = [
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
]

export const Invoices = [
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
]