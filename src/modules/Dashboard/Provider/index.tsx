"use client"

import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Shield,
    Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import form components
import { getStatusBadgeVariant } from "@/src/constants"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { RoleGuard } from "@/components/role-guard"
import { SetStateAction, useEffect, useState } from "react"

// Import components
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { useProviderFetcher } from "./api/useProviderFetcher"
import { Provider } from "./api/types"
import { ViewProviderDialog } from "./organisms/ViewProvidersDialog"
import { UserRole } from "@/src/enum"
import { useProvider } from "@/src/redux/providers/contexts/ProviderContext"
import { ProviderProps } from "@/app/(DASHBOARD)/[role]/providers/page"
import { TableRowActions } from "@/src/components/ui/TableRowActions"


export default function index({ role }: ProviderProps) {
    useProviderFetcher();
    const { user } = useAppSelector(state => state.auth)
    const { handleAddProvider, handleDeleteProvider, handleEditProvider } = useProvider();
    const { providers: apiProvider, loading, error } = useAppSelector(state => state.provider)

    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);


    const handleViewProvider = (provider: Provider) => {
        setSelectedProvider(provider);
        setIsViewOpen(true);
    }

    return (
        <ProtectedRoleGuard role={role}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Providers</h2>
                        {user?.role === 'admin' ? (
                            <p className="text-slate-600">Manage your clinic’s healthcare providers.</p>
                        ) : (
                            <p className="text-slate-600">View appointments by provider.</p>
                        )}
                    </div>

                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.STAFF, UserRole.SUPER_ADMIN]}>
                        <Button
                            onClick={handleAddProvider}
                            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Provider
                        </Button>
                    </RoleGuard>
                </div>

                {/* Table Card */}
                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-4 sm:p-6 overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                                <span className="ml-2 text-slate-600">Loading Doctors...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600 py-6">
                                <p>{error}</p>
                            </div>
                        ) : (
                            <div className="min-w-[768px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-slate-600">Name</TableHead>
                                            <TableHead className="text-slate-600">Specialty</TableHead>
                                            <TableHead className="text-slate-600">Email</TableHead>
                                            <TableHead className="text-slate-600">Phone</TableHead>
                                            <TableHead className="text-slate-600">Clinic</TableHead>
                                            <TableHead className="text-slate-600">Status</TableHead>
                                            <TableHead className="text-center text-slate-600">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {apiProvider.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-10">
                                                    <div className="flex flex-col items-center justify-center space-y-2">
                                                        <Shield className="w-10 h-10 text-slate-400" />
                                                        <p className="text-slate-600">No providers found</p>
                                                        <p className="text-sm text-slate-400">
                                                            Start by adding a new provider to your clinic.
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            apiProvider.map((provider: Provider) => (
                                                <TableRow key={provider._id} className="hover:bg-slate-50">
                                                    <TableCell className="text-slate-600">{provider.name}</TableCell>
                                                    <TableCell className="text-slate-600">{provider.specialty}</TableCell>
                                                    <TableCell className="text-slate-600">{provider.email}</TableCell>
                                                    <TableCell className="text-slate-600">{provider.phone}</TableCell>
                                                    <TableCell className="text-slate-600">{provider.clinicAffiliation}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(provider.status)}>
                                                            {provider.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <TableRowActions
                                                                onView={() => handleViewProvider(provider)}
                                                                onEdit={() => handleEditProvider(provider)}
                                                                onDelete={() => handleDeleteProvider(provider._id)}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog */}
                <ViewProviderDialog
                    provider={selectedProvider}
                    isOpen={isViewOpen}
                    onClose={() => setIsViewOpen(false)}
                />
            </div>
        </ProtectedRoleGuard>

    )
}
