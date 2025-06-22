// "use client";

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//     BarChart3,
//     TrendingUp,
//     Users,
//     Calendar,
//     FileText,
//     Download,
//     Filter,
//     Activity,
//     DollarSign,
//     Clock,
//     AlertCircle,
//     Lock
// } from 'lucide-react';

// // Import components
// import { useAppSelector } from "@/src/redux/store/reduxHook";
// import { ReportsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/reports/page";
// import { useState, useEffect } from "react"
// import { RoleGuard } from '@/components/role-guard';

// export default function index({ dashboardId, role }: ReportsProps) {
//     const { user } = useAppSelector(state => state.auth)

//     const [dateRange, setDateRange] = useState('last-30-days');
//     const [reportType, setReportType] = useState('overview');

//     // Role-based permissions
//     const permissions = {
//         canCreateReports: ['admin', 'staff', 'doctor'].includes(user?.role || ''),
//         canUpdateReports: ['admin', 'staff', 'doctor'].includes(user?.role || ''),
//         canDeleteReports: ['admin'].includes(user?.role || ''), // Only admin can delete reports
//         canViewFinancialReports: ['admin', 'staff'].includes(user?.role || ''), // Doctor can't see invoices
//         canManagePatients: ['admin', 'staff'].includes(user?.role || ''), // Doctor can only view patients
//         canManageProviders: ['admin'].includes(user?.role || ''), // Only admin can manage providers
//         canManageMedicalRecords: ['admin', 'doctor'].includes(user?.role || ''), // Staff can only view
//         canManageAppointments: ['admin', 'staff'].includes(user?.role || '') // Doctor can only view
//     };

//     // Filter overview stats based on role
//     const getOverviewStats = () => {
//         const allStats = [
//             {
//                 title: "Total Patients",
//                 value: "1,234",
//                 change: "+12%",
//                 trend: "up",
//                 icon: Users,
//                 color: "text-blue-600",
//                 roles: ['admin', 'staff', 'doctor'] // All can see
//             },
//             {
//                 title: "Appointments Today",
//                 value: "45",
//                 change: "+5%",
//                 trend: "up",
//                 icon: Calendar,
//                 color: "text-green-600",
//                 roles: ['admin', 'staff', 'doctor'] // All can see
//             },
//             {
//                 title: "Revenue This Month",
//                 value: "$89,432",
//                 change: "+18%",
//                 trend: "up",
//                 icon: DollarSign,
//                 color: "text-emerald-600",
//                 roles: ['admin', 'staff'] // Doctor cannot see financial data
//             },
//             {
//                 title: "Average Wait Time",
//                 value: "12 min",
//                 change: "-3%",
//                 trend: "down",
//                 icon: Clock,
//                 color: "text-orange-600",
//                 roles: ['admin', 'staff', 'doctor'] // All can see
//             }
//         ];

//         return allStats.filter(stat => stat.roles.includes(user?.role || ''));
//     };

//     // Filter quick reports based on role
//     const getQuickReports = () => {
//         const allReports = [
//             {
//                 title: "Patient Demographics",
//                 description: "Age, gender, and location distribution",
//                 icon: Users,
//                 color: "bg-blue-50 text-blue-600",
//                 roles: ['admin', 'staff', 'doctor'],
//                 canGenerate: true
//             },
//             {
//                 title: "Appointment Trends",
//                 description: "Booking patterns and no-show rates",
//                 icon: Calendar,
//                 color: "bg-green-50 text-green-600",
//                 roles: ['admin', 'staff', 'doctor'],
//                 canGenerate: true
//             },
//             {
//                 title: "Revenue Analysis",
//                 description: "Income trends and payment methods",
//                 icon: DollarSign,
//                 color: "bg-emerald-50 text-emerald-600",
//                 roles: ['admin', 'staff'], // Doctor cannot access financial reports
//                 canGenerate: permissions.canViewFinancialReports
//             },
//             {
//                 title: "Medical Records Summary",
//                 description: "Diagnoses and treatment patterns",
//                 icon: FileText,
//                 color: "bg-purple-50 text-purple-600",
//                 roles: ['admin', 'doctor'], // Staff cannot generate medical records reports
//                 canGenerate: permissions.canManageMedicalRecords
//             },
//             {
//                 title: "Department Performance",
//                 description: "Efficiency and patient satisfaction",
//                 icon: Activity,
//                 color: "bg-orange-50 text-orange-600",
//                 roles: ['admin', 'staff'],
//                 canGenerate: ['admin', 'staff'].includes(user?.role || '')
//             },
//             {
//                 title: "Insurance Claims",
//                 description: "Processing times and approval rates",
//                 icon: AlertCircle,
//                 color: "bg-red-50 text-red-600",
//                 roles: ['admin', 'staff'], // Doctor cannot access insurance/financial data
//                 canGenerate: permissions.canViewFinancialReports
//             }
//         ];

