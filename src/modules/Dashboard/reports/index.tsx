"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    TrendingUp,
    Users,
    Calendar,
    FileText,
    Download,
    Filter,
    Activity,
    DollarSign,
    Clock,
    AlertCircle,
    Lock,
    Shield
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { ReportsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/reports/page";
import { useState, useEffect } from "react"
import { Report, ReportsGetResponse } from './api/types';
import { fetchAllReports } from './api/slice';
import { useReportsFetcher } from './api/useReportsFetcher';
import { useAppointmentsFetcher } from '../appointments/api/useAppointmentsFetcher';
import { useInvoiceFetcher } from '../billing/api/useInvoiceFetcher';
import { useMedicalRecordsFetcher } from '../medicalRecords/api/useMedicalRecord';
import { usePatientsFetcher } from '../patients/api/usePatientsFetcher';
import { useRouter } from 'next/navigation';
import { ProtectedRoleGuard } from '@/src/redux/hook/ProtectedRoute';
import { formatDate } from "@/src/utils/dateFormatter"


interface QuickReport {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    roles: string[];
}

interface ReportType {
    value: string;
    label: string;
    roles: string[];
}

export default function Reports({ dashboardId, role }: ReportsProps) {
    // Custom hook for fetching appointments
    const dispatch = useAppDispatch()
    useReportsFetcher();
    const { user } = useAppSelector(state => state.auth);


    const { reports, loading } = useAppSelector(state => state.reports)
    const [dateRange, setDateRange] = useState<string>('last-30-days');
    const [reportType, setReportType] = useState<string>('overview');

    // Role-based permissions
    const permissions = {
        canCreateReports: ['admin', 'staff', 'doctor'].includes(user?.role || ''),
        canDeleteReports: ['admin'].includes(user?.role || ''),
        canViewFinancialReports: ['admin', 'staff'].includes(user?.role || ''),
        canViewMedicalReports: ['admin', 'doctor'].includes(user?.role || '')
    };

    // Quick reports configuration
    const quickReports: QuickReport[] = [
        {
            title: "Patient Demographics",
            description: "Age, gender, and location distribution",
            icon: Users,
            color: "bg-blue-50 text-blue-600",
            roles: ['admin', 'staff', 'doctor']
        },
        {
            title: "Appointment Trends",
            description: "Booking patterns and no-show rates",
            icon: Calendar,
            color: "bg-green-50 text-green-600",
            roles: ['admin', 'staff', 'doctor']
        },
        {
            title: "Revenue Analysis",
            description: "Income trends and payment methods",
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600",
            roles: ['admin', 'staff']
        },
        {
            title: "Medical Records Summary",
            description: "Diagnoses and treatment patterns",
            icon: FileText,
            color: "bg-purple-50 text-purple-600",
            roles: ['admin', 'doctor']
        },
        {
            title: "Department Performance",
            description: "Efficiency and patient satisfaction",
            icon: Activity,
            color: "bg-orange-50 text-orange-600",
            roles: ['admin', 'staff']
        },
        {
            title: "Insurance Claims",
            description: "Processing times and approval rates",
            icon: AlertCircle,
            color: "bg-red-50 text-red-600",
            roles: ['admin', 'staff']
        }
    ].filter(report => report.roles.includes(user?.role || ''));

    // Report types based on role
    const reportTypes: ReportType[] = [
        { value: "overview", label: "Overview", roles: ['admin', 'staff', 'doctor'] },
        { value: "patient", label: "Patient Analysis", roles: ['admin', 'staff', 'doctor'] },
        { value: "financial", label: "Financial", roles: ['admin', 'staff'] },
        { value: "operational", label: "Operational", roles: ['admin', 'staff'] },
        { value: "clinical", label: "Clinical", roles: ['admin', 'doctor'] }
    ].filter(type => type.roles.includes(user?.role || ''));

    // Filter reports based on role
    const getFilteredReports = (): Report[] => {
        if (!reports || reports.length === 0) return [];

        return reports.filter((report: Report) => {
            const reportType = report.reportType?.toLowerCase() || '';
            const title = report.title?.toLowerCase() || '';
            const description = report.description?.toLowerCase() || '';

            if (user?.role === 'doctor') {
                const financialKeywords = ['financial', 'revenue', 'billing', 'invoice', 'payment'];
                return !financialKeywords.some(keyword =>
                    reportType.includes(keyword) || title.includes(keyword) || description.includes(keyword)
                );
            }

            if (user?.role === 'staff') {
                const restrictedKeywords = ['medical records analysis', 'clinical', 'diagnosis'];
                return !restrictedKeywords.some(keyword =>
                    reportType.includes(keyword) || title.includes(keyword) || description.includes(keyword)
                );
            }

            return true; // Admin can see all
        });
    };



    const getStatusColor = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'generated': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Event handlers
    const handleFetchReports = (): void => {
        dispatch(fetchAllReports());
    };

    const handleGenerateReport = (reportTitle: string): void => {
        if (!permissions.canCreateReports) {
            console.log('Permission denied: Cannot create reports');
            return;
        }
        console.log(`Generating report: ${reportTitle}`);
        // API call implementation
    };

    const handleDownloadReport = (reportId: string): void => {
        console.log(`Downloading report: ${reportId}`);
        // API call implementation
    };

    const handleDeleteReport = (reportId: string): void => {
        if (!permissions.canDeleteReports) {
            console.log('Permission denied: Cannot delete reports');
            return;
        }
        console.log(`Deleting report: ${reportId}`);
        // API call implementation
    };

    const filteredReports = getFilteredReports();

    // Load reports on mount
    useEffect(() => {
        handleFetchReports();
    }, []);

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-600 mt-1">Generate and manage your healthcare reports</p>
                        {user?.role && (
                            <Badge className="mt-2">
                                {user.role.toUpperCase()} Access Level
                            </Badge>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                                <SelectItem value="last-year">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs defaultValue="generate" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="generate">Generate Reports</TabsTrigger>
                        <TabsTrigger value="recent">Recent Reports</TabsTrigger>
                    </TabsList>

                    {/* Generate Reports Tab */}
                    <TabsContent value="generate" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    Quick Report Generation
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {quickReports.map((report, index) => {
                                        const IconComponent = report.icon;
                                        const canGenerate = report.roles.includes(user?.role || '');

                                        return (
                                            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className={`inline-flex p-2 rounded-lg ${report.color} mb-3`}>
                                                    <IconComponent className="h-5 w-5" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
                                                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full"
                                                    onClick={() => handleGenerateReport(report.title)}
                                                    disabled={!canGenerate}
                                                >
                                                    {canGenerate ? (
                                                        "Generate Report"
                                                    ) : (
                                                        <>
                                                            <Lock className="h-3 w-3 mr-2" />
                                                            Restricted Access
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Custom Report Builder */}
                        {permissions.canCreateReports && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Custom Report Builder</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
                                            <Select value={reportType} onValueChange={setReportType}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {reportTypes.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                                            <Select defaultValue="pdf">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pdf">PDF</SelectItem>
                                                    <SelectItem value="excel">Excel</SelectItem>
                                                    <SelectItem value="csv">CSV</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Report Name</label>
                                            <Input placeholder="Enter report name" />
                                        </div>
                                    </div>
                                    <Button
                                        className="flex items-center gap-2"
                                        onClick={() => handleGenerateReport('Custom Report')}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Generate Custom Report
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Recent Reports Tab */}
                    <TabsContent value="recent">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Recent Reports</CardTitle>
                                    <Button onClick={handleFetchReports} disabled={loading}>
                                        {loading ? 'Loading...' : 'Refresh'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <p className="text-gray-600">Loading reports...</p>
                                    </div>
                                ) : filteredReports.length === 0 ? (
                                    <div className="text-center py-8">
                                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
                                        <p className="text-gray-600">No reports are available for your role.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredReports.map((report: Report) => (
                                            <div key={report._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                                        <p className="text-sm text-gray-600">{report.description}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                            <span>Type: {report.reportType}</span>
                                                            <span>Generated: {formatDate(report.createdAt)}</span>
                                                            <span>By: {report.generatedByUserId?.username || report.createdBy}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={getStatusColor(report.status)}>
                                                        {report.status}
                                                    </Badge>
                                                    {report.status?.toLowerCase() === 'generated' && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDownloadReport(report._id)}
                                                            >
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </Button>
                                                            {permissions.canDeleteReports && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteReport(report._id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    Delete
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoleGuard>
    )
}