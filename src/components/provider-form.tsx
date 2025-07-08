"use client"

import { useState, useEffect, act, useCallback } from "react"
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
import { DepartmentName, DepartmentNameValues, ProviderStatus, ProviderStatusValues } from "../enum"
import { generateId } from "../utils/idGenerator"
import { providerValidationSchema } from "../validation/schemas"
import { useProvider } from "../redux/providers/contexts/ProviderContext"
import { useToast } from "@/hooks/use-toast"
import { FormikHelpers, getIn, useFormik } from "formik"
import { fetchProfile } from "../modules/Authentication/profile/api/slice"



interface ProviderFormValues {
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    providerId: string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    licenseNumber: string;
    npiNumber: string;
    clinicAffiliation: string;
    status: ProviderStatus.ACTIVE | ProviderStatus.INACTIVE;
    createdBy: string;
    updatedBy: string;
}

interface ProviderFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}



export function ProviderForm({ open, onOpenChange }: ProviderFormProps) {
    const dispatch = useAppDispatch();
    const { toast } = useToast();
    const { profile } = useAppSelector(state => state.profile)

    // Fetch profile when component mounts
    useEffect(() => {
        if (open) {
            if (!profile) {
                dispatch(fetchProfile())
            }
        }
    }, [open, dispatch, profile]);


    const initialProviderValues: ProviderFormValues = {
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        },
        providerId: "",
        name: "",
        specialty: DepartmentName.GASTROENTEROLOGY,
        phone: "",
        email: "",
        licenseNumber: "",
        npiNumber: "",
        clinicAffiliation: "",
        status: ProviderStatus.ACTIVE,
        createdBy: profile?.name || "",
        updatedBy: profile?.name || ""
    }

    // CONTEXT STATES
    const {
        isEditing,
        provider,
        handleSaveProvider,
    } = useProvider();

    //REDUX STATES
    const {
        createError,
        createLoading,
        updateError,
        createSuccess,
        updateSuccess,
        updateLoading,
    } = useAppSelector(state => state.provider)

    // Determine mode based on editingItem
    const mode = isEditing ? 'edit' : 'create';
    const isLoading = isEditing ? updateLoading : createLoading;
    const errorMessage = isEditing ? updateError : createError;

    const getInitialValues = (): ProviderFormValues => {
        if (mode === 'edit' && provider) {
            return {
                address: {
                    street: provider.address.street || "",
                    city: provider.address.city || "",
                    state: provider.address.state || "",
                    zipCode: provider.address.zipCode || "",
                    country: provider.address.country || ""
                },
                providerId: provider.providerId || "",
                name: provider.name || "",
                specialty: provider.specialty || DepartmentName.GASTROENTEROLOGY,
                phone: provider.phone || "",
                email: provider.email || "",
                licenseNumber: provider.licenseNumber || "",
                npiNumber: provider.npiNumber || "",
                clinicAffiliation: provider.clinicAffiliation || "",
                status: provider.status || ProviderStatus.ACTIVE,
                createdBy: provider.createdBy || "",
                updatedBy: profile?.name || ""
            }
        }
        return initialProviderValues
    }

    const handleProviderForm = async (values: ProviderFormValues, actions: FormikHelpers<ProviderFormValues>) => {
        try {
            handleSaveProvider(values, () => {
                actions.resetForm();
                actions.setSubmitting(false);
                onOpenChange(false);

                // ✅ show toast
                toast({
                    title: isEditing ? "Provider Updated" : "Provider Created",
                    description: isEditing ? "Provider details updated successfully." : "New provider added successfully.",
                });
            });
        } catch (error) {
            actions.setSubmitting(false);
            toast({
                title: "Error",
                description: errorMessage || "An error occurred while processing your request.",
                variant: "destructive",
            });
        }
    }

    const formik = useFormik({
        initialValues: getInitialValues(),
        validationSchema: providerValidationSchema,
        onSubmit: handleProviderForm,
        enableReinitialize: true,
    });

    const handleGenerateId = useCallback(() => {
        const newId = generateId({ prefix: "PROV", suffix: "DOC" })
        formik.setFieldValue('providerId', newId)
    }, [formik])

    // Function to get field error
    const getFieldError = (fieldName: string) => {
        const touched = getIn(formik.touched, fieldName);
        const error = getIn(formik.errors, fieldName);
        return touched && error ? error : null;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-slate-700 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {mode === "create" ? "Add New Provider" : "Edit Provider"}
                    </DialogTitle>
                    <p className="text-slate-400">
                        {mode === 'create' ? "Fill in the details below to add a new provider to your system" : "Update the provider information using the form below"}
                    </p>
                    {errorMessage && (
                        <p className="text-red-500 rounded-md py-3 text-center bg-red-300 text-sm">{errorMessage}</p>
                    )}
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    {/* Provider Information Section */}
                    <Card className="bg-slate-800 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Provider Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Provider ID */}
                            <div className="space-y-2">
                                <div className="flex items-end gap-2">
                                    <div className="space-y-2 w-full">
                                        <Label htmlFor="providerId">{mode === 'edit' ? 'Provider ID *' : 'Generated Provider ID'}</Label>
                                        <Input
                                            id="providerId"
                                            name="providerId"
                                            readOnly
                                            value={formik.values.providerId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="bg-slate-700 border-slate-600"
                                            placeholder="p-001"
                                            disabled={isLoading}
                                        />

                                    </div>
                                    {mode === 'create' && (
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={handleGenerateId}
                                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Regenerate
                                        </button>
                                    )}
                                </div>
                                {getFieldError('providerId') && (
                                    <p className="text-red-500 text-sm">{formik.errors.providerId}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Professional Details Section */}
                    <Card className="bg-slate-800 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Professional Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    autoComplete="given-name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="Dr. John Doe"
                                    disabled={isLoading}
                                />
                                {getFieldError('name') && (
                                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Specialty */}
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty *</Label>
                                <Select
                                    value={formik.values.specialty}
                                    onValueChange={(value) => formik.setFieldValue("specialty", value)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="bg-slate-700 border-slate-600">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DepartmentNameValues.map((Department) => (
                                            <SelectItem key={Department} value={Department}>
                                                {Department}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getFieldError('specialty') && (
                                    <p className="text-red-500 text-sm">{formik.errors.specialty}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    value={formik.values.phone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="+1 234 567 8900"
                                    disabled={isLoading}
                                />
                                {getFieldError('phone') && (
                                    <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="example@hospital.com"
                                    disabled={isLoading}
                                />
                                {getFieldError('email') && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>

                            {/* License Number */}
                            <div className="space-y-2">
                                <Label htmlFor="licenseNumber">License Number *</Label>
                                <Input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formik.values.licenseNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="123456789"
                                    disabled={isLoading}
                                />
                                {getFieldError('licenseNumber') && (
                                    <p className="text-red-500 text-sm">{formik.errors.licenseNumber}</p>
                                )}
                            </div>

                            {/* NPI Number */}
                            <div className="space-y-2">
                                <Label htmlFor="npiNumber">NPI Number *</Label>
                                <Input
                                    id="npiNumber"
                                    name="npiNumber"
                                    value={formik.values.npiNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="1234567890"
                                    disabled={isLoading}
                                />
                                {getFieldError('npiNumber') && (
                                    <p className="text-red-500 text-sm">{formik.errors.npiNumber}</p>
                                )}
                            </div>

                            {/* Clinic Affiliation */}
                            <div className="space-y-2">
                                <Label htmlFor="clinicAffiliation">Clinic Affiliation *</Label>
                                <Input
                                    id="clinicAffiliation"
                                    name="clinicAffiliation"
                                    value={formik.values.clinicAffiliation}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="ABC Clinic"
                                    disabled={isLoading}
                                />
                                {getFieldError('clinicAffiliation') && (
                                    <p className="text-red-500 text-sm">{formik.errors.clinicAffiliation}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={formik.values.status}
                                    onValueChange={(value) => formik.setFieldValue("status", value as ProviderStatus)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="bg-slate-700 border-slate-600">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ProviderStatusValues.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getFieldError('status') && (
                                    <p className="text-red-500 text-sm">{formik.errors.status}</p>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* Address Information Section */}
                    <Card className="bg-slate-800 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Address Information</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="address.street">Street *</Label>
                                <Input
                                    id="address.street"
                                    name="address.street"
                                    value={formik.values.address.street}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="123 Main St"
                                    disabled={isLoading}
                                />
                                {getFieldError('address.street') && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError('address.street')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.city">City *</Label>
                                <Input
                                    id="address.city"
                                    name="address.city"
                                    value={formik.values.address.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="New York"
                                    disabled={isLoading}
                                />
                                {getFieldError('address.city') && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError('address.city')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.state">State *</Label>
                                <Input
                                    id="address.state"
                                    name="address.state"
                                    value={formik.values.address.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="NY"
                                    disabled={isLoading}
                                />
                                {getFieldError('address.state') && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError('address.state')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.zipCode">Zip Code *</Label>
                                <Input
                                    id="address.zipCode"
                                    name="address.zipCode"
                                    value={formik.values.address.zipCode}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="10001"
                                    disabled={isLoading}
                                />
                                {getFieldError('address.zipCode') && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError('address.zipCode')}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address.country">Country *</Label>
                                <Input
                                    id="address.country"
                                    name="address.country"
                                    value={formik.values.address.country}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="USA"
                                    disabled={isLoading}
                                />
                                {getFieldError('address.country') && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError('address.country')}</p>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* Metadata Section */}
                    <Card className="bg-slate-800 border-slate-700 text-white">
                        <CardHeader>
                            <CardTitle className="text-white">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="createdBy">Created By *</Label>
                                <Input
                                    id="createdBy"
                                    name="createdBy"
                                    value={formik.values.createdBy}
                                    disabled // <-- DISABLED
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="Auto-filled"
                                />
                                {getFieldError('createdBy') && (
                                    <p className="text-red-500 text-sm">{formik.errors.createdBy}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="updatedBy">Updated By *</Label>
                                <Input
                                    id="updatedBy"
                                    name="updatedBy"
                                    value={formik.values.updatedBy}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoading}
                                    className="bg-slate-700 border-slate-600"
                                    placeholder="Enter updater name"
                                />
                                {getFieldError('updatedBy') && (
                                    <p className="text-red-500 text-sm">{formik.errors.updatedBy}</p>
                                )}
                            </div>

                        </CardContent>
                    </Card>


                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={formik.isSubmitting || isLoading}
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === 'edit' ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    {mode === 'edit' ? 'Update Provider' : 'Save Provider'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}