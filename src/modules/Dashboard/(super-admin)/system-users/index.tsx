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
import UserViewModal from './organisms/UserViewModal';
import { UpdatePasswordModal } from './organisms/UserUpdateModal';
import { StatCard } from './organisms/StatCard';
import { CustomSelect } from './organisms/CustomSelect';
import { Input } from '@/components/ui/input';



export default function index({ role }: SuperAdminUsersProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch()
    const { systemUsers, loading, error, count } = useAppSelector(state => state.systemUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchAllSystemUsers())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast({ variant: "destructive", description: error });
        }
    }, [error]);



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
        toast({ description: `User ${user.fullName} has been suspended` });
        console.log(user);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 text-sm">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md text-center bg-white border border-red-200 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Failed to load users</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button
                        onClick={() => dispatch(fetchAllSystemUsers())}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
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
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={<Users className="w-6 h-6 text-blue-600" />}
                        iconBg="bg-blue-100"
                    />
                    <StatCard
                        title="Active Users"
                        value={activeUsers}
                        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                        iconBg="bg-green-100"
                    />
                    <StatCard
                        title="Suspended"
                        value={suspendedUsers}
                        icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
                        iconBg="bg-yellow-100"
                    />
                    <StatCard
                        title="New Today"
                        value={newToday}
                        icon={<Plus className="w-6 h-6 text-purple-600" />}
                        iconBg="bg-purple-100"
                    />
                </div>

                {/* Filters */}
                <Card className="bg-white border border-slate-200 mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-transparent rounded-md text-slate-600"
                                    />
                                </div>
                            </div>

                            <CustomSelect
                                value={selectedRole}
                                onValueChange={setSelectedRole}
                                placeholder="Select Role"
                                options={[{ label: "All", value: "all" }, ...UserRoleValues]}
                                className="w-full md:w-48"
                            />

                            <CustomSelect
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                                placeholder="Select Status"
                                options={[{ label: "All", value: "all" }, ...UserStatusValues]}
                                className="w-full md:w-48"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="bg-white border border-slate-200">
                    <CardContent className="p-6">
                        {filteredUsers.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                No users found for selected filter or search.
                            </div>
                        ) : (
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
                                    {paginatedUsers.map((user) => (
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
                        )}

                    </CardContent>

                    {/* Pagination */}
                    <CardFooter className="flex items-center justify-between px-6 py-4">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{' '}
                            <span className="font-medium">{filteredUsers.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Previous
                            </Button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                            })}
                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
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
}