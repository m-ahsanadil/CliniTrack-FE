"use client"

import type React from "react"

import { FormEvent, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { doctors } from "@/src/constants"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { useMedicalRecordsFetcher } from "../modules/Dashboard/medicalRecords/api/useMedicalRecord"
import { clearCreateError, clearCreateSuccess, clearUpdateSuccess, createMedicalRecord, updateMedicalRecord } from "../modules/Dashboard/medicalRecords/api/slice"
import { fetchPatientBasicInfo } from "../modules/Dashboard/patients/api/slice"
import { PatientBasicInfo } from "../modules/Dashboard/patients/api/types"
import { ProviderBasicInfo } from "../modules/Dashboard/Provider/api/types"
import { fetchProviderBasicInfo } from "../modules/Dashboard/Provider/api/slice"
import { extractId } from "../utils/extractIdForSelector"

interface MedicalRecordFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: any
  mode: 'create' | 'edit';
  onSave?: (record: any) => void
  patients: PatientBasicInfo[]
  provider: ProviderBasicInfo[]
}

interface MedicalRecordData {
  id?: string | number
  patientId: string
  providerId: string
  diagnosis: string
  treatment: string
  prescription: string;
  prescriptions?: string[]
  notes: string
  recordDate: string
  createdBy: string
  updatedBy: string
}

// Initial form state
const initialFormState: MedicalRecordData = {
  patientId: "",
  providerId: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  prescriptions: [],
  notes: "",
  recordDate: new Date().toISOString().slice(0, 16),
  createdBy: "",
  updatedBy: "",
}


export default function MedicalRecordForm({ open, onOpenChange, record, onSave, patients, provider, mode = 'create' }: MedicalRecordFormProps) {
  const dispatch = useAppDispatch();
  const { createError, createLoading, createSuccess, updateLoading, updateError, updateSuccess } = useAppSelector(state => state.medicalRecord);

  const [formData, setFormData] = useState<MedicalRecordData>(initialFormState)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(record?.date ? new Date(record.date) : new Date())



  // Initialize form data based on mode
  useEffect(() => {
    if (mode === 'edit' && record) {
      console.log('Record structure:', record);

      // Extract IDs from objects if they are objects, otherwise use as strings
      const patientId = extractId(record.patientId || record.patient);
      const providerId = extractId(record.providerId || record.provider);

      let prescriptions: string[] = [];
      if (record.prescriptions && Array.isArray(record.prescriptions)) {
        prescriptions = record.prescriptions;
      } else if (record.prescription && typeof record.prescription === 'string') {
        // Split by semicolon if it's a concatenated string
        prescriptions = record.prescription.split(';').map((p: string) => p.trim()).filter(Boolean);
      }

      setFormData({
        // id: record._id,
        patientId: patientId,
        providerId: providerId,
        diagnosis: record?.diagnosis || "",
        treatment: record?.treatment || "",
        prescription: record?.prescription || "",
        prescriptions: prescriptions,
        notes: record?.notes || "",
        recordDate: record?.recordDate || new Date().toISOString().slice(0, 16),
        createdBy: record?.createdBy || "",
        updatedBy: record?.updatedBy || "",
      });
      if (record.recordDate) {
        setSelectedDate(new Date(record.recordDate));
      }
    } else {
      setFormData(initialFormState);
    }
  }, [mode, record, open]);

  console.log(formData);


  useEffect(() => {
    if (open) {
      dispatch(fetchPatientBasicInfo());
      dispatch(fetchProviderBasicInfo());
    }
  }, [open, dispatch]);

  // Handle successful creation or update
  useEffect(() => {
    if (createSuccess || updateSuccess) {
      // successHandledRef.current = true;

      if (onSave) {
        onSave({ ...formData, id: record?._id });
      }

      // Clear form data
      setFormData(initialFormState);
      setNewPrescription("");
      setSelectedDate(new Date());

      // Clear success states
      if (createSuccess) {
        dispatch(clearCreateSuccess());
      }
      if (updateSuccess) {
        dispatch(clearUpdateSuccess());
      }

      // Close dialog
      onOpenChange(false);
    }
  }, [createSuccess, updateSuccess]);
  // Clear errors when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearCreateError());
    }
  }, [open, dispatch]);


  const [newPrescription, setNewPrescription] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Prepare data for submission
    const submissionData: MedicalRecordData = {
      ...formData,
      recordDate: selectedDate ? selectedDate.toISOString() : formData.recordDate,
      // id: record?._id,
      prescription: formData.prescriptions?.length ? formData.prescriptions.join('; ') : formData.prescription,
    }
    console.log(submissionData);

    if (mode === 'edit' && record?._id) {
      // Dispatch update action
      dispatch(updateMedicalRecord({
        id: record._id,
        medicalRecordData: submissionData,
      }));
    } else {
      // Dispatch create action
      dispatch(createMedicalRecord(submissionData));
    }
    // onOpenChange(false)
  }


  const addPrescription = () => {
    if (newPrescription.trim()) {
      setFormData({
        ...formData,
        prescriptions: [...(formData.prescriptions || []), newPrescription.trim()],
      });
      setNewPrescription("");
    }
  };

  const removePrescription = (index: number) => {
    setFormData({
      ...formData,
      prescriptions: formData.prescriptions?.filter((_, i) => i !== index) || [],
    });
  };

  // Get current loading state and error based on mode
  const isLoading = mode === 'edit' ? updateLoading : createLoading;
  const currentError = mode === 'edit' ? updateError : createError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Medical Record" : "Add New Medical Record"}</DialogTitle>
        </DialogHeader>
        {currentError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-red-400">{currentError}</span>
              <button
                onClick={() => dispatch(clearCreateError())}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Patient and Provider Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient {mode === 'create' ? 'ID' : ''} *</Label>
              <Select
                value={formData.patientId}
                disabled={isLoading}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient._id} value={patient._id}>
                      {patient.fullName} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerId">Provider ID *</Label>
              <Select
                value={formData.providerId}
                disabled={isLoading}
                onValueChange={(value) => setFormData({ ...formData, providerId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {provider.map((provider) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.name} ({provider.providerId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Diagnosis and Treatment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="bg-slate-700 border-slate-600"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment Plan *</Label>
              <Textarea
                id="treatment"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                className="bg-slate-700 border-slate-600"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Prescriptions */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Prescriptions</Label>
            <div className="flex space-x-2">
              <Input
                value={newPrescription}
                onChange={(e) => setNewPrescription(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Add prescription (e.g., Lisinopril 10mg daily)"
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrescription())}
              />
              <Button type="button" aria-required onClick={addPrescription} size="sm" className="h-auto" disabled={isLoading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.prescriptions?.map((prescription, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                  <span>{prescription}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removePrescription(index)} disabled={isLoading}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Record Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP p") : "Pick a date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setFormData((prev) => ({
                          ...prev,
                          recordDate: date.toISOString().slice(0, 16), // format to "yyyy-MM-ddTHH:mm"
                        }));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-slate-700 border-slate-600"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Created By & Updated By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createdBy">Created By *</Label>
              <Input
                id="createdBy"
                value={formData.createdBy}
                onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
                disabled={isLoading || mode === 'edit'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="updatedBy">Updated By *</Label>
              <Input
                id="updatedBy"
                value={formData.updatedBy}
                onChange={(e) => setFormData({ ...formData, updatedBy: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
                disabled={isLoading}
              />
            </div>
          </div>


          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {mode === 'edit' ? 'Update Record' : 'Save Record'}
                </>
              )}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog >
  )
}
