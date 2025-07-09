import {
    User,
    Shield,
    Stethoscope,
    UserCheck,
    Users,
} from "lucide-react"
import { UserRole } from "./enum"

export const getRoleIcon = (role?: string) => {
    switch (role) {
        case UserRole.ADMIN:
            return Shield
        case UserRole.DOCTOR:
            return Stethoscope
        case UserRole.STAFF:
            return UserCheck
        default:
            return User
    }
}

export const countries = [
    'Saudi Arabia',
    'United Arab Emirates',
    'Kuwait',
    'Qatar',
    'Bahrain',
    'Oman',
    'Other'
]

export const getRoleColor = (role?: string) => {
    switch (role) {
        case UserRole.ADMIN:
            return "text-red-600 bg-red-100"
        case UserRole.DOCTOR:
            return "text-blue-600 bg-blue-100"
        case UserRole.STAFF:
            return "text-green-600 bg-green-100"
        default:
            return "text-gray-600 bg-gray-100"
    }
}

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