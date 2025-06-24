
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import patientIdGenerator from "../utils/patientIdGenerator"

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: any
  onSave: (patient: any) => void
}

export default function PatientForm({ open, onOpenChange, patient, onSave }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || "",
    age: patient?.age || "",
    gender: patient?.gender || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    emergencyContact: patient?.emergencyContact || "",
    condition: patient?.condition || "",
    bloodType: patient?.bloodType || "",
    allergies: patient?.allergies || "",
    medications: patient?.medications || "",
    insuranceProvider: patient?.insuranceProvider || "",
    insuranceNumber: patient?.insuranceNumber || "",
    notes: patient?.notes || "",
  })

  const [profileImage, setProfileImage] = useState(patient?.profileImage || null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...formData, profileImage, id: patientId })
    onOpenChange(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const [patientId, setPatientId] = useState(patient?.id || "")
  useEffect(() => {
    if (open && !patient) {
      const newId = patientIdGenerator.generate()
      setPatientId(newId)
    } else if (patient) {
      setPatientId(patient.id) // existing patient
    }
  }, [open, patient])

  const handleRegenerateId = () => {
    const newId = patientIdGenerator.generate()
    setPatientId(newId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit Patient" : "Add New Patient"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback>
                {formData.name
                  .split(" ")
                  .map((n: any[]) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profileImage" className="cursor-pointer">
                <div className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white">
                  <Upload className="h-4 w-4" />
                  <span>Upload Photo</span>
                </div>
              </Label>
              <input id="profileImage" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {profileImage && (
                <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => setProfileImage(null)}>
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Patient ID Display */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm text-white">Patient ID (Auto-generated)</Label>
              <Input
                type="text"
                value={patientId}
                readOnly
                className="bg-slate-700 border-slate-600"
              />
            </div>

            {!patient && (
              <div className="flex flex-col gap-2">
                <span className="text-xs text-gray-300">
                  Next Preview: {patientIdGenerator.previewNextId()}
                </span>
                <Button
                  type="button"
                  onClick={handleRegenerateId}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                >
                  Regenerate ID
                </Button>

              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-700 border-slate-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="bg-slate-700 border-slate-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="Name - Phone Number"
            />
          </div>

          {/* Medical Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Primary Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Separate with commas"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Current Medications</Label>
            <Textarea
              id="medications"
              value={formData.medications}
              onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
              className="bg-slate-700 border-slate-600"
              placeholder="List current medications and dosages"
            />
          </div>

          {/* Insurance Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceProvider">Insurance Provider</Label>
              <Input
                id="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceNumber">Insurance Number</Label>
              <Input
                id="insuranceNumber"
                value={formData.insuranceNumber}
                onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                className="bg-slate-700 border-slate-600"
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
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {patient ? "Update Patient" : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