//         return allReports.filter(report => report.roles.includes(user?.role || ''));
//     };

//     // State for API data
//     const [reportsData, setReportsData] = useState(null);
//     const [loading, setLoading] = useState(false);

//     // Function to fetch reports from API
//     const fetchReports = async () => {
//         setLoading(true);
//         try {
//             // Replace with your actual API endpoint
//             const response = await fetch('/api/reports');
//             const data = await response.json();
//             setReportsData(data);
//         } catch (error) {
//             console.error('Error fetching reports:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Filter reports based on role and report type
//     const getFilteredReports = (reports) => {
//         if (!reports || !reports.data) return [];

//         return reports.data.filter(report => {
//             // Filter based on report type and user role
//             const reportType = report.reportType?.toLowerCase() || '';

//             // Role-based filtering
//             if (user?.role === 'doctor') {
//                 // Doctor cannot see financial reports
//                 const financialKeywords = ['financial', 'revenue', 'billing', 'invoice', 'payment'];
//                 return !financialKeywords.some(keyword => 
//                     reportType.includes(keyword) || 
//                     report.title?.toLowerCase().includes(keyword) ||
//                     report.description?.toLowerCase().includes(keyword)
//                 );
//             }

//             if (user?.role === 'staff') {
//                 // Staff cannot see detailed medical/clinical reports
//                 const restrictedKeywords = ['medical records analysis', 'clinical', 'diagnosis'];
//                 return !restrictedKeywords.some(keyword => 
//                     reportType.includes(keyword) || 
//                     report.title?.toLowerCase().includes(keyword) ||
//                     report.description?.toLowerCase().includes(keyword)
//                 );
//             }

//             // Admin can see all reports
//             return true;
//         });
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Get status color
//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'generated':
//                 return 'bg-green-100 text-green-800';
//             case 'processing':
//                 return 'bg-yellow-100 text-yellow-800';
//             case 'failed':
//                 return 'bg-red-100 text-red-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     // Get report types based on role
//     const getReportTypes = () => {
//         const allTypes = [
//             { value: "overview", label: "Overview", roles: ['admin', 'staff', 'doctor'] },
//             { value: "patient", label: "Patient Analysis", roles: ['admin', 'staff', 'doctor'] },
//             { value: "financial", label: "Financial", roles: ['admin', 'staff'] }, // Doctor cannot access
//             { value: "operational", label: "Operational", roles: ['admin', 'staff'] },
//             { value: "clinical", label: "Clinical", roles: ['admin', 'doctor'] } // Staff cannot access detailed clinical
//         ];

//         return allTypes.filter(type => type.roles.includes(user?.role || ''));
//     };

//     const handleGenerateReport = (reportTitle: string) => {
//         if (!permissions.canCreateReports) {
//             console.log('Permission denied: Cannot create reports');
//             return;
//         }
//         console.log(`Generating report: ${reportTitle}`);
//         // API call would go here
//     };

//     const handleDownloadReport = (reportId: number) => {
//         console.log(`Downloading report: ${reportId}`);
//         // API call would go here
//     };

//     const handleDeleteReport = (reportId: number) => {
//         if (!permissions.canDeleteReports) {
//             console.log('Permission denied: Cannot delete reports');
//             return;
//         }
//         console.log(`Deleting report: ${reportId}`);
//         // API call would go here
//     };

