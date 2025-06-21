"use client";
import {
    Calendar,
    FileText,
    Receipt,
    Settings,
    Users,
    Home,
    AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Import components
import { useAuth } from "@/src/redux/providers/contexts/auth-context"
import { getRoleColor, getRoleIcon } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation";
import { useAppSelector } from "../redux/store/reduxHook"
import { useEffect, useState } from "react"


export default function sidebar() {
    const pathname = usePathname();
    const params = useParams()
    const { user } = useAppSelector(state => state.auth);
    const { isSidebarOpen } = useGlobalUI();
    const [routeVerification, setRouteVerification] = useState({
        isValid: true,
        message: ""
    })

    // Verify route access based on user ID and role
    const verifyRouteAccess = () => {
        if (!user?.id || !user?.role) {
            setRouteVerification({
                isValid: false,
                message: "User authentication required"
            })
            return false
        }

        // Extract dashboardId and role from URL params
        const dashboardId = params?.dashboardId
        const urlRole = params?.role

        // Verify user has access to the dashboard
        if (dashboardId && dashboardId !== user.id) {
            setRouteVerification({
                isValid: false,
                message: "Access denied: Dashboard ID mismatch"
            })
            return false
        }

        // Verify role matches
        if (urlRole && urlRole !== user.role) {
            setRouteVerification({
                isValid: false,
                message: "Access denied: Role mismatch"
            })
            return false
        }

        setRouteVerification({
            isValid: true,
            message: ""
        })
        return true
    }

    // Run verification when user data or route changes
    useEffect(() => {
        verifyRouteAccess()
    }, [user?.id, user?.role, pathname, params])

    // Get navigation items based on user role
    const getNavigationItems = () => {
        if (!user?.role) return []

        const baseItems = [
            { id: "dashboard", label: "Dashboard", icon: Home, roles: ["admin", "doctor", "staff"], href: `/${user.id}/${user.role}/dashboard` },
            { id: "patients", label: "Patients", icon: Users, roles: ["admin", "doctor", "staff"], href: `/${user.id}/${user.role}/patients` },
            { id: "appointments", label: "Appointments", icon: Calendar, roles: ["admin", "doctor", "staff"], href: `/${user.id}/${user.role}/appointments` },
        ]

        const roleSpecificItems = [
            { id: "medicalRecords", label: "Medical Records", icon: FileText, roles: ["admin", "doctor"], href: `/${user.id}/${user.role}/medical-records` },
            { id: "billing", label: "Billing", icon: Receipt, roles: ["admin", "staff"], href: `/${user.id}/${user.role}/billing` },
            // { id: "calendar", label: "Calendar View", icon: CalendarDays, roles: ["admin", "doctor", "staff"] },
            { id: "settings", label: "Settings", icon: Settings, roles: ["admin"], href: `/${user.id}/${user.role}/settings` },
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
                {/* Route Verification Status */}
                {!routeVerification.isValid && (
                    <div className="mt-3 p-2 bg-red-900/20 border border-red-700 rounded-md">
                        <div className="flex items-center text-red-400 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {routeVerification.message}
                        </div>
                    </div>
                )}
                {/* User Info Display */}
                <div className="mt-3 text-xs text-slate-400">
                    <div>ID: {user?.id}</div>
                    <div>Role: {user?.role}</div>
                </div>
            </div>
            <nav className="p-4">
                <ul className="space-y-2">
                    {getNavigationItems().map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.id}>
                                <Link href={item.href!} passHref>
                                    <Button
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start text-white hover:bg-slate-800"
                                    >
                                        <item.icon className="mr-3 h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    )
}
