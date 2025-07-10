"use client";
import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Edit, Loader2, Plus, X } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { medicalRecordValidationSchema } from "../validation/schemas"
import { FormikHelpers, getIn, useFormik } from 'formik'
import { useMedicalRecord } from "../redux/providers/contexts/MedicalRecordContext";
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook";
import { clearCreateError, clearUpdateError, fetchSelectedPatientProviders } from "../modules/Dashboard/medicalRecords/api/slice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";


interface MedicalRecordFormValues {
  patientId: string;
  providerId: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
  recordDate: string;
  createdBy: string;
  updatedBy: string;
}


interface MedicalRecordFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MedicalRecordForm({ open, onOpenChange }: MedicalRecordFormProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast()

  // CONTEXT STATES
  const {
    isEditing,
    setIsEditing,
    profile,
    medicalRecord,
    SelectPatientProvider,
    setMedicalRecord,
    handleSaveMedicalRecord,
    setMedicalRecordFormOpen,
  } = useMedicalRecord();

  // REDUX STATE
  const {
    createError,
    createLoading,
    createSuccess,
    updateError,
    updateLoading,
    updateSuccess,
    selectedError,
    selectedLoading,
  } = useAppSelector(state => state.medicalRecord);

  console.log(SelectPatientProvider);

  const initialMedicalRecordValues: MedicalRecordFormValues = {
    patientId: "",
    providerId: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
    recordDate: "",
    createdBy: profile?.fullName || "",
    updatedBy: profile?.fullName || "",
  }

  // Determine mode based on editingItem
  const mode = isEditing ? 'edit' : 'create';
  const isLoading = isEditing ? updateLoading : createLoading;
  const errorMessage = isEditing ? updateError : createError;

  // Helper function to extract ID from object or return string as-is
  const extractId = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value._id) return value._id;
    return '';
  };

  // Determine initial values based on mode
  const getInitialValues = useMemo((): MedicalRecordFormValues => {
    if (mode === "edit" && medicalRecord) {
      return {
        patientId: extractId(medicalRecord.patientId),
        providerId: extractId(medicalRecord.providerId),
        diagnosis: medicalRecord.diagnosis,
        treatment: medicalRecord.treatment,
        prescription: medicalRecord.prescription,
        notes: medicalRecord.notes,
        recordDate: medicalRecord.recordDate,
        createdBy: medicalRecord.createdBy,
        updatedBy: profile?.fullName || ""
      };
    }
    return initialMedicalRecordValues
  }, [mode, medicalRecord, profile])

  const handleMedicalForm = useCallback(async (values: MedicalRecordFormValues, actions: FormikHelpers<MedicalRecordFormValues>) => {
    try {
      handleSaveMedicalRecord(values, () => {
        actions.resetForm();
        actions.setSubmitting(false);
        onOpenChange(false)
        toast({
          title: isEditing ? "Medical Record Updated" : "Medical Record Created",
          description: isEditing ? "Medical Record updated successfully!" : "Medical Record created successfully!",
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
  }, [handleSaveMedicalRecord, isEditing, onOpenChange, toast, errorMessage])

  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema: medicalRecordValidationSchema,
    onSubmit: handleMedicalForm,
    enableReinitialize: true,
  });

  // Get unique providers from SelectPatientProvider
  const uniqueProviders = useMemo(() => {
    const providerMap = new Map();
    SelectPatientProvider.forEach(item => {
      if (!providerMap.has(item.provider._id)) {
        providerMap.set(item.provider._id, item.provider);
      }
    });
    return Array.from(providerMap.values());
  }, [SelectPatientProvider]);

  // Get patients available for selected provider or all if no provider selected
  const availablePatients = useMemo(() => {
    if (!formik.values.providerId) {
      // If no provider selected, show all patients
      const patientMap = new Map();
      SelectPatientProvider.forEach(item => {
        if (!patientMap.has(item.patient._id)) {
          patientMap.set(item.patient._id, item.patient);
        }
      });
      return Array.from(patientMap.values());
    }

    // Filter patients for selected provider
    return SelectPatientProvider
      .filter(item => item.provider._id === formik.values.providerId)
      .map(item => item.patient);
  }, [SelectPatientProvider, formik.values.providerId]);


  // Handle provider change and reset patient if needed
  const handleProviderChange = (providerId: string) => {
    formik.setFieldValue('providerId', providerId);

    // Check if current patient is still available with new provider
    const isPatientAvailable = SelectPatientProvider.some(
      item => item.provider._id === providerId && item.patient._id === formik.values.patientId
    );

    if (!isPatientAvailable) {
      formik.setFieldValue('patientId', ''); // Reset patient selection
    }
  };

  // Handle patient change and automatically set provider
  const handlePatientChange = (patientId: string) => {
    formik.setFieldValue('patientId', patientId);

    // Find the provider for this patient
    const patientProvider = SelectPatientProvider.find(
      item => item.patient._id === patientId
    );

    if (patientProvider) {
      formik.setFieldValue('providerId', patientProvider.provider._id);
    }
  };

  const handleCancel = () => {
    setMedicalRecord(null);
    setMedicalRecordFormOpen(false);
    setIsEditing(false);
  };

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
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'create' ? 'Create New Medical Record' : 'Edit Medical Record'}
          </DialogTitle>
          {errorMessage && !isLoading && (
            <p className="text-red-500 rounded-md py-3 text-center bg-red-300 text-sm">{errorMessage}</p>
          )}
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-4">
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Patient & Provider</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="providerId">Provider *</Label>
                <Select
                  value={formik.values.providerId}
                  onValueChange={handleProviderChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select Provider" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {uniqueProviders.map((provider) => (
                      <SelectItem key={provider._id} value={provider._id}>
                        {provider.name} - {provider.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("providerId") && (
                  <p className="text-red-500 text-sm">{formik.errors.providerId}</p>
                )}
              </div>

              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient *</Label>
                <Select
                  value={formik.values.patientId}
                  onValueChange={handlePatientChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select Patient" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 text-white">
                    {availablePatients.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.name} - {patient.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError("patientId") && (
                  <p className="text-red-500 text-sm">{formik.errors.patientId}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Diagnosis & Treatment</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis *</Label>
                <Input
                  id="diagnosis"
                  name="diagnosis"
                  value={formik.values.diagnosis}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter diagnosis"
                  disabled={isLoading}
                />
                {getFieldError("diagnosis") && (
                  <p className="text-red-500 text-sm">{formik.errors.diagnosis}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment *</Label>
                  <Textarea
                    id="treatment"
                    name="treatment"
                    value={formik.values.treatment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Describe treatment"
                    disabled={isLoading}
                  />
                  {getFieldError("treatment") && (
                    <p className="text-red-500 text-sm">{formik.errors.treatment}</p>
                  )}
                </div>

                {/* Prescriptions */}
                <div className="space-y-2">
                  <Label htmlFor="prescription">Prescription *</Label>
                  <Textarea
                    id="prescription"
                    name="prescription"
                    value={formik.values.prescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600"
                    placeholder="Enter prescription"
                    disabled={isLoading}
                  />
                  {getFieldError("prescription") && (
                    <p className="text-red-500 text-sm">{formik.errors.prescription}</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Notes & Record Date</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recordDate">Record Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full bg-slate-700 border-slate-600 text-left text-white font-normal"
                    >
                      {formik.values.recordDate ? (
                        formik.values.recordDate
                      ) : (
                        <span>Select date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto bg-white p-0">
                    <Calendar
                      mode="single"
                      selected={formik.values.recordDate ? new Date(formik.values.recordDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const isoDate = date.toISOString().split("T")[0];
                          formik.setFieldValue("recordDate", isoDate);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {getFieldError("recordDate") && (
                  <p className="text-red-500 text-sm">{formik.errors.recordDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Optional notes..."
                  disabled={isLoading}
                />
                {getFieldError("notes") && (
                  <p className="text-red-500 text-sm">{formik.errors.notes}</p>
                )}
              </div>


            </CardContent>

          </Card>

          {/* Metadata Section */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Audit Info</CardTitle>
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

          <div className="flex justify-end space-x-4 pt-6 border-t">
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
      </DialogContent>
    </Dialog>
  )
}