"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    FileText,
    Download,
    Filter,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { useState, useEffect } from "react"
import { fetchAllReports } from './api/slice';
import { useReportsFetcher } from './api/useReportsFetcher';
import { ProtectedRoleGuard } from '@/src/redux/hook/ProtectedRoute';
import { formatDate } from "@/src/utils/dateFormatter"
import { UserRole, ReportStatus, ReportType, ReportStatusValues, ReportTypeValues } from '@/src/enum';
import { ReportsProps } from '@/app/(DASHBOARD)/[role]/reports/page';
import { Textarea } from '@/components/ui/textarea';
import { CreateReportTab } from './organisms/CreateReportTab';
import { GetAllReports } from './api/types';
import { RecentReportTab } from './organisms/RecentReportTab';
import { GenerateReportTab } from './organisms/GenerateReportTab';
import { useReport } from '@/src/redux/providers/contexts/ReportContext';


interface QuickReport {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    roles: string[];
}

export default function Reports({ role }: ReportsProps) {
    // Custom hook for fetching appointments
    const dispatch = useAppDispatch()
    useReportsFetcher();
    const { user } = useAppSelector(state => state.auth);
    const [dateRange, setDateRange] = useState<string>('last-30-days');
    const [activeTab, setActiveTab] = useState<string>('generate');
    const { isEditing, setIsEditing, setReport, setReportFormOpen } = useReport();

    // Function to switch to create/edit tab
    const handleSwitchToEdit = () => {
        setActiveTab('create');
    };

    // Function to handle create new report
    const handleCreateNew = () => {
        setReport(null);
        setIsEditing(false);
        setReportFormOpen(true);
        setActiveTab('create');
    };


    const getCreateTabTitle = () => {
        return isEditing ? 'Edit Report' : 'Create Report';
    };

    return (
        <ProtectedRoleGuard role={role}>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
                        <p className="text-gray-600 mt-1">Generate and manage your healthcare reports</p>
                        {user?.role && (
                            <Badge className="mt-2">
                                {user.role.toUpperCase()} Access Level
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                                <SelectItem value="last-90-days">Last 90 days</SelectItem>
                                <SelectItem value="last-year">Last year</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="flex items-center gap-2 w-full sm:w-auto">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                        <Button
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        >
                            <FileText className="h-4 w-4" />
                            Create New Report
                        </Button>
                    </div>
                </div>
                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
                    <TabsList>
                        <TabsTrigger value="generate">Generate Reports</TabsTrigger>
                        <TabsTrigger value="recent">Recent Reports</TabsTrigger>
                        <TabsTrigger value="create">{getCreateTabTitle()}</TabsTrigger>
                    </TabsList>

                    {/* Generate Reports Tab */}
                    <TabsContent value="generate" className="space-y-6">
                        <GenerateReportTab />
                    </TabsContent>

                    {/* Recent Reports Tab */}
                    <TabsContent value="recent">
                        <RecentReportTab onSwitchToEdit={handleSwitchToEdit} />
                    </TabsContent>

                    {/* Create Report Tab */}
                    <TabsContent value="create" className="space-y-6">
                        <CreateReportTab onCancel={() => setActiveTab('recent')} />
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoleGuard>
    )
}