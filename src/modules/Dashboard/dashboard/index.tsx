// "use client";
// import { memo, useCallback, useMemo, lazy, Suspense, RefAttributes, ForwardRefExoticComponent, useRef } from "react";
// import {
//     Calendar,
//     Users,
//     Plus,
//     DollarSign,
//     TrendingUp,
//     LucideProps,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"

// // Lazy load heavy components
// const DoctorProfileDialog = lazy(() =>
//     import("../doctor/organisms/DoctorProfileDialog").then(module => ({
//         default: module.DoctorProfileDialog
//     }))
// );

// // Import components
// import { RoleGuard } from "@/components/role-guard"
// import { getStatusBadgeVariant } from "@/src/constants"
// import { useGlobalUI } from "@/src/redux/providers/contexts/GlobalUIContext"
// import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { DashboardProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/dashboard/page";
// import { fetchAllMedicalRecord } from "../medicalRecords/api/slice";
// import { useAppointmentsFetcher } from "../appointments/api/useAppointmentsFetcher";
// import { useInvoiceFetcher } from "../billing/api/useInvoiceFetcher";
// import { usePatientsFetcher } from "../patients/api/usePatientsFetcher";
// import { Invoice } from "../billing/api/types";
// import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute";
// import { Appointment } from "../appointments/api/types";
// import { MedicalRecord } from "../medicalRecords/api/types";
// import { fetchAllAppointments } from "../appointments/api/slice";
// import { fetchAllInvoices } from "../billing/api/slice";
// import { fetchAllPatients } from "../patients/api/slice";
// import { shallowEqual } from "react-redux";
// import { useMedicalRecordsFetcher } from "../medicalRecords/api/useMedicalRecord";

// // Memoized components for better performance
// const StatsCard = memo(({ title, value, subtitle, icon: Icon, iconColor }: { title: string, value: number | string, icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>, subtitle: string, iconColor: string }) => (
//     <Card className="bg-white border border-slate-200">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
//             <Icon className={`h-4 w-4 ${iconColor}`} />
//         </CardHeader>
//         <CardContent>
//             <div className="text-2xl font-bold text-slate-900">{value}</div>
//             <p className="text-xs text-slate-500">{subtitle}</p>
//         </CardContent>
//     </Card>
// ));

// const AppointmentCard = memo(({ appointment }: { appointment: Appointment }) => (
//     <div
//         key={appointment._id}
//         className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
//     >
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//             <div>
//                 <p className="font-semibold text-lg text-slate-800">{appointment.patientName}</p>
//                 <p className="text-sm text-slate-600 mt-1">
//                     {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
//                 </p>
//                 <p className="text-xs text-slate-500 mt-0.5 italic">
//                     Reason: {appointment.reasonForVisit || "N/A"}
//                 </p>
//             </div>
//             <Badge className="min-w-[80px] justify-center" variant={getStatusBadgeVariant(appointment.status)}>
//                 {appointment.status}
//             </Badge>
//         </div>
//     </div>
// ));

// const MedicalRecordCard = memo(({ record, onViewAll }: { record: MedicalRecord, onViewAll: () => void; }) => (
//     <div key={record._id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//             <div>
//                 <p className="font-semibold text-lg text-slate-800">{record.patientId.fullName}</p>
//                 <p className="text-sm text-slate-600 mt-1">{record.diagnosis}</p>
//                 <p className="text-xs text-slate-500 mt-0.5 italic">Treatment: {record.treatment || "N/A"}</p>
//                 <p className="text-xs text-slate-400 mt-0.5">Date: {new Date(record.recordDate).toLocaleDateString()}</p>
//             </div>
//             <div className="text-right mt-2">
//                 <Button variant="link" className="text-blue-600" onClick={onViewAll}>
//                     View All Appointments →
//                 </Button>
//             </div>
//         </div>
//     </div>
// ));

