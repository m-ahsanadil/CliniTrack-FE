// "use client";
// import React, { useState } from 'react';
// import { Users, Search, Filter, Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone, MapPin, Calendar } from 'lucide-react';
// import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
// import { SuperAdminUsersProps } from '@/app/(DASHBOARD)/[dashboardId]/[role]/(SUPER-ADMIN)/system-users/page';

// export default function index({ dashboardId, role }: SuperAdminUsersProps) {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedRole, setSelectedRole] = useState('all');
//     const [selectedStatus, setSelectedStatus] = useState('all');
//     const [showModal, setShowModal] = useState(false);
//     const [selectedUser, setSelectedUser] = useState(null);

//     const users = [
//         {
//             id: 1,
//             name: 'Dr. Sarah Johnson',
//             email: 'sarah.j@cityhospital.com',
//             role: 'doctor',
//             organization: 'City General Hospital',
//             status: 'active',
//             lastActive: '2024-01-15',
//             phone: '+1 (555) 123-4567',
//             avatar: null,
//             joinDate: '2023-03-15',
//             location: 'New York, NY'
//         },
//         {
//             id: 2,
//             name: 'John Smith',
//             email: 'john.smith@admin.com',
//             role: 'admin',
//             organization: 'Metro Health Center',
//             status: 'active',
//             lastActive: '2024-01-14',
//             phone: '+1 (555) 987-6543',
//             avatar: null,
//             joinDate: '2023-01-20',
//             location: 'Los Angeles, CA'
//         },
//         {
//             id: 3,
//             name: 'Emily Davis',
//             email: 'emily.d@community.org',
//             role: 'staff',
//             organization: 'Community Clinic',
//             status: 'inactive',
//             lastActive: '2024-01-10',
//             phone: '+1 (555) 456-7890',
//             avatar: null,
//             joinDate: '2023-06-10',
//             location: 'Chicago, IL'
//         },
//         {
//             id: 4,
//             name: 'Michael Brown',
//             email: 'mike.brown@patient.com',
//             role: 'patient',
//             organization: 'Regional Medical',
//             status: 'active',
//             lastActive: '2024-01-16',
//             phone: '+1 (555) 321-0987',
//             avatar: null,
//             joinDate: '2023-08-22',
//             location: 'Houston, TX'
//         },
//         {
//             id: 5,
//             name: 'Lisa Wilson',
//             email: 'lisa.w@downtown.med',
//             role: 'doctor',
//             organization: 'Downtown Health',
//             status: 'suspended',
//             lastActive: '2024-01-12',
//             phone: '+1 (555) 654-3210',
//             avatar: null,
//             joinDate: '2023-04-05',
//             location: 'Phoenix, AZ'
//         }
//     ];

//     const getRoleColor = (role: string) => {
//         const colors = {
//             'super-admin': 'bg-purple-100 text-purple-800',
//             'admin': 'bg-blue-100 text-blue-800',
//             'doctor': 'bg-green-100 text-green-800',
//             'staff': 'bg-yellow-100 text-yellow-800',
//             'patient': 'bg-gray-100 text-gray-800'
//         };
//         return colors[role] || 'bg-gray-100 text-gray-800';
//     };

//     const getStatusColor = (status: string) => {
//         const colors = {
//             'active': 'bg-green-100 text-green-800',
//             'inactive': 'bg-yellow-100 text-yellow-800',
//             'suspended': 'bg-red-100 text-red-800'
//         };
//         return colors[status] || 'bg-gray-100 text-gray-800';
//     };

//     const filteredUsers = users.filter(user => {
//         const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             user.organization.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesRole = selectedRole === 'all' || user.role === selectedRole;
//         const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
//         return matchesSearch && matchesRole && matchesStatus;
//     });

//     const handleViewUser = (user: React.SetStateAction<null>) => {
//         setSelectedUser(user);
//         setShowModal(true);
//     };

