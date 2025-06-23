"use client"

import {
    Plus,
    Edit,
    Trash2,
    Eye,
    Shield,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Import form components
import { getStatusBadgeVariant } from "@/src/constants"
import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { AppointmentProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/appointments/page"
import { RoleGuard } from "@/components/role-guard"
import { SetStateAction, useEffect, useState } from "react"
import { useInvoiceFetcher } from "../billing/api/useInvoiceFetcher"
import { useReportsFetcher } from "../reports/api/useReportsFetcher"
import { usePatientsFetcher } from "../patients/api/usePatientsFetcher"
// Import components
import { ProviderProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/providers/page";
import { ViewAppointmentDialog } from "../appointments/organisms/ViewAppointmentDialog";
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { useProviderFetcher } from "./api/useProviderFetcher"
import { Provider } from "./api/types"
import { ViewProviderDialog } from "./organisms/ViewProvidersDialog"
import { deleteProvider, fetchAllProviders } from "./api/slice"


export default function index({ dashboardId, role }: ProviderProps) {
    useProviderFetcher();
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)
    const { provider: apiProvider } = useAppSelector(state => state.provider)

    const [updateProviderFormOpen, setUpdateProviderFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Provider | null>(null);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleAddProvider = () => { }

    const handleEditProvider = (provider: Provider) => { }

    const handleDeleteProvider = async(_id: string) => {
        await dispatch(deleteProvider(_id)).unwrap();
        dispatch(fetchAllProviders());
    }

    const handleViewProvider = (provider: Provider) => {
        setSelectedProvider(provider);
        setIsViewOpen(true);
    }

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Providers</h2>
                        {user?.role === 'admin' ? (
                            <p className="text-slate-600">Manage your clinic’s healthcare providers.</p>

                        ) : (
                            <p className="text-slate-600">View appointments by provider.</p>
                        )}


                    </div>
                    <RoleGuard allowedRoles={['admin', 'staff']}>
                        <Button onClick={handleAddProvider} className="bg-green-600 hover:bg-green-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Schedule Provider
                        </Button>
                    </RoleGuard>
                </div>

                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
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
                                                <p className="text-sm text-slate-400">Start by adding a new provider to your clinic.</p>
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
                                                <Badge variant={getStatusBadgeVariant(provider.status)}>{provider.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button variant="ghost" onClick={() => handleViewProvider(provider)} size="sm" className="text-slate-600 hover:text-slate-900">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <RoleGuard allowedRoles={['admin', 'staff']}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditProvider(provider)}
                                                            className="text-slate-600 hover:text-slate-900"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </RoleGuard>
                                                    <RoleGuard allowedRoles={['admin']}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteProvider(provider._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </RoleGuard>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>
            </div>
            <ViewProviderDialog
                provider={selectedProvider}
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
            />
            {/* <ProviderForm
                open={updateProviderFormOpen}
                provider={editingItem}
                onOpenChange={setUpdateAppointmentFormOpen}
                mode={"edit"}
                onSave={handleUpdatedAppointment}
            /> */}
        </ProtectedRoleGuard>
    )
}
