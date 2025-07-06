"use client";
import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone, MapPin, Calendar } from 'lucide-react';


export default function SystemUserPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const users = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            email: 'sarah.j@cityhospital.com',
            role: 'doctor',
            organization: 'City General Hospital',
            status: 'active',
            lastActive: '2024-01-15',
            phone: '+1 (555) 123-4567',
            avatar: null,
            joinDate: '2023-03-15',
            location: 'New York, NY'
        },
        {
            id: 2,
            name: 'John Smith',
            email: 'john.smith@admin.com',
            role: 'admin',
            organization: 'Metro Health Center',
            status: 'active',
            lastActive: '2024-01-14',
            phone: '+1 (555) 987-6543',
            avatar: null,
            joinDate: '2023-01-20',
            location: 'Los Angeles, CA'
        },
        {
            id: 3,
            name: 'Emily Davis',
            email: 'emily.d@community.org',
            role: 'staff',
            organization: 'Community Clinic',
            status: 'inactive',
            lastActive: '2024-01-10',
            phone: '+1 (555) 456-7890',
            avatar: null,
            joinDate: '2023-06-10',
            location: 'Chicago, IL'
        },
        {
            id: 4,
            name: 'Michael Brown',
            email: 'mike.brown@patient.com',
            role: 'patient',
            organization: 'Regional Medical',
            status: 'active',
            lastActive: '2024-01-16',
            phone: '+1 (555) 321-0987',
            avatar: null,
            joinDate: '2023-08-22',
            location: 'Houston, TX'
        },
        {
            id: 5,
            name: 'Lisa Wilson',
            email: 'lisa.w@downtown.med',
            role: 'doctor',
            organization: 'Downtown Health',
            status: 'suspended',
            lastActive: '2024-01-12',
            phone: '+1 (555) 654-3210',
            avatar: null,
            joinDate: '2023-04-05',
            location: 'Phoenix, AZ'
        }
    ];

    const getRoleColor = (role: string) => {
        const colors = {
            'super-admin': 'bg-purple-100 text-purple-800',
            'admin': 'bg-blue-100 text-blue-800',
            'doctor': 'bg-green-100 text-green-800',
            'staff': 'bg-yellow-100 text-yellow-800',
            'patient': 'bg-gray-100 text-gray-800'
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status: string) => {
        const colors = {
            'active': 'bg-green-100 text-green-800',
            'inactive': 'bg-yellow-100 text-yellow-800',
            'suspended': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.organization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleViewUser = (user: React.SetStateAction<null>) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const UserModal = ({ user, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <span className="sr-only">Close</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium">{user.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Join Date</p>
                                    <p className="font-medium">{user.joinDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Organization</p>
                                <p className="font-medium">{user.organization}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Last Active</p>
                                <p className="font-medium">{user.lastActive}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Account Status</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Edit className="w-4 h-4" />
                            Edit User
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                            <Ban className="w-4 h-4" />
                            Suspend
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Users</h1>
                    <p className="text-gray-600">Manage all users across organizations</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0">
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">45,678</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900">42,156</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Suspended</p>
                            <p className="text-2xl font-bold text-gray-900">1,234</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Today</p>
                            <p className="text-2xl font-bold text-gray-900">89</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Plus className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="super-admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="doctor">Doctor</option>
                        <option value="staff">Staff</option>
                        <option value="patient">Patient</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                <Users className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">{filteredUsers.length}</span> results
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            2
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            3
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* User Modal */}
            {showModal && selectedUser && (
                <UserModal user={selectedUser} onClose={() => setShowModal(false)} />
            )}
        </div>
    );
}