//     const UserModal = ({ user, onClose }) => (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                 <div className="p-6 border-b border-gray-200">
//                     <div className="flex items-center justify-between">
//                         <h3 className="text-xl font-semibold text-gray-900">User Details</h3>
//                         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
//                             <span className="sr-only">Close</span>
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="p-6">
//                     <div className="flex items-center gap-4 mb-6">
//                         <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
//                             <Users className="w-8 h-8 text-gray-600" />
//                         </div>
//                         <div>
//                             <h4 className="text-xl font-semibold text-gray-900">{user.name}</h4>
//                             <p className="text-gray-600">{user.email}</p>
//                             <div className="flex items-center gap-2 mt-2">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                                     {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                                 </span>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
//                                     {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div className="space-y-4">
//                             <div className="flex items-center gap-3">
//                                 <Phone className="w-5 h-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-sm text-gray-500">Phone</p>
//                                     <p className="font-medium">{user.phone}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <MapPin className="w-5 h-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-sm text-gray-500">Location</p>
//                                     <p className="font-medium">{user.location}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-3">
//                                 <Calendar className="w-5 h-5 text-gray-400" />
//                                 <div>
//                                     <p className="text-sm text-gray-500">Join Date</p>
//                                     <p className="font-medium">{user.joinDate}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Organization</p>
//                                 <p className="font-medium">{user.organization}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Last Active</p>
//                                 <p className="font-medium">{user.lastActive}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500 mb-1">Account Status</p>
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
//                                     {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex gap-3 mt-8">
//                         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                             <Edit className="w-4 h-4" />
//                             Edit User
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
//                             <Ban className="w-4 h-4" />
//                             Suspend
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
//                             <Trash2 className="w-4 h-4" />
//                             Delete
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
//             <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
//                 {/* Header */}
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Users</h1>
//                         <p className="text-gray-600">Manage all users across organizations</p>
//                     </div>
//                     <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0">
//                         <Plus className="w-4 h-4" />
//                         Add User
//                     </button>
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                                 <p className="text-2xl font-bold text-gray-900">45,678</p>
//                             </div>
//                             <div className="p-3 bg-blue-100 rounded-lg">
//                                 <Users className="w-6 h-6 text-blue-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Active Users</p>
//                                 <p className="text-2xl font-bold text-gray-900">42,156</p>
//                             </div>
//                             <div className="p-3 bg-green-100 rounded-lg">
//                                 <CheckCircle className="w-6 h-6 text-green-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">Suspended</p>
//                                 <p className="text-2xl font-bold text-gray-900">1,234</p>
//                             </div>
//                             <div className="p-3 bg-yellow-100 rounded-lg">
//                                 <AlertTriangle className="w-6 h-6 text-yellow-600" />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <p className="text-sm font-medium text-gray-600">New Today</p>
//                                 <p className="text-2xl font-bold text-gray-900">89</p>
//                             </div>
//                             <div className="p-3 bg-purple-100 rounded-lg">
//                                 <Plus className="w-6 h-6 text-purple-600" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
//                     <div className="flex flex-col md:flex-row gap-4">
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search users..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                 />
//                             </div>
//                         </div>

//                         <select
//                             value={selectedRole}
//                             onChange={(e) => setSelectedRole(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="all">All Roles</option>
//                             <option value="super-admin">Super Admin</option>
//                             <option value="admin">Admin</option>
//                             <option value="doctor">Doctor</option>
//                             <option value="staff">Staff</option>
//                             <option value="patient">Patient</option>
//                         </select>

//                         <select
//                             value={selectedStatus}
//                             onChange={(e) => setSelectedStatus(e.target.value)}
//                             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         >
//                             <option value="all">All Status</option>
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                             <option value="suspended">Suspended</option>
//                         </select>
//                     </div>
//                 </div>

