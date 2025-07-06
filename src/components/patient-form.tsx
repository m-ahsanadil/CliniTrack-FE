
"use client"

import type React from "react"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CalendarIcon, Loader2, Upload, X } from "lucide-react"
import patientIdGenerator from "../utils/patientIdGenerator"
import { Medication, Patient, PatientPostRequest } from "../modules/Dashboard/patients/api/types"
import { generateId } from "../utils/idGenerator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { Gender, GenderValues, Language, LanguageValues, PatientStatus, PatientStatusValues, Relationship, RelationshipValues } from "../enum"
import { clearCreateError, clearCreateSuccess, clearUpdateError, clearUpdateSuccess, createPatients, updatePatients } from "../modules/Dashboard/patients/api/slice"

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: any
  mode: 'create' | 'edit'
  onSave: (patient: Patient) => void
}


const initialFormState: PatientPostRequest = {
  patientId: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  ssn: "",
  phone: "",
  email: "",
  preferredLanguage: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  },
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    email: ""
  },
  insurance: {
    provider: "",
    policyNumber: "",
    groupNumber: "",
    subscriberId: "",
    relationshipToSubscriber: "",
    effectiveDate: "",
    expirationDate: ""
  },
  allergies: [],
  chronicConditions: [],
  currentMedications: [],
  status: "",
  registrationDate: "",
  createdBy: "",
  updatedBy: ""
}