//     const overviewStats = getOverviewStats();
//     const quickReports = getQuickReports();
//     const reportTypes = getReportTypes();
//     const filteredReports = getFilteredReports(reportsData);

//     // Load reports when component mounts
//     useEffect(() => {
//         fetchReports();
//     }, []);

//     return (
//         <div className="p-6 space-y-6">
//             {/* Header */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
//                     <p className="text-gray-600 mt-1">Generate and manage your healthcare reports</p>
//                     {user?.role && (
//                         <Badge className="mt-2">
//                             {user.role.toUpperCase()} Access Level
//                         </Badge>
//                     )}
//                 </div>
//                 <div className="flex gap-3">
//                     <Select value={dateRange} onValueChange={setDateRange}>
//                         <SelectTrigger className="w-40">
//                             <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="last-7-days">Last 7 days</SelectItem>
//                             <SelectItem value="last-30-days">Last 30 days</SelectItem>
//                             <SelectItem value="last-90-days">Last 90 days</SelectItem>
//                             <SelectItem value="last-year">Last year</SelectItem>
//                             <SelectItem value="custom">Custom range</SelectItem>
//                         </SelectContent>
//                     </Select>
//                     <Button className="flex items-center gap-2">
//                         <Filter className="h-4 w-4" />
//                         Filters
//                     </Button>
//                 </div>
//             </div>

//             {/* Overview Stats */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {overviewStats.map((stat, index) => {
//                     const IconComponent = stat.icon;
//                     return (
//                         <Card key={index}>
//                             <CardContent className="p-6">
//                                 <div className="flex items-center justify-between">
//                                     <div>
//                                         <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                                         <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//                                         <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
//                                             <TrendingUp className="h-3 w-3" />
//                                             {stat.change} from last period
//                                         </p>
//                                     </div>
//                                     <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
//                                         <IconComponent className="h-6 w-6" />
//                                     </div>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     );
//                 })}
//             </div>

//             {/* Main Content */}
//             <Tabs defaultValue="generate" className="space-y-6">
//                 <TabsList>
//                     <TabsTrigger value="generate">Generate Reports</TabsTrigger>
//                     <TabsTrigger value="recent">Recent Reports</TabsTrigger>
//                     <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
//                 </TabsList>