// // Loading skeleton components
// const LoadingSkeleton = memo(() => (
//     <div className="space-y-3">
//         {[1, 2, 3].map((i) => (
//             <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
//                 <div className="flex justify-between items-center">
//                     <div className="space-y-2">
//                         <div className="h-4 bg-slate-300 rounded w-32"></div>
//                         <div className="h-3 bg-slate-300 rounded w-24"></div>
//                     </div>
//                     <div className="h-6 bg-slate-300 rounded w-16"></div>
//                 </div>
//             </div>
//         ))}
//     </div>
// ));

// function Dashboard({ dashboardId, role }: DashboardProps) {
//     const { user } = useAppSelector(state => state.auth);
//     const router = useRouter();
//     const dispatch = useAppDispatch();

//     const [showDoctorProfileDialog, setShowDoctorProfileDialog] = useState(false);

//     // Selectors with shallow equality check
//     const appointmentState = useAppSelector(state => ({
//         appointments: state.appointment.appointments,
//         loading: state.appointment.loading,
//         error: state.appointment.error,
//         count: state.appointment.count
//     }), shallowEqual);

//     const medicalRecordState = useAppSelector(state => ({
//         medicalRecords: state.medicalRecord.medicalRecords,
//         loading: state.medicalRecord.loading,
//         error: state.medicalRecord.error,
//         count: state.medicalRecord.count
//     }), shallowEqual);

//     const patientState = useAppSelector(state => ({
//         count: state.patients.count
//     }), shallowEqual);

//     const invoiceState = useAppSelector(state => ({
//         invoices: state.invoice.invoices,
//         isLoading: state.invoice.isLoadingInvoices
//     }), shallowEqual);


//     const { handleAddAppointment, handleAddInvoice, handleAddPatient, handleAddMedicalRecord } = useGlobalUI();



//     // Call hooks
//     useAppointmentsFetcher();
//     useMedicalRecordsFetcher();
//     useInvoiceFetcher();
//     usePatientsFetcher();

//     // Memoized calculations with proper dependencies
//     const revenueCalculations = useMemo(() => {
//         if (!invoiceState.invoices.length) {
//             return {
//                 current: 0,
//                 previous: 0,
//                 change: 0,
//                 changeText: '0% from last month'
//             };
//         }

//         const currentDate = new Date();
//         const currentMonth = currentDate.getMonth();
//         const currentYear = currentDate.getFullYear();

//         const previousMonth = currentMonth - 1;
//         const previousYear = previousMonth < 0 ? currentYear - 1 : currentYear;
//         const adjustedPreviousMonth = previousMonth < 0 ? 11 : previousMonth;

//         const currentMonthRevenue = invoiceState.invoices
//             .filter((invoice) => {
//                 if (invoice.status !== "Paid") return false;
//                 const issueDate = new Date(invoice.issueDate);
//                 return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
//             })
//             .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

//         const previousMonthRevenue = invoiceState.invoices
//             .filter((invoice) => {
//                 if (invoice.status !== "Paid") return false;
//                 const issueDate = new Date(invoice.issueDate);
//                 return issueDate.getMonth() === adjustedPreviousMonth && issueDate.getFullYear() === previousYear;
//             })
//             .reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);

//         const percentageChange = previousMonthRevenue === 0
//             ? (currentMonthRevenue > 0 ? 100 : 0)
//             : ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

//         return {
//             current: currentMonthRevenue,
//             previous: previousMonthRevenue,
//             change: percentageChange,
//             changeText: `${percentageChange >= 0 ? '+' : ''}${Math.round(percentageChange)}% from last month`
//         };
//     }, [invoiceState.invoices]);

//     // Memoized pending invoices count
//     const pendingInvoicesCount = useMemo(() =>
//         invoiceState.invoices.filter(invoice => invoice.status === "Pending").length,
//         [invoiceState.invoices]
//     );

//     // Memoized recent data
//     const recentAppointments = useMemo(() =>
//         appointmentState.appointments.slice(0, 3),
//         [appointmentState.appointments]
//     );

//     const recentMedicalRecords = useMemo(() =>
//         medicalRecordState.medicalRecords.slice(0, 3),
//         [medicalRecordState.medicalRecords]
//     );