//                 {/* Users Table */}
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 border-b border-gray-200">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredUsers.map((user) => (
//                                     <tr key={user.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center">
//                                                 <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
//                                                     <Users className="w-5 h-5 text-gray-600" />
//                                                 </div>
//                                                 <div>
//                                                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                                     <div className="text-sm text-gray-500">{user.email}</div>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                                                 {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organization}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
//                                                 {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                             <div className="flex items-center gap-2">
//                                                 <button
//                                                     onClick={() => handleViewUser(user)}
//                                                     className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
//                                                 >
//                                                     <Eye className="w-4 h-4" />
//                                                 </button>
//                                                 <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
//                                                     <Edit className="w-4 h-4" />
//                                                 </button>
//                                                 <button className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50">
//                                                     <Trash2 className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
//                         <div className="text-sm text-gray-700">
//                             Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
//                             <span className="font-medium">{filteredUsers.length}</span> results
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
//                                 Previous
//                             </button>
//                             <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
//                                 1
//                             </button>
//                             <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
//                                 2
//                             </button>
//                             <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
//                                 3
//                             </button>
//                             <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* User Modal */}
//                 {showModal && selectedUser && (
//                     <UserModal user={selectedUser} onClose={() => setShowModal(false)} />
//                 )}
//             </div>

//         </ProtectedRoleGuard>
//     )
// }

"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone, MapPin, Calendar, Filter, X } from 'lucide-react';
import { fetchAllSystemUsers } from './api/slice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store/reduxHook';
import { UserRole, UserRoleValues, UserStatus, UserStatusValues } from '@/src/enum';
import { ProtectedRoleGuard } from '@/src/redux/hook/ProtectedRoute';
import { User } from './api/types';
import { SuperAdminUsersProps } from '@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/system-users/page';


type OptionType = { value: string; label: string } | string;

interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    options: OptionType[];
    className?: string;
}

