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
    AlertCircle
} from 'lucide-react';

// Import components
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { ReportsProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/reports/page";
import { useState } from 'react';


export default function index({ dashboardId, role }: ReportsProps) {
    const { user } = useAppSelector(state => state.auth)

    const [dateRange, setDateRange] = useState('last-30-days');
    const [reportType, setReportType] = useState('overview');

    // Sample data - replace with real data from your API
    const overviewStats = [
        {
            title: "Total Patients",
            value: "1,234",
            change: "+12%",
            trend: "up",
            icon: Users,
            color: "text-blue-600"
        },
        {
            title: "Appointments Today",
            value: "45",
            change: "+5%",
            trend: "up",
            icon: Calendar,
            color: "text-green-600"
        },
        {
            title: "Revenue This Month",
            value: "$89,432",
            change: "+18%",
            trend: "up",
            icon: DollarSign,
            color: "text-emerald-600"
        },
        {
            title: "Average Wait Time",
            value: "12 min",
            change: "-3%",
            trend: "down",
            icon: Clock,
            color: "text-orange-600"
        }
    ];

    const recentReports = [
        {
            id: 1,
            name: "Monthly Patient Summary",
            type: "Patient Report",
            generatedAt: "2024-06-20 14:30",
            status: "completed",
            size: "2.3 MB"
        },
        {
            id: 2,
            name: "Appointment Analytics",
            type: "Analytics Report",
            generatedAt: "2024-06-19 09:15",
            status: "completed",
            size: "1.8 MB"
        },
        {
            id: 3,
            name: "Revenue Report Q2",
            type: "Financial Report",
            generatedAt: "2024-06-18 16:45",
            status: "processing",
            size: "3.1 MB"
        },
        {
            id: 4,
            name: "Department Performance",
            type: "Performance Report",
            generatedAt: "2024-06-17 11:20",
            status: "completed",
            size: "4.2 MB"
        }
    ];

    const quickReports = [
        {
            title: "Patient Demographics",
            description: "Age, gender, and location distribution",
            icon: Users,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Appointment Trends",
            description: "Booking patterns and no-show rates",
            icon: Calendar,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Revenue Analysis",
            description: "Income trends and payment methods",
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            title: "Medical Records Summary",
            description: "Diagnoses and treatment patterns",
            icon: FileText,
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Department Performance",
            description: "Efficiency and patient satisfaction",
            icon: Activity,
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "Insurance Claims",
            description: "Processing times and approval rates",
            icon: AlertCircle,
            color: "bg-red-50 text-red-600"
        }
    ];

    const handleGenerateReport = (reportTitle: string) => {
        // Add your report generation logic here
        console.log(`Generating report: ${reportTitle}`);
        // You would typically call an API to generate the report
    };

    const handleDownloadReport = (reportId: number) => {
        // Add your download logic here
        console.log(`Downloading report: ${reportId}`);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                    <p className="text-gray-600 mt-1">Generate and manage your healthcare reports</p>
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
                                            >
                                                Generate Report
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Custom Report Builder */}
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
                                            <SelectItem value="overview">Overview</SelectItem>
                                            <SelectItem value="patient">Patient Analysis</SelectItem>
                                            <SelectItem value="financial">Financial</SelectItem>
                                            <SelectItem value="operational">Operational</SelectItem>
                                            <SelectItem value="clinical">Clinical</SelectItem>
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
                            <Button className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Generate Custom Report
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recent Reports Tab */}
                <TabsContent value="recent">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentReports.map((report) => (
                                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{report.name}</h3>
                                                <p className="text-sm text-gray-600">{report.type} • {report.size}</p>
                                                <p className="text-xs text-gray-500">Generated on {report.generatedAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={report.status === 'completed' ? 'default' : 'secondary'}
                                                className={report.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                            >
                                                {report.status}
                                            </Badge>
                                            {report.status === 'completed' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownloadReport(report.id)}
                                                >
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Download
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                <Button>Schedule New Report</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
