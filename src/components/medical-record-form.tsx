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
    selectedPatients,
  } = useAppSelector(state => state.medicalRecord);

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

  // Determine initial values based on mode
  const getInitialValues = useMemo((): MedicalRecordFormValues => {
    if (mode === "edit" && medicalRecord) {
      return {
        patientId: "",
        providerId: "",
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

  const handleCancel = () => {
    setMedicalRecordFormOpen(false);
    setMedicalRecord(null);
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
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle></CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">

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