//     // Memoized callback functions
//     const handleDoctorDialogClose = useCallback((open: boolean | ((prevState: boolean) => boolean)) => {
//         setShowDoctorProfileDialog(open);
//     }, []);

//     const handleViewAllAppointments = useCallback(() => {
//         router.push(`/${user?.id}/${user?.role}/appointments`);
//     }, [router, user?.id, user?.role]);

//     // Effects with proper dependencies
//     useEffect(() => {
//         if (user?.role === 'admin') {
//             setShowDoctorProfileDialog(true);
//         }
//     }, [user?.role]);

//     // Welcome message with memoization
//     const welcomeMessage = useMemo(() => {
//         const roleMessages = {
//             admin: "You have full access to all system features and user management.",
//             doctor: "Access patient records, appointments, and medical documentation.",
//             staff: "Manage appointments, patient check-ins, and basic records.",
//             patient: "Manage Patients"
//         };
//         return (user?.role && roleMessages[user.role]) || "";
//     }, [user?.role]);

//     return (
//         <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
//             {showDoctorProfileDialog ? (
//                 <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
//                     <DoctorProfileDialog
//                         mode="create"
//                         isOpen={showDoctorProfileDialog}
//                         onOpenChange={handleDoctorDialogClose}
//                         triggerButton={false}
//                     />
//                 </Suspense>
//             ) : (
//                 <div className="space-y-6">
//                     {/* Welcome Message */}
//                     <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
//                         <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.fullName}!</h2>
//                         <p className="opacity-90">{welcomeMessage}</p>
//                         {user?.department && (
//                             <p className="text-sm opacity-75 mt-1">Department: {user.department}</p>
//                         )}
//                     </div>

//                     {/* Stats Cards */}
//                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                         <StatsCard
//                             title="Total Patients"
//                             value={patientState.count}
//                             subtitle="Active patients in system"
//                             icon={Users}
//                             iconColor="text-blue-600"
//                         />

//                         <StatsCard
//                             title="Today's Appointments"
//                             value={appointmentState.count}
//                             subtitle="Scheduled for today"
//                             icon={Calendar}
//                             iconColor="text-green-600"
//                         />

//                         <RoleGuard allowedRoles={["admin", "staff"]}>
//                             <StatsCard
//                                 title="Pending Invoices"
//                                 value={pendingInvoicesCount}
//                                 subtitle="Awaiting payment"
//                                 icon={DollarSign}
//                                 iconColor="text-yellow-600"
//                             />
//                         </RoleGuard>

//                         <RoleGuard allowedRoles={["admin"]}>
//                             <Card className="bg-white border border-slate-200">
//                                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                                     <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
//                                     <TrendingUp className="h-4 w-4 text-purple-600" />
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="text-2xl font-bold text-slate-900">
//                                         ${revenueCalculations.current.toLocaleString('en-US', {
//                                             minimumFractionDigits: 2,
//                                             maximumFractionDigits: 2
//                                         })}
//                                     </div>
//                                     <p className={`text-xs ${revenueCalculations.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                         {revenueCalculations.changeText}
//                                     </p>
//                                 </CardContent>
//                             </Card>
//                         </RoleGuard>
//                     </div>