export default function PatientForm({ mode, open, onOpenChange, patient, onSave }: PatientFormProps) {
  const dispatch = useAppDispatch()
  const { createError, createLoading, createSuccess, updateError, updateLoading, updateSuccess } = useAppSelector(state => state.patients)
  const [formData, setFormData] = useState<PatientPostRequest>(initialFormState)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | undefined>(patient?.dateOfBirth ? new Date(patient?.dateOfBirth) : new Date())
  const [medicationInput, setMedicationInput] = useState<string>("")

  useEffect(() => {
    if (mode === 'edit' && patient) {
      setFormData({
        patientId: patient.patientId || "",
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dateOfBirth: patient.dateOfBirth || "",
        gender: patient.gender || Gender.UNKNOWN,
        ssn: patient.ssn || "",
        phone: patient.phone || "",
        email: patient.email || "",
        preferredLanguage: patient.preferredLanguage || Language.ENGLISH,
        address: {
          street: patient.address?.street || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          zipCode: patient.address?.zipCode || "",
          country: patient.address?.country || "",
        },
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          relationship: patient.emergencyContact?.relationship || Relationship.OTHER,
          phone: patient.emergencyContact?.phone || "",
          email: patient.emergencyContact?.email || "",
        },
        insurance: {
          provider: patient.insurance?.provider || "",
          policyNumber: patient.insurance?.policyNumber || "",
          groupNumber: patient.insurance?.groupNumber || "",
          subscriberId: patient.insurance?.subscriberId || "",
          relationshipToSubscriber: patient.insurance?.relationshipToSubscriber || Relationship.SELF,
          effectiveDate: patient.insurance?.effectiveDate || "",
          expirationDate: patient.insurance?.expirationDate || "",
        },
        allergies: patient.allergies || [],
        chronicConditions: patient.chronicConditions || [],
        currentMedications: patient.currentMedications?.map((med: { name: any; dosage: any; frequency: any; prescribedBy: any; startDate: any }) => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          prescribedBy: med.prescribedBy,
          startDate: med.startDate
        })) || [],
        status: patient.status || PatientStatus.ACTIVE,
        registrationDate: patient.registrationDate || new Date().toISOString(),
        createdBy: patient.createdBy || "",
        updatedBy: patient.updatedBy || ""
      })
      setProfileImage(patient.profileImage || null)
      if (patient.dateOfBirth) {
        setSelectedBirthDate(new Date(patient.dateOfBirth))
      }
    } else if (mode === 'create') {
      const newId = generateId({ prefix: "P", suffix: "CLINIC" })
      setFormData({
        ...initialFormState,
        patientId: newId,
        registrationDate: new Date().toISOString(),
        createdBy: "current_user_id", // Replace with actual user ID
        updatedBy: "current_user_id" // Replace with actual user ID
      })
      setProfileImage(null)
      setSelectedBirthDate(undefined)
    }
  }, [mode, patient])

  useEffect(() => {
    if (createSuccess || updateSuccess) {
      onSave({ ...formData, profileImage } as unknown as Patient)
      setFormData(initialFormState)
      setProfileImage(null)
      setSelectedBirthDate(undefined)
      dispatch(clearCreateSuccess())
      dispatch(clearUpdateSuccess())
      onOpenChange(false)
    }
  }, [createSuccess, updateSuccess, dispatch, onSave, onOpenChange])

  useEffect(() => {
    if (createError || updateError) {
      console.error(mode === 'edit' ? updateError : createError)
      // Optionally show error toast/notification here
    }
    return () => {
      dispatch(clearCreateError())
      dispatch(clearUpdateError())
    }
  }, [createError, updateError, dispatch, mode])

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const regenerateId = () => {
    if (mode === 'create') {
      const newId = generateId({ prefix: "P", suffix: "CLINIC" })
      setFormData({ ...formData, patientId: newId })
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const submissionData: PatientPostRequest = {
      ...formData,
      dateOfBirth: selectedBirthDate ? selectedBirthDate.toISOString() : formData.dateOfBirth,
      updatedBy: "current_user_id", // Replace with actual user ID
      registrationDate: mode === 'create' ? new Date().toISOString() : formData.registrationDate
    }

    if (mode === 'edit' && patient?._id) {
      dispatch(updatePatients({
        id: patient._id,
        patientData: submissionData
      }))
    } else {
      dispatch(createPatients(submissionData))
    }
  }

  const handleMedicationChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const medications = e.target.value.split("\n").map(item => {
      const [name, dosage, frequency, prescribedBy, startDate] = item.split(",").map(s => s.trim())
      return {
        name: name || "",
        dosage: dosage || "",
        frequency: frequency || "",
        prescribedBy: prescribedBy || "",
        startDate: startDate || new Date().toISOString()
      }
    }).filter(med => med.name)
    setFormData({ ...formData, currentMedications: medications })
  }

  const isLoading = mode === 'edit' ? updateLoading : createLoading
  const currentError = mode === 'edit' ? updateError : createError
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Patient" : "Add New Patient"}</DialogTitle>
        </DialogHeader>

        {currentError && (
          <div className="text-red-500 text-sm mb-4">
            Error: {currentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback>
                {(formData.firstName + " " + formData.lastName)
                  .split(" ")
                  .map((n) => n[0])
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

          {/* Patient ID */}
          <div className="flex items-end gap-2">
            <div className="space-y-2 w-full">
              <Label htmlFor="patientId">{mode === 'edit' ? 'Patient ID *' : 'Generated Patient ID'}</Label>
              <Input
                id="patientId"
                readOnly
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="p-001"
                required
                disabled={isLoading}
              />
            </div>
            {mode === 'create' && (
              <button
                type="button"
                disabled={isLoading}
                onClick={regenerateId}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Regenerate
              </button>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  required
                />
              </div>
              {/* <div className="space-y-2">
                <Label>Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedBirthDate ? format(selectedBirthDate, "PPP p") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                    <Calendar
                      mode="single"
                      selected={selectedBirthDate}
                      // onSelect={(date: Date | undefined) => setSelectedBirthDate(date)}
                      onSelect={(date) => {
                        if (date) {
                          setSelectedBirthDate(date);
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: dateOfBirth.toISOString().slice(0, 16), // format to "yyyy-MM-ddTHH:mm"
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} disabled={isLoading} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {GenderValues.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security Number</Label>
                <Input
                  id="ssn"
                  value={formData.ssn}
                  disabled={isLoading}
                  onChange={(e) => setFormData({ ...formData, ssn: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="XXX-XX-XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value) => setFormData({ ...formData, preferredLanguage: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LanguageValues.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled={isLoading}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    disabled={isLoading}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    disabled={isLoading}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.address.zipCode}
                    disabled={isLoading}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, zipCode: e.target.value }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyContact.name}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Select
                  value={formData.emergencyContact.relationship}
                  disabled={isLoading}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, relationship: value }
                  })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RelationshipValues.map((relationship) => (
                      <SelectItem key={relationship} value={relationship}>
                        {relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyContact.phone}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyEmail">Email Address</Label>
                <Input
                  id="emergencyEmail"
                  disabled={isLoading}
                  type="email"
                  value={formData.emergencyContact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    emergencyContact: { ...formData.emergencyContact, email: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insurance.provider}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, provider: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.insurance.policyNumber}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, policyNumber: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  value={formData.insurance.groupNumber}
                  disabled={isLoading}
                  onChange={(e) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, groupNumber: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationshipToSubscriber">Relationship to Subscriber</Label>
                <Select
                  value={formData.insurance.relationshipToSubscriber}
                  disabled={isLoading}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, relationshipToSubscriber: value }
                  })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RelationshipValues.map((relationship) => (
                      <SelectItem key={relationship} value={relationship}>
                        {relationship}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>


              <div className="space-y-2">
                <Label htmlFor="effectiveDate">Effective Date</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  disabled={isLoading}
                  value={formData.insurance.effectiveDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, effectiveDate: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  disabled={isLoading}
                  value={formData.insurance.expirationDate}
                  onChange={(e) => setFormData({
                    ...formData,
                    insurance: { ...formData.insurance, expirationDate: e.target.value }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Medical Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  disabled={isLoading}
                  value={Array.isArray(formData.allergies) ? formData.allergies.join(", ") : ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    allergies: e.target.value.split(",").map(item => item.trim()).filter(item => item)
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter allergies separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                <Textarea
                  id="chronicConditions"
                  disabled={isLoading}
                  value={Array.isArray(formData.chronicConditions) ? formData.chronicConditions.join(", ") : ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    chronicConditions: e.target.value.split(",").map(item => item.trim()).filter(item => item)
                  })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter chronic conditions separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentMedications">Current Medications</Label>
                <Textarea
                  id="currentMedications"
                  disabled={isLoading}
                  value={medicationInput}
                  onChange={handleMedicationChange}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter current medications separated by commas"
                />
              </div>
            </div>
          </div>

          {/* Status and Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Status & Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Patient Status</Label>
                <Select
                  disabled={isLoading}
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PatientStatusValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {mode === 'edit' ? 'Update Patient' : 'Save Patient'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
