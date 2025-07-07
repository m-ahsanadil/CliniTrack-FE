"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { Loader2, MapPin, User, Phone, Mail, Shield, Building2 } from "lucide-react"
import { Provider, ProviderRequest } from "../modules/Dashboard/Provider/api/types"
import { createProvider, fetchAllProviders, updateProvider } from "../modules/Dashboard/Provider/api/slice"
import { DepartmentName, DepartmentNameValues, ProviderStatus, ProviderStatusValues } from "../enum"
import { generateId } from "../utils/idGenerator"
import { providerValidationSchema } from "../validation/schemas"
import { useProvider } from "../redux/providers/contexts/ProviderContext"

interface ProviderFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}



export function ProviderForm({ open, onOpenChange }: ProviderFormProps) {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(state => state.auth)
    const [loading, setLoading] = useState(false)

    // CONTEXT STATES
    const {
        isEditing,
        setIsEditing,
        provider,
        setProvider,
        handleSaveProvider,
        setProviderFormOpen
    } = useProvider();

    const {
        createError,
        createLoading,
        updateError,
        updateLoading,
    } = useAppSelector(state => state.provider)

    // Determine mode based on editingItem
    const mode = isEditing ? 'edit' : 'create';
    const isLoading = isEditing ? updateLoading : createLoading;
    const errorMessage = isEditing ? updateError : createError;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProviderRequest>({
        resolver: yupResolver(providerValidationSchema),

        defaultValues: {
            providerId: "",
            name: "",
            specialty: "",
            phone: "",
            email: "",
            licenseNumber: "",
            npiNumber: "",
            clinicAffiliation: "",
            status: ProviderStatus.ACTIVE,
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            },
            createdBy: "",
            updatedBy: "",
        },
    })

    const watchedSpecialty = watch("specialty")
    const watchedStatus = watch("status")


    // Populate form when editing
    useEffect(() => {
        if (provider && mode === "edit") {
            reset({
                providerId: provider.providerId || "",
                name: provider.name || "",
                email: provider.email || "",
                phone: provider.phone || "",
                licenseNumber: provider.licenseNumber || "",
                npiNumber: provider.npiNumber || "",
                specialty: provider.specialty || "",
                clinicAffiliation: provider.clinicAffiliation || "",
                status: provider.status || ProviderStatus.ACTIVE,
                address: {
                    street: provider.address?.street || "",
                    city: provider.address?.city || "",
                    state: provider.address?.state || "",
                    country: provider.address?.country || "",
                    zipCode: provider.address?.zipCode || "",
                },
                createdBy: provider.createdBy,
                updatedBy: provider.updatedBy
            })
        } else if (mode === "create") {
            reset({
                name: "",
                email: "",
                phone: "",
                licenseNumber: "",
                npiNumber: "",
                specialty: "",
                clinicAffiliation: "",
                status: ProviderStatus.INACTIVE,
                address: {
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    zipCode: "",
                },
                createdBy: "",
                updatedBy: ""
            })
        }
    }, [provider, mode, reset])

    const onSubmit = async (data: ProviderRequest) => {
        setLoading(true)
        try {
            const providerData = {
                ...data,
                ...(mode === "create" && {
                    providerId: data.providerId || generateId({ prefix: "PROV", suffix: "DOC" }),
                    createdBy: user?.email || "system",
                    updatedBy: user?.email || "system",
                }),
                ...(mode === "edit" && {
                    updatedBy: user?.email || "system",
                }),
            }


            if (mode === "create") {
                await dispatch(createProvider(providerData)).unwrap()
            } else {
                await dispatch(updateProvider({
                    id: provider?._id!,
                    data: providerData
                })).unwrap()

            }

            dispatch(fetchAllProviders())
            onSave?.(providerData as Provider)
            onOpenChange(false)
            reset()
        } catch (error) {
            console.error("Error saving provider:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        reset()
        onOpenChange(false)
    }

    const handleGenerateId = () => {
        const newId = generateId({ prefix: "PROV", suffix: "DOC" })
        setValue("providerId", newId)
    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-700 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {mode === "create" ? "Add New Provider" : "Edit Provider"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-4 w-4" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Provider ID Field - Show in both modes but handle differently */}
                                <div className="space-y-2">
                                    <Label htmlFor="providerId">Provider ID</Label>
                                    <Input
                                        id="providerId"
                                        {...register("providerId")}
                                        disabled={mode === "edit"}
                                        placeholder={mode === "create" ? "Click Generate ID" : ""}
                                        className={mode === "edit" ? "cursor-not-allowed" : ""}
                                    />
                                </div>

                                {/* Generate ID Button - Only show in create mode */}
                                {mode === "create" && (
                                    <div className="space-y-2 flex flex-col justify-end">
                                        <Label>&nbsp;</Label>
                                        <Button type="button" onClick={handleGenerateId} variant="outline">
                                            Generate ID
                                        </Button>
                                    </div>
                                )}


                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        {...register("name")}
                                        placeholder="Dr. John Doe"
                                        className={errors.name ? "border-red-500" : ""}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        placeholder="john.doe@clinic.com"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone *</Label>
                                    <Input
                                        id="phone"
                                        {...register("phone")}
                                        placeholder="+966502345678"
                                        className={errors.phone ? "border-red-500" : ""}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Specialty *</Label>
                                    <Select
                                        value={watchedSpecialty}
                                        onValueChange={(value) => setValue("specialty", value)}
                                    >
                                        <SelectTrigger className={errors.specialty ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Select specialty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DepartmentNameValues.map((specialty: DepartmentName) => (
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
                        </CardContent>
                    </Card>

                    {/* Professional Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-4 w-4" />
                                Professional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="licenseNumber">License Number *</Label>
                                    <Input
                                        id="licenseNumber"
                                        {...register("licenseNumber")}
                                        placeholder="MD-56789"
                                        className={errors.licenseNumber ? "border-red-500" : ""}
                                    />
                                    {errors.licenseNumber && (
                                        <p className="text-sm text-red-500">{errors.licenseNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="npiNumber">NPI Number *</Label>
                                    <Input
                                        id="npiNumber"
                                        {...register("npiNumber")}
                                        placeholder="1234567890"
                                        className={errors.npiNumber ? "border-red-500" : ""}
                                    />
                                    {errors.npiNumber && (
                                        <p className="text-sm text-red-500">{errors.npiNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clinicAffiliation">Clinic Affiliation *</Label>
                                    <Input
                                        id="clinicAffiliation"
                                        {...register("clinicAffiliation")}
                                        placeholder="CliniTrack Clinic"
                                        className={errors.clinicAffiliation ? "border-red-500" : ""}
                                    />
                                    {errors.clinicAffiliation && (
                                        <p className="text-sm text-red-500">{errors.clinicAffiliation.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={watchedStatus}
                                        onValueChange={(value) => setValue("status", value as ProviderStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ProviderStatusValues.map((status: ProviderStatus) => (
                                                <SelectItem key={status} value={status}>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={
                                                            status === ProviderStatus.ACTIVE ? "default" :
                                                                status === ProviderStatus.INACTIVE ? "secondary" :
                                                                    "destructive"
                                                        }>
                                                            {status}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-4 w-4" />
                                Address Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2 space-y-2">
                                    <Label htmlFor="address.street">Street Address *</Label>
                                    <Input
                                        id="address.street"
                                        {...register("address.street")}
                                        placeholder="456 Health Blvd"
                                        className={errors.address?.street ? "border-red-500" : ""}
                                    />
                                    {errors.address?.street && (
                                        <p className="text-sm text-red-500">{errors.address.street.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address.city">City *</Label>
                                    <Input
                                        id="address.city"
                                        {...register("address.city")}
                                        placeholder="Dammam"
                                        className={errors.address?.city ? "border-red-500" : ""}
                                    />
                                    {errors.address?.city && (
                                        <p className="text-sm text-red-500">{errors.address.city.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address.state">State/Province *</Label>
                                    <Input
                                        id="address.state"
                                        {...register("address.state")}
                                        placeholder="Eastern Province"
                                        className={errors.address?.state ? "border-red-500" : ""}
                                    />
                                    {errors.address?.state && (
                                        <p className="text-sm text-red-500">{errors.address.state.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address.country">Country *</Label>
                                    <Input
                                        id="address.country"
                                        {...register("address.country")}
                                        placeholder="Saudi Arabia"
                                        className={errors.address?.country ? "border-red-500" : ""}
                                    />
                                    {errors.address?.country && (
                                        <p className="text-sm text-red-500">{errors.address.country.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address.zipCode">Zip Code *</Label>
                                    <Input
                                        id="address.zipCode"
                                        {...register("address.zipCode")}
                                        placeholder="31412"
                                        className={errors.address?.zipCode ? "border-red-500" : ""}
                                    />
                                    {errors.address?.zipCode && (
                                        <p className="text-sm text-red-500">{errors.address.zipCode.message}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SYSTEM INFORMATION */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="h-4 w-4" />
                                System Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="space-y-2">
                                    <Label htmlFor="createdBy">Created By</Label>
                                    <Input
                                        id="createdBy"
                                        {...register("createdBy")}
                                        disabled
                                        placeholder="Created By"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="updatedBy">Updated By</Label>
                                    <Input
                                        id="updatedBy"
                                        {...register("updatedBy")}
                                        disabled
                                        placeholder="Updated By"
                                    />
                                </div>

                            </div>
                        </CardContent>
                    </Card>


                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {mode === "create" ? "Create Provider" : "Update Provider"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}