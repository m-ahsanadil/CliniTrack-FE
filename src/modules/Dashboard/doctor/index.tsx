'use client'

import React, { useState, useEffect, FC, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
    User,
    Phone,
    Mail,
    MapPin,
    Stethoscope,
    Building2,
    CreditCard,
    Shield,
    Calendar,
    Activity,
    AlertCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { DoctorProfileRequest, ProviderAdminProfileRequest } from './api/types'
import { DoctorProfileDialog } from './organisms/DoctorProfileDialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DoctorProfileProps } from '@/app/(DASHBOARD)/[dashboardId]/[role]/doctor/[doctorId]/page'
import { useAppDispatch, useAppSelector } from '@/src/redux/store/reduxHook'
import { useRouter } from 'next/navigation'
import { ProviderAdminProfileApi } from './api/api'
import { clearDoctors, fetchDoctorsRequest, fetchDoctorsSuccess, fetchDoctorsFailure } from './api/slice'

interface DoctorProfile extends DoctorProfileRequest {
    id?: string
    isProfileComplete?: boolean
}

const DoctorProfile: FC<DoctorProfileProps> = ({ dashboardId, role, doctorId }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    // Redux selectors
    const { user } = useAppSelector(state => state.auth);
    const { list: doctorsList, loading, error, lastFetched } = useAppSelector(state => state.doctor);
    console.log(doctorsList);

    // Local state - minimized to only what's truly needed locally
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false);
    const [isFirstLogin, setIsFirstLogin] = useState(false);

    // Memoized current doctor from Redux state
    const currentDoctor = useMemo(() => {
        if (!user?.id || !doctorsList.length) return null;
        return doctorsList.find((doc: ProviderAdminProfileRequest) =>
            doc.providerId === user.id
        ) || null;
    }, [doctorsList, user?.id]);

    // Memoized profile completion check
    const isProfileIncomplete = useMemo(() => {
        if (!currentDoctor) return true;

        const requiredFields = [
            currentDoctor.name,
            currentDoctor.specialty,
            currentDoctor.phone,
            currentDoctor.email,
            currentDoctor.address?.street,
            currentDoctor.address?.city,
            currentDoctor.address?.state,
            currentDoctor.address?.zipCode,
            currentDoctor.address?.country,
            currentDoctor.licenseNumber,
            currentDoctor.npiNumber,
            currentDoctor.clinicAffiliation
        ];

        return requiredFields.some(field => !field || field.trim() === '');
    }, [currentDoctor]);

    // Check if we need to fetch data
    const shouldFetchData = useMemo(() => {
        if (!user) return false;
        if (loading) return false;
        if (!doctorsList.length) return true;

        // Check if data is stale (optional - fetch every 5 minutes)
        const STALE_TIME = 5 * 60 * 1000; // 5 minutes
        if (lastFetched && Date.now() - lastFetched > STALE_TIME) return true;

        return false;
    }, [user, doctorsList.length, loading, lastFetched]);

    // Route protection
    useEffect(() => {
        if (!user) return;
        if (user.id !== dashboardId || user.role !== role) {
            router.push("/unauthorized");
        }
    }, [user, dashboardId, role, router]);

    // Check first login status
    useEffect(() => {
        const firstLogin = localStorage.getItem('doctor_first_login') === 'true';
        setIsFirstLogin(firstLogin);
    }, []);

    // Main data fetching effect - only fetch when needed
    useEffect(() => {
        if (!shouldFetchData) return;

        const fetchData = async () => {
            dispatch(fetchDoctorsRequest());

            try {
                const response = await ProviderAdminProfileApi.getAll();
                const doctors = response?.data;

                if (!Array.isArray(doctors)) {
                    throw new Error("Invalid data format from server.");
                }

                dispatch(fetchDoctorsSuccess(doctors));
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                dispatch(fetchDoctorsFailure(error?.message || "Failed to load profile data"));

                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive"
                });
            }
        };

        fetchData();
    }, [shouldFetchData, dispatch, toast]);

    // Handle first login modal
    useEffect(() => {
        if (isFirstLogin && currentDoctor && isProfileIncomplete) {
            setShowCompleteProfileModal(true);
        }
    }, [isFirstLogin, currentDoctor, isProfileIncomplete]);

    // Handle errors from Redux
    useEffect(() => {
        if (error) {
            toast({
                title: "Error",
                description: error,
                variant: "destructive"
            });
        }
    }, [error, toast]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'inactive':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
    }

    const handleProfileUpdate = async (updatedData: Partial<ProviderAdminProfileRequest>) => {
        // Clear Redux data to trigger refetch
        dispatch(clearDoctors());

        toast({
            title: "Success",
            description: "Profile updated successfully"
        });
    }

    const handleProfileCreate = async (newData: Partial<ProviderAdminProfileRequest>) => {
        // Clear Redux data to trigger refetch
        dispatch(clearDoctors());

        setShowCompleteProfileModal(false);

        // Clear first login flag
        localStorage.removeItem('doctor_first_login');
        setIsFirstLogin(false);

        toast({
            title: "Success",
            description: "Profile completed successfully! Welcome to CliniTrack."
        });
    }

    const handleCompleteProfileModalClose = (open: boolean) => {
        setShowCompleteProfileModal(open);
        if (!open && isFirstLogin) {
            toast({
                title: "Profile Incomplete",
                description: "Please complete your profile to access all features.",
                variant: "destructive"
            });
        }
    }

    // Loading state
    // if (loading) {
    //     return (
    //         <div className="container mx-auto p-6">
    //             <div className="animate-pulse space-y-6">
    //                 <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    //                     <div className="md:col-span-1">
    //                         <div className="h-64 bg-gray-200 rounded-lg"></div>
    //                     </div>
    //                     <div className="md:col-span-2">
    //                         <div className="h-64 bg-gray-200 rounded-lg"></div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    // No profile state
    if (!currentDoctor) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">No profile data available</p>
                            <DoctorProfileDialog
                                mode="create"
                                onCreate={handleProfileCreate}
                                triggerButton={true}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Profile Incomplete Alert */}
            {isProfileIncomplete && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Profile Incomplete</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                        Please complete your profile to access all CliniTrack features and improve your visibility.
                        <DoctorProfileDialog
                            doctorData={currentDoctor}
                            mode="create"
                            onCreate={handleProfileCreate}
                            isOpen={showCompleteProfileModal}
                            onOpenChange={handleCompleteProfileModalClose}
                            triggerButton={false}
                        />
                    </AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your professional information and settings
                    </p>
                </div>
                {!isProfileIncomplete && (
                    <DoctorProfileDialog
                        doctorData={currentDoctor}
                        onUpdate={handleProfileUpdate}
                        mode="edit"
                        triggerButton={true}
                    />
                )}
                {isProfileIncomplete && (
                    <Button
                        onClick={() => setShowCompleteProfileModal(true)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                    >
                        Complete Profile
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center">
                        <Avatar className="h-24 w-24 mx-auto mb-4">
                            <AvatarImage src="" alt={currentDoctor.name} />
                            <AvatarFallback className="text-lg">
                                {getInitials(currentDoctor.name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">{currentDoctor.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            {currentDoctor.specialty}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Badge className={getStatusColor(currentDoctor.status)}>
                                <Activity className="h-3 w-3 mr-1" />
                                {currentDoctor.status}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Provider ID:</span>
                                <span className="text-muted-foreground">{currentDoctor.providerId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Clinic:</span>
                                <span className="text-muted-foreground">{currentDoctor.clinicAffiliation}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{currentDoctor.phone}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{currentDoctor.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="font-medium">{currentDoctor.address.street}</p>
                                <p className="text-muted-foreground">
                                    {currentDoctor.address.city}, {currentDoctor.address.state} {currentDoctor.address.zipCode}
                                </p>
                                <p className="text-muted-foreground">{currentDoctor.address.country}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">License Number</label>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">{currentDoctor.licenseNumber}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">NPI Number</label>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">{currentDoctor.npiNumber}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Specialty</label>
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                    <span>{currentDoctor.specialty}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <Badge className={getStatusColor(currentDoctor.status)}>
                                    <Activity className="h-3 w-3 mr-1" />
                                    {currentDoctor.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                System Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Created By</label>
                                <span>{currentDoctor.createdBy}</span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Updated By</label>
                                <span>{currentDoctor.updatedBy}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile