"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useMemo, useCallback } from "react"
import { formatDate } from "@/src/utils/dateFormatter"
import { UserRole, ReportStatus, ReportType, ReportStatusValues, ReportTypeValues, AppointmentStatusValues } from '@/src/enum';
import { Textarea } from '@/components/ui/textarea';
import { useReport } from '@/src/redux/providers/contexts/ReportContext';
import { formatDateForInput } from '@/src/utils/FormatDateForInput';
import { FormikHelpers, getIn, useFormik } from 'formik';
import { useToast } from '@/hooks/use-toast';
import { reportValidationSchema } from '@/src/validation/schemas';
import { actionAsyncStorage } from 'next/dist/server/app-render/action-async-storage.external';
import { Edit, Loader2, Plus } from 'lucide-react';

interface CreateReportTabProps {
    onCancel?: () => void; // Callback to handle cancel action
}

export interface ReportFormValues {
    title: string;
    description: string;
    reportDate: string;
    reportType: string;
    generatedByUserId: string;
    dataFilters: {
        startDate: string;
        endDate: string;
        status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
    };
    status: ReportStatus.FAILED | ReportStatus.GENERATED | ReportStatus.PENDING;
    createdBy: string;
    updatedBy: string;
}

export const CreateReportTab = ({ onCancel }: CreateReportTabProps) => {
    const { toast } = useToast();
    const {
        report,
        setReport,
        isEditing,
        setIsEditing,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        error,
        profile,
        isDataFetched,
        isDataLoading,
        reportFormOpen,
        setReportFormOpen,
        filteredReport,

        // CRUD operations
        handleEditReport,
        handleSaveReport,
    } = useReport();

    // Enhanced mode determination
    const mode = useMemo(() => {
        if (isEditing && report) return 'edit';
        return 'create';
    }, [isEditing, report]);

    // Loading state based on mode
    const isLoading = useMemo(() => {
        return mode === 'edit' ? updateLoading : createLoading;
    }, [mode, updateLoading, createLoading]);

    const errorMessage = isEditing && error;

    const initialReportValues: ReportFormValues = {
        title: '',
        description: '',
        reportDate: '',
        reportType: ReportType.CLINIC_OPERATIONS,
        generatedByUserId: '',
        dataFilters: {
            startDate: '',
            endDate: '',
            status: ReportStatus.GENERATED
        },
        status: ReportStatus.GENERATED,
        createdBy: profile?.fullName || "",
        updatedBy: profile?.fullName || ""
    }

    const getInitialValues = useMemo((): ReportFormValues => {
        if (mode === 'edit' && report) {
            return {
                title: report.title || '',
                description: report.description || '',
                reportDate: formatDateForInput(report.reportDate) || '',
                reportType: report.reportType || ReportType.CLINIC_OPERATIONS,
                generatedByUserId: report.generatedByUserId || '',
                dataFilters: {
                    startDate: formatDateForInput(report.dataFilters?.startDate) || '',
                    endDate: formatDateForInput(report.dataFilters?.endDate) || '',
                    status: report.dataFilters?.status || ReportStatus.GENERATED
                },
                status: report.status || ReportStatus.GENERATED,
                createdBy: report.createdBy || '',
                updatedBy: profile?.fullName || ""
            }
        }
        return initialReportValues;
    }, [mode, report, profile])

    const handleReportForm = useCallback(async (values: ReportFormValues, actions: FormikHelpers<ReportFormValues>) => {
        try {
            handleSaveReport(values, () => {
                actions.resetForm();
                actions.setSubmitting(false);
                toast({
                    title: isEditing ? "Report Updated" : "Report Created",
                    description: isEditing ? "Report updated successfully!" : "Report created successfully!",
                });
            })
        } catch (error) {
            actions.setSubmitting(false);
            toast({
                title: "Error",
                description: errorMessage || "An error occurred while processing your request.",
                variant: "destructive",
            });
        }
    }, [handleSaveReport, isEditing, toast, errorMessage])

    const formik = useFormik({
        initialValues: getInitialValues,
        validationSchema: reportValidationSchema,
        onSubmit: handleReportForm,
        enableReinitialize: true,
    });

    const handleCancel = () => {
        setReport(null);
        setReportFormOpen(false);
        setIsEditing(false);

        if (onCancel) {
            onCancel();
        }
    };

    // Function to get field error
    const getFieldError = (fieldName: string) => {
        const touched = getIn(formik.touched, fieldName);
        const error = getIn(formik.errors, fieldName);
        return touched && error ? error : null;
    };


    return (
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle>{mode === "edit" ? "Edit Report" : "Create Report"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={formik.handleSubmit}>
                    <div className='space-y-4'>
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Title *</label>
                                <Input
                                    name="title"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    placeholder="Enter report title"
                                    className="bg-slate-600 border-slate-700 text-white"
                                />
                                {getFieldError("title") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("title")}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Report Date *</label>
                                <Input
                                    type="date"
                                    name="reportDate"
                                    value={formik.values.reportDate}
                                    onChange={formik.handleChange}
                                    className="bg-slate-600 border-slate-700 text-white"
                                />
                                {getFieldError("reportDate") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("reportDate")}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Report Type *</label>
                                <Select
                                    value={formik.values.reportType}
                                    onValueChange={(val) => formik.setFieldValue("reportType", val)}
                                >
                                    <SelectTrigger className="bg-slate-600 border-slate-700 text-white">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ReportTypeValues.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getFieldError("reportType") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("reportType")}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Status *</label>
                                <Select
                                    value={formik.values.status}
                                    onValueChange={(val) => formik.setFieldValue("status", val)}
                                >
                                    <SelectTrigger className="bg-slate-600 border-slate-700 text-white">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="GENERATED">Generated</SelectItem>
                                        <SelectItem value="FAILED">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {getFieldError("status") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("status")}</p>
                                )}
                            </div>
                        </div>

                        {/* Generated By User ID */}
                        <div className='space-y-2'>
                            <label className="text-sm font-medium text-gray-400 mb-1 block">Generated By User ID *</label>
                            <Input
                                name="generatedByUserId"
                                value={formik.values.generatedByUserId}
                                onChange={formik.handleChange}
                                placeholder="Enter user ID who generated this report"
                                className="bg-slate-600 border-slate-700 text-white"
                            />
                            {getFieldError("generatedByUserId") && (
                                <p className="text-red-500 text-sm mt-1">{getFieldError("generatedByUserId")}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className='space-y-2'>
                            <label className="text-sm font-medium text-gray-400 mb-1 block">Description *</label>
                            <Textarea
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                placeholder="Add a detailed description (10-500 characters)"
                                className="bg-slate-600 border-slate-700 text-white"
                                rows={4}
                            />
                            {getFieldError("description") && (
                                <p className="text-red-500 text-sm mt-1">{getFieldError("description")}</p>
                            )}
                        </div>

                        {/* Data Filters Section */}
                        <div className="bg-slate-700 p-4 rounded-lg space-y-4">
                            <h3 className="text-lg font-medium text-white mb-3">Data Filters</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className='space-y-2'>
                                    <label className="text-sm font-medium text-gray-400 mb-1 block">Start Date *</label>
                                    <Input
                                        type="date"
                                        name="dataFilters.startDate"
                                        value={formik.values.dataFilters.startDate}
                                        onChange={formik.handleChange}
                                        className="bg-slate-600 border-slate-700 text-white"
                                    />
                                    {getFieldError("dataFilters.startDate") && (
                                        <p className="text-red-500 text-sm mt-1">{getFieldError("dataFilters.startDate")}</p>
                                    )}
                                </div>

                                <div className='space-y-2'>
                                    <label className="text-sm font-medium text-gray-400 mb-1 block">End Date *</label>
                                    <Input
                                        type="date"
                                        name="dataFilters.endDate"
                                        value={formik.values.dataFilters.endDate}
                                        onChange={formik.handleChange}
                                        className="bg-slate-600 border-slate-700 text-white"
                                    />
                                    {getFieldError("dataFilters.endDate") && (
                                        <p className="text-red-500 text-sm mt-1">{getFieldError("dataFilters.endDate")}</p>
                                    )}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Filter Status *</label>
                                <Select
                                    value={formik.values.dataFilters.status}
                                    onValueChange={(val) => formik.setFieldValue("dataFilters.status", val)}
                                >
                                    <SelectTrigger className="bg-slate-600 border-slate-700 text-white">
                                        <SelectValue placeholder="Select filter status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ReportStatusValues.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {getFieldError("dataFilters.status") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("dataFilters.status")}</p>
                                )}
                            </div>
                        </div>

                        {/* Audit Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Created By *</label>
                                <Input
                                    name="createdBy"
                                    value={formik.values.createdBy}
                                    onChange={formik.handleChange}
                                    placeholder="Enter creator name"
                                    className="bg-slate-600 border-slate-700 text-white"
                                />
                                {getFieldError("createdBy") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("createdBy")}</p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <label className="text-sm font-medium text-gray-400 mb-1 block">Updated By *</label>
                                <Input
                                    name="updatedBy"
                                    value={formik.values.updatedBy}
                                    onChange={formik.handleChange}
                                    placeholder="Enter updater name"
                                    className="bg-slate-600 border-slate-700 text-white"
                                />
                                {getFieldError("updatedBy") && (
                                    <p className="text-red-500 text-sm mt-1">{getFieldError("updatedBy")}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-slate-600">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : mode === 'create' ? (
                                <Plus className="mr-2 h-4 w-4" />
                            ) : (
                                <Edit className="mr-2 h-4 w-4" />
                            )}
                            {isLoading
                                ? `${mode === 'create' ? 'Creating' : 'Updating'}...`
                                : `${mode === 'create' ? 'Save Record' : 'Update Record'}`
                            }
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}