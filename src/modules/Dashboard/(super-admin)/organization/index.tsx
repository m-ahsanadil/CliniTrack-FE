"use client"

import { Building2, Plus, Search, Filter, MoreVertical, Edit2, Trash2, Eye, MapPin, Phone, Mail, Users, Calendar, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

// Import form components
import { getStatusBadgeVariant, getRoleIcon, getRoleColor } from "@/src/constants"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { RoleGuard } from "@/components/role-guard"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { UserRole } from "@/src/enum"
import { OrganizationManagementProps } from "@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/organizations/page"
import { ActionDropdown, createStandardActions } from "@/src/components/ActionDropdown"

// Mock data for demonstration
const mockOrganizations = [
    {
        id: 1,
        name: "Metro Medical Center",
        location: "New York, NY",
        type: "Hospital",
        status: "active",
        admins: 3,
        doctors: 45,
        staff: 120,
        patients: 2500,
        phone: "+1 (555) 123-4567",
        email: "admin@metromedical.com",
        established: "2018-03-15",
        lastActivity: "2 hours ago"
    },
    {
        id: 2,
        name: "City Health Clinic",
        location: "Los Angeles, CA",
        type: "Clinic",
        status: "active",
        admins: 2,
        doctors: 15,
        staff: 30,
        patients: 800,
        phone: "+1 (555) 987-6543",
        email: "info@cityhealthclinic.com",
        established: "2020-01-10",
        lastActivity: "1 day ago"
    },
    {
        id: 3,
        name: "Community Care Center",
        location: "Chicago, IL",
        type: "Community Health",
        status: "pending",
        admins: 1,
        doctors: 8,
        staff: 15,
        patients: 300,
        phone: "+1 (555) 456-7890",
        email: "support@communitycare.com",
        established: "2023-11-20",
        lastActivity: "3 days ago"
    }
]

export default function index({ role }: OrganizationManagementProps) {
    const dispatch = useAppDispatch();
    const { } = useAppSelector(state => state.profile);
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Action handlers
    const handleView = (id: { id: number; name: string; location: string; type: string; status: string; admins: number; doctors: number; staff: number; patients: number; phone: string; email: string; established: string; lastActivity: string }) => {
        console.log('View organization:', id)
        // Add your view logic here
    }

    const handleEdit = (id: number) => {
        console.log('Edit organization:', id)
        // Add your edit logic here
    }

    const handleDelete = (id: number) => {
        console.log('Delete organization:', id)
        // Add your delete logic here
    }

    // Filter organizations based on search and status
    const filteredOrganizations = mockOrganizations.filter(org => {
        const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.type.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || org.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            case "pending":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "inactive":
                return <Badge variant="destructive" className="bg-red-100 text-red-800">Inactive</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "Hospital":
                return <Building2 className="h-4 w-4" />
            case "Clinic":
                return <Activity className="h-4 w-4" />
            default:
                return <Building2 className="h-4 w-4" />
        }
    }

    return (
        <ProtectedRoleGuard role={role}>
            <div className="p-6 space-y-6 max-w-full bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Organization Management</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor all organizations in the CliniTrack system</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Organization
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Organizations</CardTitle>
                            <Building2 className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">3</div>
                            <p className="text-xs text-gray-500">+1 from last month</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Active Organizations</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">2</div>
                            <p className="text-xs text-gray-500">66.7% of total</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">3,800</div>
                            <p className="text-xs text-gray-500">Across all organizations</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-700">Pending Approvals</CardTitle>
                            <Calendar className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">1</div>
                            <p className="text-xs text-gray-500">Requires attention</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-xl text-gray-900">Organizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search organizations..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={statusFilter === "all" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("all")}
                                    className="whitespace-nowrap"
                                >
                                    All
                                </Button>
                                <Button
                                    variant={statusFilter === "active" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("active")}
                                    className="whitespace-nowrap"
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={statusFilter === "pending" ? "default" : "outline"}
                                    onClick={() => setStatusFilter("pending")}
                                    className="whitespace-nowrap"
                                >
                                    Pending
                                </Button>
                            </div>
                        </div>

                        {/* Organizations Table */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Organization</TableHead>
                                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                                        <TableHead className="hidden lg:table-cell">Users</TableHead>
                                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Last Activity</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrganizations.map((org) => (
                                        <TableRow key={org.id}>
                                            <TableCell>
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        {getTypeIcon(org.type)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{org.name}</div>
                                                        <div className="text-sm text-gray-500 flex items-center">
                                                            <MapPin className="h-3 w-3 mr-1" />
                                                            {org.location}
                                                        </div>
                                                        <div className="text-xs text-gray-400">{org.type}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <Phone className="h-3 w-3 mr-1" />
                                                        {org.phone}
                                                    </div>
                                                    <div className="flex items-center text-gray-600 mt-1">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        {org.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="text-sm space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Doctors:</span>
                                                        <span className="font-medium text-gray-500">{org.doctors}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Staff:</span>
                                                        <span className="font-medium text-gray-500">{org.staff}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Patients:</span>
                                                        <span className="font-medium text-gray-500">{org.patients}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {getStatusBadge(org.status)}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="text-sm text-gray-600">{org.lastActivity}</div>
                                            </TableCell>
                                            <TableCell>
                                                <ActionDropdown
                                                    actions={createStandardActions(
                                                        () => handleView(org),
                                                        () => handleEdit(org.id),
                                                        () => handleDelete(org.id)
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {filteredOrganizations.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No organizations found matching your criteria</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoleGuard>
    )
}