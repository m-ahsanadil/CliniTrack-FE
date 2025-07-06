"use client"
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Building2, Activity, DollarSign, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { SystemAnalyticsProps } from '@/app/(DASHBOARD)/[dashboardId]/[role]/(SUPER-ADMIN)/analytics/page';

export default function index({ dashboardId, role }: SystemAnalyticsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [selectedMetric, setSelectedMetric] = useState('overview');

    const stats = [
        {
            title: 'Total Organizations',
            value: '1,247',
            change: '+12.5%',
            trend: 'up',
            icon: Building2,
            color: 'bg-blue-500'
        },
        {
            title: 'Active Users',
            value: '45,678',
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'bg-green-500'
        },
        {
            title: 'Monthly Revenue',
            value: '$234,567',
            change: '+15.3%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-yellow-500'
        },
        {
            title: 'System Uptime',
            value: '99.98%',
            change: '+0.02%',
            trend: 'up',
            icon: Activity,
            color: 'bg-purple-500'
        }
    ];

    const organizationData = [
        { name: 'City General Hospital', users: 1245, revenue: '$45,678', status: 'Active', growth: '+12%' },
        { name: 'Metro Health Center', users: 892, revenue: '$32,145', status: 'Active', growth: '+8%' },
        { name: 'Community Clinic', users: 567, revenue: '$18,923', status: 'Active', growth: '+15%' },
        { name: 'Regional Medical', users: 1034, revenue: '$38,456', status: 'Active', growth: '+5%' },
        { name: 'Downtown Health', users: 723, revenue: '$25,789', status: 'Active', growth: '+18%' }
    ];

    const userRoleData = [
        { role: 'Patients', count: 28456, percentage: 62.3, color: 'bg-blue-500' },
        { role: 'Doctors', count: 8934, percentage: 19.6, color: 'bg-green-500' },
        { role: 'Staff', count: 5678, percentage: 12.4, color: 'bg-yellow-500' },
        { role: 'Admins', count: 2610, percentage: 5.7, color: 'bg-purple-500' }
    ];

    const recentActivity = [
        { action: 'New organization registered', org: 'Sunset Medical Center', time: '2 hours ago', type: 'success' },
        { action: 'System maintenance completed', org: 'System Wide', time: '4 hours ago', type: 'info' },
        { action: 'High user activity detected', org: 'City General Hospital', time: '6 hours ago', type: 'warning' },
        { action: 'Monthly backup completed', org: 'System Wide', time: '1 day ago', type: 'success' },
        { action: 'License renewal required', org: 'Metro Health Center', time: '2 days ago', type: 'alert' }
    ];

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>

            <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
                        <p className="text-gray-600">Monitor system-wide performance and insights</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="1y">Last year</option>
                        </select>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Download className="w-4 h-4" />
                            Export Report
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-gray-600 text-sm">{stat.title}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Distribution */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution by Role</h3>
                        <div className="space-y-4">
                            {userRoleData.map((role, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                                        <span className="text-gray-700 font-medium">{role.role}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-semibold text-gray-900">{role.count.toLocaleString()}</div>
                                        <div className="text-sm text-gray-500">{role.percentage}%</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
                        <div className="h-48 flex items-end justify-between gap-2">
                            {[65, 78, 82, 90, 75, 88, 95, 82, 90, 85, 92, 98].map((height, index) => (
                                <div key={index} className="flex-1 bg-blue-200 rounded-t-sm" style={{ height: `${height}%` }}>
                                    <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: '60%' }}></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-sm text-gray-500">
                            <span>Jan</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Top Organizations */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Top Performing Organizations</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {organizationData.map((org, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{org.name}</div>
                                                <div className="text-sm text-gray-500">{org.status}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.users}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{org.revenue}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-green-600">{org.growth}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Recent System Activity</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'success' ? 'bg-green-500' :
                                            activity.type === 'warning' ? 'bg-yellow-500' :
                                                activity.type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">{activity.org}</span>
                                                <span className="text-xs text-gray-400">•</span>
                                                <span className="text-xs text-gray-500">{activity.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </ProtectedRoleGuard>
    )
}