//                 {/* Generate Reports Tab */}
//                 <TabsContent value="generate" className="space-y-6">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <BarChart3 className="h-5 w-5" />
//                                 Quick Report Generation
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {quickReports.map((report, index) => {
//                                     const IconComponent = report.icon;
//                                     return (
//                                         <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                                             <div className={`inline-flex p-2 rounded-lg ${report.color} mb-3`}>
//                                                 <IconComponent className="h-5 w-5" />
//                                             </div>
//                                             <h3 className="font-semibold text-gray-900 mb-2">{report.title}</h3>
//                                             <p className="text-sm text-gray-600 mb-4">{report.description}</p>
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="w-full"
//                                                 onClick={() => handleGenerateReport(report.title)}
//                                                 disabled={!report.canGenerate}
//                                             >
//                                                 {report.canGenerate ? (
//                                                     "Generate Report"
//                                                 ) : (
//                                                     <>
//                                                         <Lock className="h-3 w-3 mr-2" />
//                                                         Restricted Access
//                                                     </>
//                                                 )}
//                                             </Button>
//                                         </div>
//                                     );
//                                 })}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Custom Report Builder */}
//                     {permissions.canCreateReports && (
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Custom Report Builder</CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
//                                         <Select value={reportType} onValueChange={setReportType}>
//                                             <SelectTrigger>
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {reportTypes.map((type) => (
//                                                     <SelectItem key={type.value} value={type.value}>
//                                                         {type.label}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
//                                         <Select defaultValue="pdf">
//                                             <SelectTrigger>
//                                                 <SelectValue />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="pdf">PDF</SelectItem>
//                                                 <SelectItem value="excel">Excel</SelectItem>
//                                                 <SelectItem value="csv">CSV</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                     <div>
//                                         <label className="text-sm font-medium text-gray-700 mb-2 block">Report Name</label>
//                                         <Input placeholder="Enter report name" />
//                                     </div>
//                                 </div>
//                                 <Button 
//                                     className="flex items-center gap-2"
//                                     onClick={() => handleGenerateReport('Custom Report')}
//                                 >
//                                     <FileText className="h-4 w-4" />
//                                     Generate Custom Report
//                                 </Button>
//                             </CardContent>
//                         </Card>
//                     )}
//                 </TabsContent>

//                 {/* Recent Reports Tab */}
//                 <TabsContent value="recent">
//                     <Card>
//                         <CardHeader>
//                             <div className="flex justify-between items-center">
//                                 <CardTitle>Recent Reports</CardTitle>
//                                 <Button variant="outline" onClick={fetchReports} disabled={loading}>
//                                     {loading ? 'Loading...' : 'Refresh'}
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {loading ? (
//                                 <div className="text-center py-8">
//                                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                                     <p className="text-gray-600">Loading reports...</p>
//                                 </div>
//                             ) : filteredReports.length === 0 ? (
//                                 <div className="text-center py-8">
//                                     <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
//                                     <p className="text-gray-600">No reports are available for your role.</p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {filteredReports.map((report) => (
//                                         <div key={report._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
//                                             <div className="flex items-center gap-4">
//                                                 <div className="p-2 bg-blue-50 rounded-lg">
//                                                     <FileText className="h-5 w-5 text-blue-600" />
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <h3 className="font-semibold text-gray-900">{report.title}</h3>
//                                                     <p className="text-sm text-gray-600">{report.description}</p>
//                                                     <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
//                                                         <span>Type: {report.reportType}</span>
//                                                         <span>Generated: {formatDate(report.createdAt)}</span>
//                                                         <span>By: {report.generatedByUserId?.username || report.createdBy}</span>
//                                                     </div>
//                                                     {report.dataFilters && (
//                                                         <div className="mt-2 text-xs text-gray-500">
//                                                             <span>Period: {report.dataFilters.startDate} to {report.dataFilters.endDate}</span>
//                                                             {report.dataFilters.status && (
//                                                                 <span className="ml-2">Status: {report.dataFilters.status}</span>
//                                                             )}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-3">
//                                                 <Badge className={getStatusColor(report.status)}>
//                                                     {report.status}
//                                                 </Badge>
//                                                 {report.status?.toLowerCase() === 'generated' && (
//                                                     <div className="flex gap-2">
//                                                         <Button
//                                                             variant="outline"
//                                                             size="sm"
//                                                             onClick={() => handleDownloadReport(report._id)}
//                                                         >
//                                                             <Download className="h-4 w-4 mr-2" />
//                                                             Download
//                                                         </Button>
//                                                         {permissions.canDeleteReports && (
//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 onClick={() => handleDeleteReport(report._id)}
//                                                                 className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                                             >
//                                                                 Delete
//                                                             </Button>
//                                                         )}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </TabsContent>

//                 {/* Scheduled Reports Tab */}
//                 <TabsContent value="scheduled">
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Scheduled Reports</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="text-center py-12">
//                                 <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Reports</h3>
//                                 <p className="text-gray-600 mb-4">Set up automated reports to be generated regularly</p>
//                                 {permissions.canCreateReports && (
//                                     <Button>Schedule New Report</Button>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>
//         </div>
//     )
// }

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
    Lock
} from 'lucide-react';

// Import components
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { ReportsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/reports/page";
import { useState, useEffect } from "react"
import { RoleGuard } from '@/components/role-guard';
import { Report, ReportsGetResponse } from './api/types';
import { fetchAllReports } from './api/slice';
import { useReportsFetcher } from './api/useReportsFetcher';

// Import your interfaces

// Additional types for component state
interface OverviewStat {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ComponentType<any>;
    color: string;
    roles: string[];
}

interface QuickReport {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    roles: string[];
    canGenerate: boolean;
}

interface ReportType {
    value: string;
    label: string;
    roles: string[];
}

export default function index({ dashboardId, role }: ReportsProps) {
    const dispatch = useAppDispatch()
    useReportsFetcher()
    const { user } = useAppSelector(state => state.auth)
    const { reports, lastFetchTime, loading } = useAppSelector(state => state.reports)
    const [dateRange, setDateRange] = useState<string>('last-30-days');
    const [reportType, setReportType] = useState<string>('overview');

    // Role-based permissions
    const permissions = {
        canCreateReports: ['admin', 'staff', 'doctor'].includes(user?.role || ''),
        canUpdateReports: ['admin', 'staff', 'doctor'].includes(user?.role || ''),
        canDeleteReports: ['admin'].includes(user?.role || ''), // Only admin can delete reports
        canViewFinancialReports: ['admin', 'staff'].includes(user?.role || ''), // Doctor can't see invoices
        canManagePatients: ['admin', 'staff'].includes(user?.role || ''), // Doctor can only view patients
        canManageProviders: ['admin'].includes(user?.role || ''), // Only admin can manage providers
        canManageMedicalRecords: ['admin', 'doctor'].includes(user?.role || ''), // Staff can only view
        canManageAppointments: ['admin', 'staff'].includes(user?.role || '') // Doctor can only view
    };

    // Filter overview stats based on role
    const getOverviewStats = (): OverviewStat[] => {
        const allStats: OverviewStat[] = [
            {
                title: "Total Patients",
                value: "1,234",
                change: "+12%",
                trend: "up",
                icon: Users,
                color: "text-blue-600",
                roles: ['admin', 'staff', 'doctor'] // All can see
            },
            {
                title: "Appointments Today",
                value: "45",
                change: "+5%",
                trend: "up",
                icon: Calendar,
                color: "text-green-600",
                roles: ['admin', 'staff', 'doctor'] // All can see
            },
            {
                title: "Revenue This Month",
                value: "$89,432",
                change: "+18%",
                trend: "up",
                icon: DollarSign,
                color: "text-emerald-600",
                roles: ['admin', 'staff'] // Doctor cannot see financial data
            },
            {
                title: "Average Wait Time",
                value: "12 min",
                change: "-3%",
                trend: "down",
                icon: Clock,
                color: "text-orange-600",
                roles: ['admin', 'staff', 'doctor'] // All can see
            }
        ];

        return allStats.filter(stat => stat.roles.includes(user?.role || ''));
    };

    // Filter quick reports based on role
    const getQuickReports = (): QuickReport[] => {
        const allReports: QuickReport[] = [
            {
                title: "Patient Demographics",
                description: "Age, gender, and location distribution",
                icon: Users,
                color: "bg-blue-50 text-blue-600",
                roles: ['admin', 'staff', 'doctor'],
                canGenerate: true
            },
            {
                title: "Appointment Trends",
                description: "Booking patterns and no-show rates",
                icon: Calendar,
                color: "bg-green-50 text-green-600",
                roles: ['admin', 'staff', 'doctor'],
                canGenerate: true
            },
            {
                title: "Revenue Analysis",
                description: "Income trends and payment methods",
                icon: DollarSign,
                color: "bg-emerald-50 text-emerald-600",
                roles: ['admin', 'staff'], // Doctor cannot access financial reports
                canGenerate: permissions.canViewFinancialReports
            },
            {
                title: "Medical Records Summary",
                description: "Diagnoses and treatment patterns",
                icon: FileText,
                color: "bg-purple-50 text-purple-600",
                roles: ['admin', 'doctor'], // Staff cannot generate medical records reports
                canGenerate: permissions.canManageMedicalRecords
            },
            {
                title: "Department Performance",
                description: "Efficiency and patient satisfaction",
                icon: Activity,
                color: "bg-orange-50 text-orange-600",
                roles: ['admin', 'staff'],
                canGenerate: ['admin', 'staff'].includes(user?.role || '')
            },
            {
                title: "Insurance Claims",
                description: "Processing times and approval rates",
                icon: AlertCircle,
                color: "bg-red-50 text-red-600",
                roles: ['admin', 'staff'], // Doctor cannot access insurance/financial data
                canGenerate: permissions.canViewFinancialReports
            }
        ];

        return allReports.filter(report => report.roles.includes(user?.role || ''));
    };

    // Function to fetch reports from API using Redux
    const handleFetchReports = (): void => {
        dispatch(fetchAllReports());
    };

    // Filter reports based on role and report type - now properly typed
    const getFilteredReports = (reports: ReportsGetResponse | null): Report[] => {
        if (!reports || !reports.data) return [];

        return reports.data.filter((report: Report) => {
            // Filter based on report type and user role
            const reportType = report.reportType?.toLowerCase() || '';

            // Role-based filtering
            if (user?.role === 'doctor') {
                // Doctor cannot see financial reports
                const financialKeywords = ['financial', 'revenue', 'billing', 'invoice', 'payment'];
                return !financialKeywords.some(keyword =>
                    reportType.includes(keyword) ||
                    report.title?.toLowerCase().includes(keyword) ||
                    report.description?.toLowerCase().includes(keyword)
                );
            }

            if (user?.role === 'staff') {
                // Staff cannot see detailed medical/clinical reports
                const restrictedKeywords = ['medical records analysis', 'clinical', 'diagnosis'];
                return !restrictedKeywords.some(keyword =>
                    reportType.includes(keyword) ||
                    report.title?.toLowerCase().includes(keyword) ||
                    report.description?.toLowerCase().includes(keyword)
                );
            }

            // Admin can see all reports
            return true;
        });
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status: string): string => {
        switch (status?.toLowerCase()) {
            case 'generated':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get report types based on role
    const getReportTypes = (): ReportType[] => {
        const allTypes: ReportType[] = [
            { value: "overview", label: "Overview", roles: ['admin', 'staff', 'doctor'] },
            { value: "patient", label: "Patient Analysis", roles: ['admin', 'staff', 'doctor'] },
            { value: "financial", label: "Financial", roles: ['admin', 'staff'] }, // Doctor cannot access
            { value: "operational", label: "Operational", roles: ['admin', 'staff'] },
            { value: "clinical", label: "Clinical", roles: ['admin', 'doctor'] } // Staff cannot access detailed clinical
        ];

        return allTypes.filter(type => type.roles.includes(user?.role || ''));
    };

    const handleGenerateReport = (reportTitle: string): void => {
        if (!permissions.canCreateReports) {
            console.log('Permission denied: Cannot create reports');
            return;
        }
        console.log(`Generating report: ${reportTitle}`);
        // API call would go here
    };

    const handleDownloadReport = (reportId: string): void => {
        console.log(`Downloading report: ${reportId}`);
        // API call would go here
    };

    const handleDeleteReport = (reportId: string): void => {
        if (!permissions.canDeleteReports) {
            console.log('Permission denied: Cannot delete reports');
            return;
        }
        console.log(`Deleting report: ${reportId}`);
        // API call would go here
    };

    const overviewStats = getOverviewStats();
    const quickReports = getQuickReports();
    const reportTypes = getReportTypes();
    const filteredReports = getFilteredReports({ data: reports });

    // Load reports when component mounts
    useEffect(() => {
        handleFetchReports();
    }, []);

    return (
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
                            <SelectItem value="custom">Custom range</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1 mt-1`}>
                                            <TrendingUp className="h-3 w-3" />
                                            {stat.change} from last period
                                        </p>
                                    </div>
                                    <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                                        <IconComponent className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content */}
            <Tabs defaultValue="generate" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="generate">Generate Reports</TabsTrigger>
                    <TabsTrigger value="recent">Recent Reports</TabsTrigger>
                    <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
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
                                                disabled={!report.canGenerate}
                                            >
                                                {report.canGenerate ? (
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
                            ) : reports.length === 0 ? (
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
                                                    {report.dataFilters && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            <span>Period: {report.dataFilters.startDate} to {report.dataFilters.endDate}</span>
                                                            {report.dataFilters.status && (
                                                                <span className="ml-2">Status: {report.dataFilters.status}</span>
                                                            )}
                                                        </div>
                                                    )}
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

                {/* Scheduled Reports Tab */}
                <TabsContent value="scheduled">
                    <Card>
                        <CardHeader>
                            <CardTitle>Scheduled Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Reports</h3>
                                <p className="text-gray-600 mb-4">Set up automated reports to be generated regularly</p>
                                {permissions.canCreateReports && (
                                    <Button>Schedule New Report</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}