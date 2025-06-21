'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Edit, Loader2, UserPlus } from 'lucide-react'
import { DoctorProfileRequest, ProviderAdminProfileRequest } from '../api/types'
import { doctorProfileSchema } from '@/src/validation/schemas'
import { countries, specialties, statusOptions } from '@/src/constants'
import { User } from '@/src/modules/Authentication/auth/api/types'
import { useAppDispatch, useAppSelector } from '@/src/redux/store/reduxHook'
import { ProviderAdminProfileApi } from '../api/api'
import { clearDoctors } from '../api/slice'

// interface DoctorProfile extends DoctorProfileRequest {
//     id?: string
// }

type DoctorProfile = Partial<ProviderAdminProfileRequest>;


interface DoctorProfileDialogProps {
    doctorData?: DoctorProfile | null
    onUpdate?: (updatedData: DoctorProfile) => void
    onCreate?: (newData: DoctorProfile) => void
    mode: 'create' | 'edit'
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
    triggerButton?: boolean // Whether to show the trigger button
}

// Default empty profile for create mode
const defaultDoctorProfile: DoctorProfile = {
    providerId: '',
    name: '',
    specialty: '',
    phone: '',
    email: '',
    address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    },
    licenseNumber: '',
    npiNumber: '',
    clinicAffiliation: '',
    status: 'Pending',
    createdBy: '',
    updatedBy: ''
}

export const DoctorProfileDialog: React.FC<DoctorProfileDialogProps> = ({
    doctorData,
    onUpdate,
    onCreate,
    mode,
    isOpen,
    onOpenChange,
    triggerButton = true
}) => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth)
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()

    const isCreateMode = mode === 'create'
    const isEditMode = mode === 'edit'

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<DoctorProfileRequest>({
        resolver: yupResolver(doctorProfileSchema),
        defaultValues: isCreateMode ? defaultDoctorProfile : doctorData || defaultDoctorProfile
    })

    useEffect(() => {
        setOpen(isOpen ?? false)
    }, [isOpen])


    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            const formData = isCreateMode ? defaultDoctorProfile : doctorData || defaultDoctorProfile
            reset(formData)
        }
    }, [open, doctorData, reset, isCreateMode])

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange?.(newOpen)
    }

    const onSubmit = async (data: DoctorProfileRequest) => {
        setIsSubmitting(true)
        try {
            if (isCreateMode) {
                // Create new doctor profile
                const enrichedData = {
                    ...data,
                    providerId: user?.id || '',
                    createdBy: user?.username || '',
                    updatedBy: user?.username || '',
                    status: 'Inactive', // instead of 'Pending'
                };

                const newProfile = await ProviderAdminProfileApi.create(enrichedData);

                if (newProfile.success) {
                    // Clear Redux state to trigger refetch
                    dispatch(clearDoctors());
                    onCreate?.(newProfile.data)
                    toast({
                        title: "Success",
                        description: "Doctor profile created successfully"
                    })
                }
            } else {
                const enrichedUpdate: ProviderAdminProfileRequest = {
                    ...(data as ProviderAdminProfileRequest),
                    updatedBy: user?.username || '',
                };
                // Update existing doctor profile
                const updatedProfile = await ProviderAdminProfileApi.update(doctorData?._id || '', enrichedUpdate)

                if (updatedProfile.success) {
                    // Clear Redux state to trigger refetch
                    dispatch(clearDoctors());

                    onUpdate?.(updatedProfile.data)
                    toast({
                        title: "Success",
                        description: "Profile updated successfully"
                    })
                }
            }

            handleOpenChange(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || `Failed to ${isCreateMode ? 'create' : 'update'} profile`,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancel = () => {
        const formData = isCreateMode ? defaultDoctorProfile : doctorData || defaultDoctorProfile
        reset(formData)
        handleOpenChange(false)
    }

    const DialogComponent = (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {triggerButton && (
                <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                        {isCreateMode ? (
                            <>
                                <UserPlus className="h-4 w-4" />
                                Complete Profile
                            </>
                        ) : (
                            <>
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </>
                        )}
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isCreateMode ? 'Complete Your Doctor Profile' : 'Edit Doctor Profile'}
                    </DialogTitle>
                    <DialogDescription>
                        {isCreateMode
                            ? 'Please complete your professional information to access all features.'
                            : 'Update your professional information. Changes will be reflected immediately.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    {...register('name')}
                                    placeholder="Dr. John Doe"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty *</Label>
                                <Select
                                    value={watch('specialty')}
                                    onValueChange={(value) => setValue('specialty', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {specialties.map((specialty) => (
                                            <SelectItem key={specialty} value={specialty}>
                                                {specialty}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.specialty && (
                                    <p className="text-sm text-red-500">{errors.specialty.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    {...register('phone')}
                                    placeholder="+966502345678"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    placeholder="doctor@example.com"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Address Information</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="street">Street Address *</Label>
                                <Input
                                    id="street"
                                    {...register('address.street')}
                                    placeholder="123 Medical Center Blvd"
                                />
                                {errors.address?.street && (
                                    <p className="text-sm text-red-500">{errors.address.street.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        {...register('address.city')}
                                        placeholder="Riyadh"
                                    />
                                    {errors.address?.city && (
                                        <p className="text-sm text-red-500">{errors.address.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province *</Label>
                                    <Input
                                        id="state"
                                        {...register('address.state')}
                                        placeholder="Riyadh Province"
                                    />
                                    {errors.address?.state && (
                                        <p className="text-sm text-red-500">{errors.address.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zipCode">Zip Code *</Label>
                                    <Input
                                        id="zipCode"
                                        {...register('address.zipCode')}
                                        placeholder="12345"
                                    />
                                    {errors.address?.zipCode && (
                                        <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Select
                                    value={watch('address.country')}
                                    onValueChange={(value) => setValue('address.country', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country} value={country}>
                                                {country}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.address?.country && (
                                    <p className="text-sm text-red-500">{errors.address.country.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Professional Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    {...register('licenseNumber')}
                                    placeholder="MD-12345"
                                />
                                {errors.licenseNumber && (
                                    <p className="text-sm text-red-500">{errors.licenseNumber.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="npiNumber">NPI Number *</Label>
                                <Input
                                    id="npiNumber"
                                    {...register('npiNumber')}
                                    placeholder="1234567890"
                                />
                                {errors.npiNumber && (
                                    <p className="text-sm text-red-500">{errors.npiNumber.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="clinicAffiliation">Clinic Affiliation *</Label>
                                <Input
                                    id="clinicAffiliation"
                                    {...register('clinicAffiliation')}
                                    placeholder="Medical Center Name"
                                />
                                {errors.clinicAffiliation && (
                                    <p className="text-sm text-red-500">{errors.clinicAffiliation.message}</p>
                                )}
                            </div>

                            {isEditMode && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={watch('status')}
                                        onValueChange={(value) => setValue('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status.message}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            {isCreateMode ? 'Skip for Now' : 'Cancel'}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isCreateMode ? 'Creating...' : 'Updating...'}
                                </>
                            ) : (
                                isCreateMode ? 'Complete Profile' : 'Update Profile'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )

    return DialogComponent
}