//                     {/* Quick Actions */}
//                     <Card className="bg-white border border-slate-200">
//                         <CardHeader>
//                             <CardTitle className="text-slate-900">Quick Actions</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                 <RoleGuard allowedRoles={['admin', 'staff']}>
//                                     <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700 text-white">
//                                         <Plus className="mr-2 h-4 w-4" />
//                                         Add Patient
//                                     </Button>
//                                 </RoleGuard>
//                                 <RoleGuard allowedRoles={['admin', 'staff']}>
//                                     <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700 text-white">
//                                         <Plus className="mr-2 h-4 w-4" />
//                                         Schedule Appointment
//                                     </Button>
//                                 </RoleGuard>
//                                 <RoleGuard allowedRoles={["admin", "doctor"]}>
//                                     <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
//                                         <Plus className="mr-2 h-4 w-4" />
//                                         Add Medical Record
//                                     </Button>
//                                 </RoleGuard>
//                                 <RoleGuard allowedRoles={["admin", "staff"]}>
//                                     <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700 text-white">
//                                         <Plus className="mr-2 h-4 w-4" />
//                                         Create Invoice
//                                     </Button>
//                                 </RoleGuard>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Recent Activity */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <Card className="bg-white border border-slate-200">
//                             <CardHeader>
//                                 <CardTitle className="text-slate-900">Recent Appointments</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 {appointmentState.loading ? (
//                                     <LoadingSkeleton />
//                                 ) : appointmentState.error ? (
//                                     <div className="text-center py-4 text-red-500">Error: {appointmentState.error}</div>
//                                 ) : (
//                                     <div className="space-y-3">
//                                         {recentAppointments.map((appointment) => (
//                                             <AppointmentCard key={appointment._id} appointment={appointment} />
//                                         ))}
//                                         {appointmentState.appointments.length === 0 && (
//                                             <div className="text-center py-4 text-slate-500">No appointments found</div>
//                                         )}
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>

//                         <RoleGuard allowedRoles={["admin", "doctor", 'staff']}>
//                             <Card className="bg-white border border-slate-200">
//                                 <CardHeader>
//                                     <CardTitle className="text-slate-900">Recent Medical Records</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     {medicalRecordState.loading ? (
//                                         <LoadingSkeleton />
//                                     ) : medicalRecordState.error ? (
//                                         <div className="text-center py-4 text-red-500">Error: {medicalRecordState.error}</div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             {recentMedicalRecords.map((record) => (
//                                                 <MedicalRecordCard
//                                                     key={record._id}
//                                                     record={record}
//                                                     onViewAll={handleViewAllAppointments}
//                                                 />
//                                             ))}
//                                             {medicalRecordState.medicalRecords.length === 0 && (
//                                                 <div className="text-center py-4 text-slate-500">No medical records found</div>
//                                             )}
//                                         </div>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </RoleGuard>
//                     </div>
//                 </div>
//             )}
//         </ProtectedRoleGuard>
//     );
// }

// export default memo(Dashboard);

"use client";
import { DashboardProps } from '@/app/(DASHBOARD)/[dashboardId]/[role]/dashboard/page'
import { ProtectedRoleGuard } from '@/src/redux/hook/ProtectedRoute'
import React from 'react'
import { useDashboardData } from './api/hook/useDashboardData';
import { UserRole } from '@/src/enum';
import { RoleGuard } from '@/components/role-guard';
import {
    Calendar,
    Users,
    Plus,
    DollarSign,
    TrendingUp,
    CalendarOff,
    FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getStatusBadgeVariant } from '@/src/constants';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';
import { QuickActionsSkeleton, RecentActivitySkeleton, Skeleton, StatCardSkeleton } from './atoms/skeletonLoading';
import { EmptyState } from './atoms/EmptyState';
import { useMedicalRecord } from '@/src/redux/providers/contexts/MedicalRecordContext';


const Dashboard = ({ dashboardId, role }: DashboardProps) => {
    const { data, loading, error } = useDashboardData(role as UserRole.ADMIN | UserRole.STAFF | UserRole.DOCTOR | UserRole.SUPER_ADMIN);
    const { handleAddAppointment, handleAddInvoice, handleAddPatient } = useGlobalUI()

    const {
        handleAddMedicalRecord,
    } = useMedicalRecord();

    const getStat = (label: string): number | string => {
        const match = data?.stats?.find((item) =>
            Object.keys(item).includes(label)
        );
        return match?.value ?? 0;
    };

    const getStatChange = (label: string): string | undefined => {
        const match = data?.stats?.find((item) =>
            Object.keys(item).includes(label)
        );
        return match?.change;
    };

    // Loading State
    if (loading) {
        return (
            <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
                <div className="p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Welcome Message Skeleton */}
                        <div className="bg-gradient-to-r from-slate-300 to-slate-400 rounded-lg p-6">
                            <Skeleton className="h-8 w-64 mb-2 bg-slate-400" />
                            <Skeleton className="h-4 w-96 mb-2 bg-slate-400" />
                            <Skeleton className="h-3 w-32 bg-slate-400" />
                        </div>

                        {/* Stats Cards Skeleton */}
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </div>

                        {/* Quick Actions Skeleton */}
                        <QuickActionsSkeleton />

                        {/* Recent Activity Skeleton */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RecentActivitySkeleton />
                            <RecentActivitySkeleton />
                        </div>
                    </div>
                </div>
            </ProtectedRoleGuard>
        );
    }


    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
            <div>
                {loading && <p>Loading dashboard...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {data && (
                    <div className="space-y-6">
                        {/* Welcome Message */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                            <h2 className="text-2xl font-bold mb-2">
                                {data.welcomeMessage}
                            </h2>
                            <p className="opacity-90">
                                {data.accessMessage}
                            </p>
                            {data.Department && <p className="text-sm opacity-75 mt-1">Department: {data.Department}</p>}
                        </div>

                        {/* Stats card */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600">Total Patients</CardTitle>
                                    <Users className="h-4 w-4 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {getStat("Total Patients")}
                                    </div>
                                    <p className="text-xs text-slate-500">Active patients in system</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border border-slate-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-600">Today's Appointments</CardTitle>
                                    <Calendar className="h-4 w-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-slate-900">
                                        {getStat("Total Appointments")}
                                    </div>
                                    <p className="text-xs text-slate-500">Scheduled for today</p>
                                </CardContent>
                            </Card>

                            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF]}>
                                <Card className="bg-white border border-slate-200">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-600">Pending Invoices</CardTitle>
                                        <DollarSign className="h-4 w-4 text-yellow-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {getStat("Pending Invoices")}
                                        </div>
                                        <p className="text-xs text-slate-500">Awaiting payment</p>
                                    </CardContent>
                                </Card>
                            </RoleGuard>

                            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                                <Card className="bg-white border border-slate-200">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-slate-600">Revenue This Month</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {getStat("Revenue This Month")}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {getStatChange("Revenue This Month")}
                                        </p>
                                    </CardContent>
                                </Card>
                            </RoleGuard>
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
                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN]}>
                                        <Button onClick={handleAddMedicalRecord} className="bg-purple-600 hover:bg-purple-700 text-white">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Medical Record
                                        </Button>
                                    </RoleGuard>
                                    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.STAFF]}>
                                        <Button onClick={handleAddInvoice} className="bg-orange-600 hover:bg-orange-700 text-white">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Invoice
                                        </Button>
                                    </RoleGuard>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Appointments */}
                            <Card className="bg-white border border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Recent Appointments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {data.recentAppointments && data.recentAppointments.length > 0 ? (
                                        <div className="space-y-3">
                                            {data.recentAppointments.slice(0, 3).map((appointment) => (
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
                                    ) : (
                                        <EmptyState
                                            icon={CalendarOff}
                                            title="No Recent Appointments"
                                            description="No appointments have been scheduled recently. Schedule your first appointment to get started."
                                            actionText="Schedule Appointment"
                                            onAction={handleAddAppointment}
                                        />
                                    )}
                                </CardContent>
                            </Card>

                            <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN]}>
                                <Card className="bg-white border border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="text-slate-900">Recent Medical Records</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {data.recentMedicalRecords && data.recentMedicalRecords.length > 0 ? (
                                            <div className="space-y-3">
                                                {data.recentMedicalRecords.slice(0, 3).map((record, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-slate-900">{record.patientName?.fullName}</p>
                                                            <p className="text-sm text-slate-500">{record.diagnosis}</p>
                                                            <p className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
                                                        </div>
                                                        {/* <Badge variant={getStatusBadgeVariant(record?.status)}>{record?.status}</Badge> */}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <EmptyState
                                                icon={FileText}
                                                title="No Medical Records"
                                                description="No medical records have been created yet. Add your first medical record to get started."
                                                actionText="Add Medical Record"
                                                onAction={handleAddMedicalRecord}
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </RoleGuard>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoleGuard>
    )
}

export default Dashboard
