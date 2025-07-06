"use client";
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import {
    Users, Building2, Calendar, DollarSign, TrendingUp,
    Settings, Plus, Edit, Trash2, Eye, Search, Filter,
    Activity, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

// Mock data
const systemMetrics = {
    totalClinics: 45,
    totalPatients: 12847,
    totalDoctors: 234,
    monthlyRevenue: 2450000,
    activeAppointments: 1247,
    pendingApprovals: 12
};

const monthlyData = [
    { month: 'Jan', revenue: 2100000, patients: 1100, appointments: 950 },
    { month: 'Feb', revenue: 2200000, patients: 1200, appointments: 1050 },
    { month: 'Mar', revenue: 2300000, patients: 1150, appointments: 1100 },
    { month: 'Apr', revenue: 2400000, patients: 1300, appointments: 1200 },
    { month: 'May', revenue: 2350000, patients: 1250, appointments: 1150 },
    { month: 'Jun', revenue: 2450000, patients: 1350, appointments: 1247 }
];

const clinicStatusData = [
    { name: 'Active', value: 38, color: '#10b981' },
    { name: 'Pending', value: 5, color: '#f59e0b' },
    { name: 'Inactive', value: 2, color: '#ef4444' }
];

const clinicsData = [
    { id: 1, name: 'Metro General Hospital', location: 'Downtown', doctors: 45, patients: 2500, status: 'Active', revenue: 450000 },
    { id: 2, name: 'Sunrise Medical Center', location: 'Northside', doctors: 32, patients: 1800, status: 'Active', revenue: 320000 },
    { id: 3, name: 'Valley Health Clinic', location: 'Westside', doctors: 28, patients: 1500, status: 'Pending', revenue: 280000 },
    { id: 4, name: 'Oceanview Hospital', location: 'Coastal', doctors: 52, patients: 3200, status: 'Active', revenue: 580000 },
    { id: 5, name: 'Pine Tree Medical', location: 'Suburbs', doctors: 18, patients: 950, status: 'Inactive', revenue: 150000 }
];

import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { ClinicManagementProps } from '@/app/(DASHBOARD)/[dashboardId]/[role]/(SUPER-ADMIN)/clinic-management/page';

export default function index({ dashboardId, role }: ClinicManagementProps) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClinic, setSelectedClinic] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const filteredClinics = clinicsData.filter(clinic =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clinic.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, title, value, change, color }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {change && (
                        <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}{change}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const ClinicCard = ({ clinic }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-sm text-gray-500">{clinic.location}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${clinic.status === 'Active' ? 'bg-green-100 text-green-700' :
                        clinic.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {clinic.status}
                    </span>
                    <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-500">
                            <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-500">
                            <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <p className="text-sm text-gray-500">Doctors</p>
                    <p className="text-lg font-semibold">{clinic.doctors}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500">Patients</p>
                    <p className="text-lg font-semibold">{clinic.patients}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-lg font-semibold">${clinic.revenue.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                    View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Manage
                </button>
            </div>
        </div>
    );

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Clinic Management System</h1>
                                <p className="text-sm text-gray-500">Super Admin Dashboard</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                                    <Plus className="w-4 h-4" />
                                    <span>Add Clinic</span>
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <Settings className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white border-b border-gray-200">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                                { id: 'clinics', label: 'Clinics', icon: Building2 },
                                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                                { id: 'approvals', label: 'Approvals', icon: CheckCircle }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* System Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                                <StatCard
                                    icon={Building2}
                                    title="Total Clinics"
                                    value={systemMetrics.totalClinics}
                                    change={8.2}
                                    color="bg-blue-500"
                                />
                                <StatCard
                                    icon={Users}
                                    title="Total Patients"
                                    value={systemMetrics.totalPatients.toLocaleString()}
                                    change={12.5}
                                    color="bg-green-500"
                                />
                                <StatCard
                                    icon={Users}
                                    title="Total Doctors"
                                    value={systemMetrics.totalDoctors}
                                    change={5.3}
                                    color="bg-purple-500"
                                />
                                <StatCard
                                    icon={DollarSign}
                                    title="Monthly Revenue"
                                    value={`$${(systemMetrics.monthlyRevenue / 1000000).toFixed(1)}M`}
                                    change={15.8}
                                    color="bg-yellow-500"
                                />
                                <StatCard
                                    icon={Calendar}
                                    title="Active Appointments"
                                    value={systemMetrics.activeAppointments}
                                    change={-2.1}
                                    color="bg-indigo-500"
                                />
                                <StatCard
                                    icon={Clock}
                                    title="Pending Approvals"
                                    value={systemMetrics.pendingApprovals}
                                    color="bg-red-500"
                                    change={undefined} />
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Revenue ($)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-4">Clinic Status Distribution</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={clinicStatusData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }) => `${name}: ${value}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {clinicStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Patient & Appointment Trends */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold mb-4">Patient & Appointment Trends</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="patients" fill="#10b981" name="New Patients" />
                                        <Bar dataKey="appointments" fill="#f59e0b" name="Appointments" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'clinics' && (
                        <div className="space-y-6">
                            {/* Search and Filters */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search clinics..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <Filter className="w-4 h-4" />
                                            <span>Filters</span>
                                        </button>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Clinic</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Clinics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredClinics.map(clinic => (
                                    <ClinicCard key={clinic.id} clinic={clinic} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold mb-4">System Analytics</h3>
                                <p className="text-gray-600">Advanced analytics and reporting features will be displayed here.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'approvals' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold mb-4">Pending Approvals</h3>
                                <div className="space-y-4">
                                    {[
                                        { id: 1, type: 'New Clinic Registration', name: 'Central Medical Hub', date: '2024-12-15' },
                                        { id: 2, type: 'Doctor Verification', name: 'Dr. Sarah Johnson', date: '2024-12-14' },
                                        { id: 3, type: 'Clinic Upgrade Request', name: 'Sunrise Medical Center', date: '2024-12-13' }
                                    ].map(item => (
                                        <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.type}</p>
                                                <p className="text-sm text-gray-500">{item.name} • {item.date}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                                    Approve
                                                </button>
                                                <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoleGuard>
    )
}