// Custom Select Component
const CustomSelect = ({ value, onValueChange, placeholder, options, className = "" }: CustomSelectProps) => {

    const [open, setOpen] = useState(false);
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    const normalizedOptions = options.map((opt) =>
        typeof opt === "string" ? { value: opt, label: capitalize(opt) } : opt
    );
    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="h-4 w-4 opacity-50">
                    <path d="m4.93179 5.43179c0.20053-0.20053 0.52632-0.20053 0.72678 0l2.34143 2.34143 2.34143-2.34143c0.20053-0.20053 0.52632-0.20053 0.72678 0 0.20053 0.20053 0.20053 0.52632 0 0.72678l-2.70711 2.70711c-0.39053 0.39053-1.02369 0.39053-1.41421 0l-2.70711-2.70711c-0.20053-0.20053-0.20053-0.52632 0-0.72678z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
            </button>
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {normalizedOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onValueChange(option.value);
                                setOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Modal Component
const Modal = ({ open, onClose, title, children }: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Alert Dialog Component
const AlertDialog = ({ open, onClose, onConfirm, title, message }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Toast notification
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-md text-white z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
};

export default function EnhancedSystemUsers({ role }: SuperAdminUsersProps) {
    const dispatch = useAppDispatch()
    const { systemUsers, loading, error, count } = useAppSelector(state => state.systemUsers);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState<number | string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllSystemUsers())
    }, [dispatch])

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'staff',
        organization: '',
        phone: '',
        location: '',
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Filter and pagination logic
    const filteredUsers = useMemo(() => {
        return systemUsers.filter((user) => {
            const matchesSearch =
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.organization?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [systemUsers, searchTerm, selectedRole, selectedStatus]);


    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, currentPage, itemsPerPage]);


    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    // Helper functions
    const getRoleColor = (role: string): string => {
        const colors = {
            'superadmin': 'bg-purple-100 text-purple-800 border-purple-200',
            'admin': 'bg-blue-100 text-blue-800 border-blue-200',
            'doctor': 'bg-green-100 text-green-800 border-green-200',
            'staff': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'patient': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return colors[role as UserRole] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getStatusColor = (status: string): string => {
        const colors = {
            'active': 'bg-green-100 text-green-800 border-green-200',
            'inactive': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'suspended': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status as UserStatus] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Event handlers
    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleDeleteUser = (user: User) => {
        setUserToDelete(user);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            showToast(`User ${userToDelete.fullName} has been deleted successfully`);
            setShowDeleteDialog(false);
            setUserToDelete(null);
        }
    };

    const handleSuspendUser = (user: User) => {
        showToast(`User ${user.fullName} has been suspended`);
        setDropdownOpen(null);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim() || formData.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Invalid email address';
        }

        if (!formData.organization.trim()) {
            errors.organization = 'Organization is required';
        }

        if (!formData.phone.trim() || formData.phone.length < 10) {
            errors.phone = 'Phone number is required';
        }

        if (!formData.location.trim()) {
            errors.location = 'Location is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            showToast('User created successfully');
            setShowAddUserModal(false);
            setFormData({
                name: '',
                email: '',
                role: 'staff',
                organization: '',
                phone: '',
                location: '',
            });
            setFormErrors({});
        }
    };

    const totalUsers = count;
    const activeUsers = systemUsers.filter(
        (user) => user.status === UserStatus.ACTIVE
    ).length;

    const suspendedUsers = systemUsers.filter(
        (user) => user.status === UserStatus.SUSPENDED
    ).length;

    const newToday = systemUsers.filter((user) => {
        if (!user.joinDate) return false;
        const today = new Date().toISOString().split("T")[0];
        return user.joinDate.startsWith(today);
    }).length;
    return (
        <ProtectedRoleGuard role={role}>
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Users</h1>
                        <p className="text-gray-600">Manage all users across organizations</p>
                    </div>
                    <button
                        onClick={() => setShowAddUserModal(true)}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add User
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Suspended</p>
                                <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">New Today</p>
                                <p className="text-2xl font-bold text-gray-900">{newToday}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Plus className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <CustomSelect
                            value={selectedRole}
                            onValueChange={setSelectedRole}
                            placeholder="Select Role"
                            options={UserRoleValues}
                            className="w-full md:w-48"
                        />

                        <CustomSelect
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                            placeholder="Select Status"
                            options={UserStatusValues}
                            className="w-full md:w-48"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                                {paginatedUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                    <Users className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organization}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user?.status && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                </span>
                                            )}

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                                    title="View User"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        onClick={() => setDropdownOpen(dropdownOpen === user?._id ? null : user?._id)}
                                                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {dropdownOpen === user?._id && (
                                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                                            <button
                                                                onClick={() => handleSuspendUser(user)}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
                                                            >
                                                                <Ban className="w-4 h-4" />
                                                                Suspend
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteUser(user);
                                                                    setDropdownOpen(null);
                                                                }}
                                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
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
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
                            <span className="font-medium">{filteredUsers.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 text-sm rounded-md min-w-[2.5rem] ${currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* User Details Modal */}
                <Modal
                    open={showUserModal}
                    onClose={() => setShowUserModal(false)}
                    title="User Details"
                >
                    {selectedUser && (
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-gray-900">{selectedUser.fullName}</h4>
                                    <p className="text-gray-600">{selectedUser.email}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)}`}>
                                            {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                                        </span>
                                        {/* <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                                            {selectedUser.role && (selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1))}
                                        </span> */}
                                        {selectedUser.status && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.status)}`}>
                                                {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                                            </span>
                                        )}

                                    </div>
                                    {/* // The rest of your code continues... */}
                                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                                        <p className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            {selectedUser.location}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-500" />
                                            {selectedUser.phone}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            Joined: {selectedUser.joinDate}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </Modal>

                {/* Add User Modal */}
                <Modal
                    open={showAddUserModal}
                    onClose={() => setShowAddUserModal(false)}
                    title="Add New User"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formErrors.email && <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                {UserRoleValues.map(role => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize first letter */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Organization</label>
                            <input
                                type="text"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formErrors.organization && <p className="text-sm text-red-600 mt-1">{formErrors.organization}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formErrors.phone && <p className="text-sm text-red-600 mt-1">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {formErrors.location && <p className="text-sm text-red-600 mt-1">{formErrors.location}</p>}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={confirmDelete}
                    title="Delete User"
                    message={`Are you sure you want to delete user ${userToDelete?.fullName}? This action cannot be undone.`}
                />
            </div>
        </ProtectedRoleGuard>
    );
}
