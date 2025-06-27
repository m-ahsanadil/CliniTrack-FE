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
import { CalendarIcon, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { doctors } from "@/src/constants"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { useMedicalRecordsFetcher } from "../modules/Dashboard/medicalRecords/api/useMedicalRecord"
import { clearCreateError, clearCreateSuccess, createMedicalRecord } from "../modules/Dashboard/medicalRecords/api/slice"
import { fetchPatientBasicInfo } from "../modules/Dashboard/patients/api/slice"
import { PatientBasicInfo } from "../modules/Dashboard/patients/api/types"
import { ProviderBasicInfo } from "../modules/Dashboard/Provider/api/types"
import { fetchProviderBasicInfo } from "../modules/Dashboard/Provider/api/slice"

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
  // patientName?: string
  diagnosis: string
  treatment: string
  prescription: string
  notes: string
  recordDate: string
  createdBy: string
  updatedBy: string
  prescriptions?: string[]
}

// Initial form state
const initialFormState: MedicalRecordData = {
  patientId: "",
  providerId: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  notes: "",
  recordDate: new Date().toISOString().slice(0, 16),
  createdBy: "",
  updatedBy: "",
  prescriptions: [],
}


export default function MedicalRecordForm({ open, onOpenChange, record, onSave, patients, provider, mode = 'create' }: MedicalRecordFormProps) {
  const dispatch = useAppDispatch();
  const { createError, createLoading, createSuccess } = useAppSelector(state => state.medicalRecord);

  const [formData, setFormData] = useState<MedicalRecordData>({
    patientId: record?.patientId || "",
    providerId: record?.providerId || "",
    diagnosis: record?.diagnosis || "",
    treatment: record?.treatment || "",
    prescription: record?.prescription || "",
    notes: record?.notes || "",
    recordDate: record?.recordDate || new Date().toISOString().slice(0, 16),
    createdBy: record?.createdBy || "",
    updatedBy: record?.updatedBy || "",
    prescriptions: record?.prescriptions || [],
  })

  console.log(formData);


  useEffect(() => {
    if (open) {
      dispatch(fetchPatientBasicInfo());
      dispatch(fetchProviderBasicInfo());
    }
  }, [open, dispatch]);

  // Handle successful creation
  useEffect(() => {
    if (createSuccess) {
      // Reset form to initial state
      setFormData(initialFormState);
      setNewPrescription("");

      // Clear success state
      dispatch(clearCreateSuccess());

      // Close the dialog
      onOpenChange(false);

      // Call onSave if provided (for parent component callback)
      if (onSave) {
        onSave(formData);
      }
    }
  }, [createSuccess, dispatch, onOpenChange, onSave]);

  // Clear errors when dialog closes
  useEffect(() => {
    if (!open) {
      dispatch(clearCreateError());
    }
  }, [open, dispatch]);


  const [selectedDate, setSelectedDate] = useState<Date | undefined>(record?.date ? new Date(record.date) : new Date())

  // const [followUpDate, setFollowUpDate] = useState<Date | undefined>(
  //   record?.followUpDate ? new Date(record.followUpDate) : undefined,
  // )

  const [newPrescription, setNewPrescription] = useState("")
  // const [newSymptom, setNewSymptom] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Prepare data for submission
    const submissionData: MedicalRecordData = {
      ...formData,
      recordDate: selectedDate ? selectedDate.toISOString() : formData.recordDate,
      id: record?.id || Date.now(),
      prescription: formData.prescriptions?.join('; ') || formData.prescription,
    }
    dispatch(createMedicalRecord(submissionData));
    onOpenChange(false)
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


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Medical Record" : "Add New Medical Record"}</DialogTitle>
        </DialogHeader>
        {createError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-red-400">{createError}</span>
              <button
                onClick={() => dispatch(clearCreateError())}
                className="text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}
        {mode === 'create' && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Patient and Provider Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient {mode === 'create' ? 'ID' : ''} *</Label>
                <Select
                  value={formData.patientId}
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
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrescription())}
                />
                <Button type="button" aria-required onClick={addPrescription} size="sm" className="h-auto">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.prescriptions?.map((prescription, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                    <span>{prescription}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePrescription(index)}>
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
                <Input
                  id="recordDate"
                  type="datetime-local"
                  value={formData.recordDate}
                  onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  required
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-slate-700 border-slate-600"
                rows={4}
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
                />
              </div>
            </div>


            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Save Record
              </Button>
            </div>
          </form>
        )}


      </DialogContent>
    </Dialog >
  )
}
