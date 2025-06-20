import { useState } from "react"
import {
    Calendar,
    FileText,
    Receipt,
    Settings,
    Users,
    CalendarDays,
    Home
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import { useAuth } from "@/src/redux/providers/contexts/auth-context"
import { getRoleColor, getRoleIcon } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"


export default function sidebar() {

    const { user } = useAuth();
    const { isSidebarOpen, setCalendarViewOpen, currentPage, setCurrentPage } = useGlobalUI();

    // Get navigation items based on user role
    const getNavigationItems = () => {
        const baseItems = [
            { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin", "doctor", "staff"] },
            { id: "patients", label: "Patients", icon: Users, roles: ["admin", "doctor", "staff"] },
            { id: "appointments", label: "Appointments", icon: Calendar, roles: ["admin", "doctor", "staff"] },
        ]

        const roleSpecificItems = [
            { id: "medicalRecords", label: "Medical Records", icon: FileText, roles: ["admin", "doctor"] },
            { id: "billing", label: "Billing", icon: Receipt, roles: ["admin", "staff"] },
            { id: "calendar", label: "Calendar View", icon: CalendarDays, roles: ["admin", "doctor", "staff"] },
            { id: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
        ]

        return [...baseItems, ...roleSpecificItems].filter((item) => item.roles.includes(user?.role || ""))
    }

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 z-40 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-xl font-bold text-white">CliniTrack</h1>
                <p className="text-sm text-slate-400">Medical Dashboard</p>

                {/* User Role Badge */}
                <div className="mt-3">
                    <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}
                    >
                        {(() => {
                            const IconComponent = getRoleIcon(user?.role)
                            return <IconComponent className="w-3 h-3 mr-1" />
                        })()}
                        {user?.role?.toUpperCase()}
                    </div>
                </div>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    {getNavigationItems().map((item) => (
                        <li key={item.id}>
                            <Button
                                variant={currentPage === item.id ? "secondary" : "ghost"}
                                className="w-full justify-start text-white hover:bg-slate-800"
                                onClick={() => {
                                    if (item.id === "calendar") {
                                        setCalendarViewOpen(true)
                                    } else {
                                        setCurrentPage(item.id)
                                    }
                                }}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}
