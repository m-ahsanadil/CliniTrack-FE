"use client"

import type React from "react"

import { useState } from "react"
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

interface MedicalRecordFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record?: any
  onSave: (record: any) => void
  patients: any[]
}

export default function MedicalRecordForm({ open, onOpenChange, record, onSave, patients }: MedicalRecordFormProps) {
  const [formData, setFormData] = useState({
    patientId: record?.patientId || "",
    patientName: record?.patientName || "",
    date: record?.date || "",
    diagnosis: record?.diagnosis || "",
    treatment: record?.treatment || "",
    doctor: record?.doctor || "",
    notes: record?.notes || "",
    vitals: record?.vitals || { bp: "", pulse: "", temp: "", weight: "", height: "", oxygen: "" },
    prescriptions: record?.prescriptions || [],
    symptoms: record?.symptoms || [],
    followUpDate: record?.followUpDate || "",
    severity: record?.severity || "Mild",
    status: record?.status || "Active",
  })

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(record?.date ? new Date(record.date) : new Date())

  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(
    record?.followUpDate ? new Date(record.followUpDate) : undefined,
  )

  const [newPrescription, setNewPrescription] = useState("")
  const [newSymptom, setNewSymptom] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedPatient = patients.find((p) => p.id.toString() === formData.patientId)
    onSave({
      ...formData,
      patientName: selectedPatient?.name || formData.patientName,
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : formData.date,
      followUpDate: followUpDate ? format(followUpDate, "yyyy-MM-dd") : "",
      id: record?.id || Date.now(),
    })
    onOpenChange(false)
  }

  const addPrescription = () => {
    if (newPrescription.trim()) {
      setFormData({
        ...formData,
        prescriptions: [...formData.prescriptions, newPrescription.trim()],
      })
      setNewPrescription("")
    }
  }

  const removePrescription = (index: number) => {
    setFormData({
      ...formData,
      prescriptions: formData.prescriptions.filter((_, i) => i !== index),
    })
  }

  const addSymptom = () => {
    if (newSymptom.trim()) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, newSymptom.trim()],
      })
      setNewSymptom("")
    }
  }

  const removeSymptom = (index: number) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter((_, i) => i !== index),
    })
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{record ? "Edit Medical Record" : "Add New Medical Record"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient *</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id.toString()}>
                      {patient.name} - {patient.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Visit Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Doctor *</Label>
              <Select value={formData.doctor} onValueChange={(value) => setFormData({ ...formData, doctor: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mild">Mild</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Severe">Severe</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Vital Signs</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood Pressure</Label>
                <Input
                  id="bp"
                  value={formData.vitals.bp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, bp: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pulse">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  value={formData.vitals.pulse}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, pulse: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Temperature</Label>
                <Input
                  id="temp"
                  value={formData.vitals.temp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, temp: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="98.6°F"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.vitals.weight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, weight: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="150 lbs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.vitals.height}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, height: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="5'8&quot;"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oxygen">Oxygen Saturation</Label>
                <Input
                  id="oxygen"
                  value={formData.vitals.oxygen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vitals: { ...formData.vitals, oxygen: e.target.value },
                    })
                  }
                  className="bg-slate-700 border-slate-600"
                  placeholder="98%"
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Symptoms</Label>
            <div className="flex space-x-2">
              <Input
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Add symptom"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSymptom())}
              />
              <Button type="button" onClick={addSymptom} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{symptom}</span>
                  <button type="button" onClick={() => removeSymptom(index)} className="ml-1 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
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
              <Button type="button" onClick={addPrescription} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.prescriptions.map((prescription, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                  <span>{prescription}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removePrescription(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followUpDate ? format(followUpDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                  <Calendar mode="single" selected={followUpDate} onSelect={setFollowUpDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Chronic">Chronic</SelectItem>
                  <SelectItem value="Follow-up Required">Follow-up Required</SelectItem>
                </SelectContent>
              </Select>
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {record ? "Update Record" : "Save Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
