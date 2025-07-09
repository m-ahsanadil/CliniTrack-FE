"use client";
import React, { useState, useMemo, useEffect, FC } from 'react';
import { Users, Search, Plus, Edit, Trash2, Eye, Ban, CheckCircle, AlertTriangle, MoreVertical, Mail, Phone, MapPin, Calendar, Filter, X, ShieldCheck, Activity, Briefcase, UserCircle2 } from 'lucide-react';
import { fetchAllSystemUsers } from './api/slice';
import { useAppDispatch, useAppSelector } from '@/src/redux/store/reduxHook';
import { UserRole, UserRoleValues, UserStatus, UserStatusValues } from '@/src/enum';
import { ProtectedRoleGuard } from '@/src/redux/hook/ProtectedRoute';
import { User } from './api/types';
import { SuperAdminUsersProps } from '@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/system-users/page';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionDropdown, createDeleteAction, createEditAction, createSuspendAction, createViewAction } from '@/src/components/ActionDropdown';
import UserViewModal from './api/organisms/UserViewModal';
import { UpdatePasswordModal } from './api/organisms/UserUpdateModal';


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

export default function index({ role }: SuperAdminUsersProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch()
    const { systemUsers, loading, error, count } = useAppSelector(state => state.systemUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // const [searchTerm, setSearchTerm] = useState('');
    // const [selectedRole, setSelectedRole] = useState('all');
    // const [selectedStatus, setSelectedStatus] = useState('all');
    // const [showUserModal, setShowUserModal] = useState(false);
    // const [showAddUserModal, setShowAddUserModal] = useState(false);
    // const [selectedUser, setSelectedUser] = useState<User | null>(null);
    // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    // const [userToDelete, setUserToDelete] = useState<User | null>(null);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [dropdownOpen, setDropdownOpen] = useState<number | string | null>(null);
    // const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllSystemUsers())
    }, [dispatch])

    // Form state
    // const [formData, setFormData] = useState({
    //     name: '',
    //     email: '',
    //     role: 'staff',
    //     organization: '',
    //     phone: '',
    //     location: '',
    // });

    const newToday = 0;
    const suspendedUsers = 0;
    const activeUsers = 0;
    const totalUsers = count;

    // Filter and pagination logic
    // const filteredUsers = useMemo(() => {
    //     return systemUsers.filter((user) => {
    //         const matchesSearch =
    //             user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             user.organization?.toLowerCase().includes(searchTerm.toLowerCase());

    //         const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    //         const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    //         return matchesSearch && matchesRole && matchesStatus;
    //     });
    // }, [systemUsers, searchTerm, selectedRole, selectedStatus]);


    // const paginatedUsers = useMemo(() => {
    //     const start = (currentPage - 1) * itemsPerPage;
    //     const end = start + itemsPerPage;
    //     return filteredUsers.slice(start, end);
    // }, [filteredUsers, currentPage, itemsPerPage]);


    // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
    // const handleViewUser = (user: User) => {
    //     setSelectedUser(user);
    //     setShowUserModal(true);
    // };

    // const handleDeleteUser = (user: User) => {
    //     setUserToDelete(user);
    //     setShowDeleteDialog(true);
    // };

    // const confirmDelete = () => {
    //     if (userToDelete) {
    //         
    //         setShowDeleteDialog(false);
    //         setUserToDelete(null);
    //     }
    // };

    // const handleSuspendUser = (user: User) => {
    //     toast({ description: `User ${user.fullName} has been suspended` });
    //     setDropdownOpen(null);
    // };

    // const validateForm = () => {
    //     const errors: Record<string, string> = {};

    //     if (!formData.name.trim() || formData.name.length < 2) {
    //         errors.name = 'Name must be at least 2 characters';
    //     }

    //     if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
    //         errors.email = 'Invalid email address';
    //     }

    //     if (!formData.organization.trim()) {
    //         errors.organization = 'Organization is required';
    //     }

    //     if (!formData.phone.trim() || formData.phone.length < 10) {
    //         errors.phone = 'Phone number is required';
    //     }

    //     if (!formData.location.trim()) {
    //         errors.location = 'Location is required';
    //     }

    //     setFormErrors(errors);
    //     return Object.keys(errors).length === 0;
    // };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         toast({ description: 'User created successfully' });
    //         setShowAddUserModal(false);
    //         setFormData({
    //             name: '',
    //             email: '',
    //             role: 'staff',
    //             organization: '',
    //             phone: '',
    //             location: '',
    //         });
    //         setFormErrors({});
    //     }
    // };

    // const totalUsers = count;
    // const activeUsers = systemUsers.filter(
    //     (user) => user.status === UserStatus.ACTIVE
    // ).length;

    // const suspendedUsers = systemUsers.filter(
    //     (user) => user.status === UserStatus.SUSPENDED
    // ).length;

    // const newToday = systemUsers.filter((user) => {
    //     if (!user.joinDate) return false;
    //     const today = new Date().toISOString().split("T")[0];
    //     return user.joinDate.startsWith(today);
    // }).length;

    const handleEdit = (_id: string) => {
        setSelectedUserId(_id);
        setIsPasswordModalOpen(true);
    }
    const handleView = (user: User) => {
        setSelectedUser(user);
        setIsViewOpen(true);
    }
    const handleDelete = (user: User) => {
        toast({ description: `User ${user.fullName} has been deleted successfully` });
        console.log(user);
    }
    const handleSuspend = (user: User) => {
        console.log(user);
    }

    return (
        <ProtectedRoleGuard role={role}>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Users</h1>
                        <p className="text-gray-600">Manage all users across organizations</p>
                    </div>
                    {/* <Button
                        onClick={() => setShowAddUserModal(true)}
                        className="mt-4 md:mt-0"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button> */}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white border border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Suspended</p>
                                    <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">New Today</p>
                                    <p className="text-2xl font-bold text-gray-900">{newToday}</p>
                                </div>
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <Plus className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                {/* <Card className="mb-8">
                    <CardContent className="p-6">
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
                    </CardContent>
                </Card> */}

                {/* Users Table */}
                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {systemUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                                                    <Users className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell>{user.organization}</TableCell>
                                        <TableCell>
                                            {user?.status && (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                                                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>{user.lastActive}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <ActionDropdown
                                                    actions={[
                                                        createViewAction(() => handleView(user)),
                                                        createEditAction(() => handleEdit(user._id)),
                                                        createSuspendAction(() => handleSuspend(user)),
                                                        { ...createDeleteAction(() => handleDelete(user)), separator: true }
                                                    ]}
                                                />

                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>

                    {/* Pagination */}
                    <CardFooter className="flex items-center justify-between px-6 py-4">
                        {/* <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
                            <span className="font-medium">{filteredUsers.length}</span> results
                        </div> */}
                        <div className="flex items-center gap-2">
                            <Button
                                // onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                // disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Previous
                            </Button>
                            {/* {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <Button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        className="min-w-[2.5rem]"
                                    >
                                        {page}
                                    </Button>
                                );
                            })} */}
                            <Button
                                // onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                // disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                Next
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            {selectedUserId && (<UpdatePasswordModal open={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} userId={selectedUserId} />)}
            {selectedUser && (<UserViewModal open={isViewOpen} onClose={() => setIsViewOpen(false)} user={selectedUser} />)}
        </ProtectedRoleGuard>
    )
    // return (
    //     <ProtectedRoleGuard role={role}>
    //         <div className="min-h-screen bg-gray-50">
    //             {/* Header */}
    //             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
    //                 <div>
    //                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">System Users</h1>
    //                     <p className="text-gray-600">Manage all users across organizations</p>
    //                 </div>
    //                 {/* <button
    //                     onClick={() => setShowAddUserModal(true)}
    //                     className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
    //                 >
    //                     <Plus className="w-4 h-4" />
    //                     Add User
    //                 </button> */}
    //             </div>

    //             {/* Stats Cards */}
    //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    //                 <div className="bg-white rounded-lg shadow-sm p-6">
    //                     <div className="flex items-center justify-between">
    //                         <div>
    //                             <p className="text-sm font-medium text-gray-600">Total Users</p>
    //                             <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
    //                         </div>
    //                         <div className="p-3 bg-blue-100 rounded-lg">
    //                             <Users className="w-6 h-6 text-blue-600" />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className="bg-white rounded-lg shadow-sm p-6">
    //                     <div className="flex items-center justify-between">
    //                         <div>
    //                             <p className="text-sm font-medium text-gray-600">Active Users</p>
    //                             <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
    //                         </div>
    //                         <div className="p-3 bg-green-100 rounded-lg">
    //                             <CheckCircle className="w-6 h-6 text-green-600" />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className="bg-white rounded-lg shadow-sm p-6">
    //                     <div className="flex items-center justify-between">
    //                         <div>
    //                             <p className="text-sm font-medium text-gray-600">Suspended</p>
    //                             <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>
    //                         </div>
    //                         <div className="p-3 bg-yellow-100 rounded-lg">
    //                             <AlertTriangle className="w-6 h-6 text-yellow-600" />
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div className="bg-white rounded-lg shadow-sm p-6">
    //                     <div className="flex items-center justify-between">
    //                         <div>
    //                             <p className="text-sm font-medium text-gray-600">New Today</p>
    //                             <p className="text-2xl font-bold text-gray-900">{newToday}</p>
    //                         </div>
    //                         <div className="p-3 bg-purple-100 rounded-lg">
    //                             <Plus className="w-6 h-6 text-purple-600" />
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* Filters */}
    //             {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
    //                 <div className="flex flex-col md:flex-row gap-4">
    //                     <div className="flex-1">
    //                         <div className="relative">
    //                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //                             <input
    //                                 type="text"
    //                                 placeholder="Search users..."
    //                                 value={searchTerm}
    //                                 onChange={(e) => setSearchTerm(e.target.value)}
    //                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //                             />
    //                         </div>
    //                     </div>

    //                     <CustomSelect
    //                         value={selectedRole}
    //                         onValueChange={setSelectedRole}
    //                         placeholder="Select Role"
    //                         options={UserRoleValues}
    //                         className="w-full md:w-48"
    //                     />

    //                     <CustomSelect
    //                         value={selectedStatus}
    //                         onValueChange={setSelectedStatus}
    //                         placeholder="Select Status"
    //                         options={UserStatusValues}
    //                         className="w-full md:w-48"
    //                     />
    //                 </div>
    //             </div> */}

    //             {/* Users Table */}
    //             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    //                 <div className="overflow-x-auto">
    //                     <table className="w-full">
    //                         <thead className="bg-gray-50 border-b border-gray-200">
    //                             <tr>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
    //                                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody className="bg-white divide-y divide-gray-200">
    //                             {systemUsers.map((user) => (
    //                                 <tr key={user._id} className="hover:bg-gray-50">
    //                                     <td className="px-6 py-4 whitespace-nowrap">
    //                                         <div className="flex items-center">
    //                                             <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
    //                                                 <Users className="w-5 h-5 text-gray-600" />
    //                                             </div>
    //                                             <div>
    //                                                 <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
    //                                                 <div className="text-sm text-gray-500">{user.email}</div>
    //                                             </div>
    //                                         </div>
    //                                     </td>
    //                                     <td className="px-6 py-4 whitespace-nowrap">
    //                                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
    //                                             {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
    //                                         </span>
    //                                     </td>
    //                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.organization}</td>
    //                                     <td className="px-6 py-4 whitespace-nowrap">
    //                                         {user?.status && (
    //                                             <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
    //                                                 {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
    //                                             </span>
    //                                         )}

    //                                     </td>
    //                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
    //                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    //                                         <div className="flex items-center gap-2">
    //                                             <button
    //                                                 // onClick={() => handleViewUser(user)}
    //                                                 className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
    //                                                 title="View User"
    //                                             >
    //                                                 <Eye className="w-4 h-4" />
    //                                             </button>

    //                                             <button
    //                                                 className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
    //                                                 title="Edit User"
    //                                             >
    //                                                 <Edit className="w-4 h-4" />
    //                                             </button>

    //                                             <div className="relative">
    //                                                 <button
    //                                                     // onClick={() => setDropdownOpen(dropdownOpen === user?._id ? null : user?._id)}
    //                                                     className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50 transition-colors"
    //                                                 >
    //                                                     <MoreVertical className="w-4 h-4" />
    //                                                 </button>
    //                                                 {/* {dropdownOpen === user?._id && (
    //                                                     <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
    //                                                         <button
    //                                                             onClick={() => handleSuspendUser(user)}
    //                                                             className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100"
    //                                                         >
    //                                                             <Ban className="w-4 h-4" />
    //                                                             Suspend
    //                                                         </button>
    //                                                         <button
    //                                                             onClick={() => {
    //                                                                 handleDeleteUser(user);
    //                                                                 setDropdownOpen(null);
    //                                                             }}
    //                                                             className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-100 text-red-600"
    //                                                         >
    //                                                             <Trash2 className="w-4 h-4" />
    //                                                             Delete
    //                                                         </button>
    //                                                     </div>
    //                                                 )} */}
    //                                             </div>
    //                                         </div>
    //                                     </td>
    //                                 </tr>
    //                             ))}
    //                         </tbody>
    //                     </table>
    //                 </div>

    //                 {/* Pagination */}
    //                 <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
    //                     {/* <div className="text-sm text-gray-700">
    //                         Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
    //                         <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
    //                         <span className="font-medium">{filteredUsers.length}</span> results
    //                     </div> */}
    //                     <div className="flex items-center gap-2">
    //                         <button
    //                             // onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    //                             // disabled={currentPage === 1}
    //                             className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //                         >
    //                             Previous
    //                         </button>
    //                         {/* {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    //                             const page = i + 1;
    //                             return (
    //                                 <button
    //                                     key={page}
    //                                     onClick={() => setCurrentPage(page)}
    //                                     className={`px-3 py-1 text-sm rounded-md min-w-[2.5rem] ${currentPage === page
    //                                         ? 'bg-blue-600 text-white'
    //                                         : 'border border-gray-300 hover:bg-gray-50'
    //                                         }`}
    //                                 >
    //                                     {page}
    //                                 </button>
    //                             );
    //                         })} */}
    //                         <button
    //                             // onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    //                             // disabled={currentPage === totalPages}
    //                             className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
    //                         >
    //                             Next
    //                         </button>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </ProtectedRoleGuard>
    // );
}


// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Pencil, Trash2 } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";
// import { User } from "./api/types";
// import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
// import { fetchAllSystemUsers, resetUpdateStatus, updateUsersBySuperAdmin } from "./api/slice";
// import { SuperAdminUsersProps } from "@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/system-users/page";
// import { DialogTitle } from "@/components/ui/dialog";

// export default function index({ role }: SuperAdminUsersProps) {
//     const dispatch = useAppDispatch();
//     const { systemUsers, loading, updateLoading, updateSuccess } = useAppSelector((state) => state.systemUsers);

//     const [selectedUserId, setSelectedUserId] = useState<string | number | null>(null);

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm<{ newPassword: string }>();

//     useEffect(() => {
//         dispatch(fetchAllSystemUsers());
//     }, [dispatch]);

//     useEffect(() => {
//         if (updateSuccess) {
//             toast.success("Password updated successfully!");
//             dispatch(resetUpdateStatus());
//         }
//     }, [updateSuccess, dispatch]);

//     const onSubmit = ({ newPassword }: { newPassword: string }) => {
//         if (!selectedUserId) return;
//         dispatch(updateUsersBySuperAdmin({ id: selectedUserId, payload: { newPassword } }));
//     };

//     return (
//         <div className="p-4">
//             <h1 className="text-2xl font-bold mb-4">System Users</h1>

//             {loading ? (
//                 <p>Loading users...</p>
//             ) : (
//                 <div className="grid gap-4">
//                     {systemUsers.map((user: User) => (
//                         <div key={user._id} className="p-4 border rounded-md flex items-center justify-between">
//                             <div>
//                                 <p className="font-medium">{user.username}</p>
//                                 <p className="text-sm text-gray-500">{user.email}</p>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Dialog>
//                                     <DialogTitle className="text-lg font-semibold mb-4">Update Password</DialogTitle> {/* ✅ Add this */}

//                                     <DialogTrigger asChild>
//                                         <Button size="sm" variant="outline" onClick={() => {
//                                             setSelectedUserId(user._id);
//                                             reset(); // reset form when opening
//                                         }}>
//                                             <Pencil className="w-4 h-4 mr-1" /> Edit
//                                         </Button>
//                                     </DialogTrigger>
//                                     <DialogContent className="bg-white p-6 rounded shadow-lg w-96">
//                                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                                             <div>
//                                                 <label className="text-sm font-medium">New Password</label>
//                                                 <input
//                                                     type="password"
//                                                     {...register("newPassword", { required: true, minLength: 6 })}
//                                                     className="w-full px-3 py-2 border rounded"
//                                                 />
//                                                 {errors.newPassword && (
//                                                     <p className="text-sm text-red-500">Min 6 characters required</p>
//                                                 )}
//                                             </div>
//                                             <Button type="submit" disabled={updateLoading} className="w-full">
//                                                 {updateLoading ? "Updating..." : "Update Password"}
//                                             </Button>
//                                         </form>
//                                     </DialogContent>
//                                 </Dialog>

//                                 <Button variant="destructive" size="sm" onClick={() => {
//                                     // Placeholder: handleDeleteUser(user._id)
//                                     toast.info("Delete logic not implemented yet.");
//                                 }}>
//                                     <Trash2 className="w-4 h-4" />
//                                 </Button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }