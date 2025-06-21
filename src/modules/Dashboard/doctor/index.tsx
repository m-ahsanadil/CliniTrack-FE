'use client'

import React, { useState, useEffect } from 'react'
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
import { DoctorProfileRequest } from './api/types'
import { DoctorProfileDialog  } from './organisms/DoctorProfileDialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'


interface DoctorProfile extends DoctorProfileRequest {
    id?: string
    isProfileComplete?: boolean
}

const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState<DoctorProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [showCompleteProfileModal, setShowCompleteProfileModal] = useState(false)
    const [isFirstLogin, setIsFirstLogin] = useState(false)
    const { toast } = useToast()

    const isProfileIncomplete = (data: DoctorProfile | null): boolean => {
        if (!data) return true

        const requiredFields = [
            data.name,
            data.specialty,
            data.phone,
            data.email,
            data.address?.street,
            data.address?.city,
            data.address?.state,
            data.address?.zipCode,
            data.address?.country,
            data.licenseNumber,
            data.npiNumber,
            data.clinicAffiliation
        ]

        return requiredFields.some(field => !field || field.trim() === '')
    }

    // Mock data - replace with actual API call
    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                // Check if this is first login (you can store this in localStorage or get from API)
                const firstLogin = localStorage.getItem('doctor_first_login') === 'true'
                setIsFirstLogin(firstLogin)

                // Simulate API call
                setTimeout(() => {
                    const mockData: DoctorProfile = {
                        id: "DOC-001",
                        providerId: "PROV-001-DOC",
                        name: "Dr. Emily White",
                        specialty: "Pediatrics",
                        phone: "+966502345678",
                        email: "emily.white@clinitrack.com",
                        address: {
                            street: "456 Health Blvd",
                            city: "Dammam",
                            state: "Eastern Province",
                            zipCode: "31412",
                            country: "Saudi Arabia"
                        },
                        licenseNumber: "MD-56789",
                        npiNumber: "1234567890",
                        clinicAffiliation: "CliniTrack Clinic",
                        status: "Active",
                        createdBy: "clinicadmin",
                        updatedBy: "clinicadmin"
                    }

                    // For demo: simulate incomplete profile for first login
                    if (firstLogin) {
                        const incompleteData: DoctorProfile = {
                            id: "DOC-001",
                            providerId: "PROV-001-DOC",
                            name: "",
                            specialty: "",
                            phone: "",
                            email: "emily.white@clinitrack.com", // Only email from registration
                            address: {
                                street: "",
                                city: "",
                                state: "",
                                zipCode: "",
                                country: ""
                            },
                            licenseNumber: "",
                            npiNumber: "",
                            clinicAffiliation: "",
                            status: "Pending",
                            createdBy: "system",
                            updatedBy: "system"
                        }
                        setDoctorData(incompleteData)

                        // Show complete profile modal for incomplete profiles
                        if (isProfileIncomplete(incompleteData)) {
                            setShowCompleteProfileModal(true)
                        }
                    } else {
                        setDoctorData(mockData)
                    }

                    setLoading(false)
                }, 1000)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load profile data",
                    variant: "destructive"
                })
                setLoading(false)
            }
        }

        fetchDoctorProfile()
    }, [toast])


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

    const handleProfileUpdate = (updatedData: DoctorProfile) => {
        setDoctorData(updatedData)
        toast({
            title: "Success",
            description: "Profile updated successfully"
        })
    }

    const handleProfileCreate = (newData: DoctorProfile) => {
        setDoctorData(newData)
        setShowCompleteProfileModal(false)

        // Clear first login flag
        localStorage.removeItem('doctor_first_login')
        setIsFirstLogin(false)

        toast({
            title: "Success",
            description: "Profile completed successfully! Welcome to CliniTrack."
        })
    }

    const handleCompleteProfileModalClose = (open: boolean) => {
        setShowCompleteProfileModal(open)
        if (!open && isFirstLogin) {
            // If user closes modal without completing, show reminder
            toast({
                title: "Profile Incomplete",
                description: "Please complete your profile to access all features.",
                variant: "destructive"
            })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <div className="h-64 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="h-64 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!doctorData) {
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



    const profileIncomplete = isProfileIncomplete(doctorData)


    return (
        <div className="container mx-auto p-6 space-y-6">

            {/* Profile Incomplete Alert */}
            {profileIncomplete && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">Profile Incomplete</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                        Please complete your profile to access all CliniTrack features and improve your visibility.
                        <DoctorProfileDialog
                            doctorData={doctorData}
                            mode="create"
                            onCreate={handleProfileCreate}
                            isOpen={showCompleteProfileModal}
                            onOpenChange={handleCompleteProfileModalClose}
                            triggerButton={false}
                        />
                    </AlertDescription>
                </Alert>
            )}
            {/* Header
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your professional information and settings
                    </p>
                </div>
                <EditProfileDialog
                    doctorData={doctorData}
                    onUpdate={handleProfileUpdate}
                />
            </div> */}
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your professional information and settings
                    </p>
                </div>
                {!profileIncomplete && (
                    <DoctorProfileDialog
                        doctorData={doctorData}
                        onUpdate={handleProfileUpdate}
                        mode="edit"
                        triggerButton={true}
                    />
                )}
                {profileIncomplete && (
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
                            <AvatarImage src="" alt={doctorData.name} />
                            <AvatarFallback className="text-lg">
                                {getInitials(doctorData.name)}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl">{doctorData.name}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            {doctorData.specialty}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Badge className={getStatusColor(doctorData.status)}>
                                <Activity className="h-3 w-3 mr-1" />
                                {doctorData.status}
                            </Badge>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Provider ID:</span>
                                <span className="text-muted-foreground">{doctorData.providerId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Clinic:</span>
                                <span className="text-muted-foreground">{doctorData.clinicAffiliation}</span>
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
                                    <span>{doctorData.phone}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{doctorData.email}</span>
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
                                <p className="font-medium">{doctorData.address.street}</p>
                                <p className="text-muted-foreground">
                                    {doctorData.address.city}, {doctorData.address.state} {doctorData.address.zipCode}
                                </p>
                                <p className="text-muted-foreground">{doctorData.address.country}</p>
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
                                    <span className="font-mono">{doctorData.licenseNumber}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">NPI Number</label>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono">{doctorData.npiNumber}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Specialty</label>
                                <div className="flex items-center gap-2">
                                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                                    <span>{doctorData.specialty}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <Badge className={getStatusColor(doctorData.status)}>
                                    <Activity className="h-3 w-3 mr-1" />
                                    {doctorData.status}
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
                                <span>{doctorData.createdBy}</span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Updated By</label>
                                <span>{doctorData.updatedBy}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile