"use client"

import type React from "react"

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, CalendarIcon, Loader2, Plus, Upload, X } from "lucide-react"
import { Medication, Patient, PatientPostRequest } from "../modules/Dashboard/patients/api/types"
import { generateId } from "../utils/idGenerator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { Gender, GenderValues, Language, LanguageValues, PatientStatus, PatientStatusValues, Relationship, RelationshipValues } from "../enum"
import { FormikHelpers, getIn, useFormik } from 'formik'

import { clearCreateError, clearCreateSuccess, clearUpdateError, clearUpdateSuccess, createPatients, updatePatients } from "../modules/Dashboard/patients/api/slice"
import { usePatient } from "../redux/providers/contexts/PatientContext"
import { patientValidationSchema } from "../validation/schemas"
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PatientFormValues {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: string;
  ssn: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  allergies: string[];
  chronicConditions: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    startDate: string;
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    subscriberId: string;
    relationshipToSubscriber: string;
    effectiveDate: string; // ISO date string
    expirationDate: string; // ISO date string
  };
  status: PatientStatus.ACTIVE | PatientStatus.DECEASED | PatientStatus.INACTIVE;
  registrationDate: string; // ISO date string
  preferredLanguage: string;
  createdBy: string;
  updatedBy: string;
}

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}


export default function PatientForm({ open, onOpenChange }: PatientFormProps) {
  const { toast } = useToast()
  // CONTEXT STATES
  const {
    isEditing,
    setIsEditing,
    patient,
    setPatient,
    handleSavePatient,
    setPatientFormOpen,
    profile,
  } = usePatient();

  // REDUX STATE
  const {
    createError,
    createLoading,
    createSuccess,
    updateError,
    updateLoading,
    updateSuccess,
  } = useAppSelector(state => state.patients)

  const [profileImage, setProfileImage] = useState<string | null>(null)

  const initialPatientValues: PatientFormValues = {
    patientId: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    ssn: "",
    preferredLanguage: "",
    phone: "",
    email: "",
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
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      subscriberId: "",
      relationshipToSubscriber: "",
      effectiveDate: "",
      expirationDate: ""
    },
    status: PatientStatus.ACTIVE,
    registrationDate: "",
    createdBy: profile?.fullName || "",
    updatedBy: profile?.fullName || ""
  }

  // Determine mode based on editingItem
  const mode = isEditing ? 'edit' : 'create';
  const isLoading = isEditing ? updateLoading : createLoading;
  const errorMessage = isEditing ? updateError : createError;

  const getInitialValues = useMemo((): PatientFormValues => {
    if (mode === "edit" && patient) {
      return {
        patientId: patient.patientId || "",
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        dateOfBirth: patient.dateOfBirth ? format(parseISO(patient.dateOfBirth), "yyyy-MM-dd") : "",
        gender: patient.gender || "",
        ssn: patient.ssn || "",
        phone: patient.phone,
        email: patient.email || "",
        address: {
          street: patient.address?.street || "",
          city: patient.address?.city || "",
          state: patient.address?.state || "",
          zipCode: patient.address?.zipCode || "",
          country: patient.address?.country || ""
        },
        emergencyContact: {
          name: patient.emergencyContact?.name || "",
          relationship: patient.emergencyContact?.relationship || "",
          phone: patient.emergencyContact?.phone || "",
          email: patient.emergencyContact?.email || ""
        },
        allergies: Array.isArray(patient.allergies) ? patient.allergies : [],
        chronicConditions: Array.isArray(patient.chronicConditions) ? patient.chronicConditions : [],
        currentMedications: Array.isArray(patient.currentMedications) ? patient.currentMedications.map(med => ({
          _id: med._id || "",
          name: med.name || "",
          dosage: med.dosage || "",
          frequency: med.frequency || "",
          prescribedBy: med.prescribedBy || "",
          startDate: med.startDate ? format(parseISO(med.startDate), "yyyy-MM-dd") : ""
        })) : [],
        insurance: {
          provider: patient.insurance?.provider || "",
          policyNumber: patient.insurance?.policyNumber || "",
          groupNumber: patient.insurance?.groupNumber || "",
          subscriberId: patient.insurance?.subscriberId || "",
          relationshipToSubscriber: patient.insurance?.relationshipToSubscriber || "",
          effectiveDate: patient.insurance?.effectiveDate ? format(parseISO(patient.insurance.effectiveDate), "yyyy-MM-dd") : "",
          expirationDate: patient.insurance?.expirationDate ? format(parseISO(patient.insurance.expirationDate), "yyyy-MM-dd") : ""
        },
        status: patient.status || PatientStatus.ACTIVE,
        registrationDate: patient.registrationDate ? format(parseISO(patient.registrationDate), "yyyy-MM-dd") : "",
        preferredLanguage: patient.preferredLanguage || "",
        createdBy: patient.createdBy || "",
        updatedBy: profile?.fullName || ""
      }
    }
    return initialPatientValues;
  }, [mode, patient, profile])

  const handlePatientForm = useCallback(async (values: PatientFormValues, actions: FormikHelpers<PatientFormValues>) => {
    try {
      // Your form submission logic here
      handleSavePatient(values, () => {
        actions.resetForm();
        actions.setSubmitting(false);
        onOpenChange(false);

        // ✅ show toast
        toast({
          title: isEditing ? "Patient updated successfully!" : "Patient added successfully!",
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
  }, [handleSavePatient, isEditing, onOpenChange, toast, errorMessage]);


  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema: patientValidationSchema,
    onSubmit: handlePatientForm,
    enableReinitialize: true,
  });

  const handleAddMedication = (medication: Medication) => {
    if (!medication.name || !medication.dosage || !medication.frequency) {
      return;
    }

    const newMedications = [...formik.values.currentMedications, medication];
    formik.setFieldValue('currentMedications', newMedications);
  };

  const handleRemoveMedication = (index: number) => {
    const filteredMedications = formik.values.currentMedications.filter((_, i) => i !== index);
    formik.setFieldValue('currentMedications', filteredMedications);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setProfileImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleGenerateId = useCallback(() => {
    const newId = generateId({ prefix: "P", suffix: "CLINIC" })
    formik.setFieldValue('patientId', newId)
  }, [formik]);

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
          <DialogTitle>{mode === 'create' ? "Add New Patient" : "Edit Patient"}</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <p className="text-red-500 rounded-md py-3 text-center bg-red-300 text-sm">{errorMessage}</p>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileImage || "/placeholder.svg"} />
              <AvatarFallback>
                {(formik.values.firstName + " " + formik.values.lastName)
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

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              {/* Patient ID */}
              <div className="space-y-2">
                <div className="flex items-end gap-2">
                  <div className="space-y-2 w-full">
                    <Label htmlFor="patientId">{mode === 'edit' ? 'Patient ID *' : 'Generated Patient ID'}</Label>
                    <Input
                      id="patientId"
                      name="patientId"
                      readOnly
                      value={formik.values.patientId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-slate-700 border-slate-600"
                      disabled={isLoading}
                      placeholder="X-0001-3658-XXXX"
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
                {getFieldError('patientId') && (
                  <p className="text-red-500 text-sm">{formik.errors.patientId}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600"
                    disabled={isLoading}
                  />
                  {getFieldError('firstName') && (
                    <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600"
                    disabled={isLoading}
                  />
                  {getFieldError('lastName') && (
                    <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
                  )}
                </div>

                {/* Date Of Birth */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600"
                    disabled={isLoading}
                  />
                  {getFieldError('dateOfBirth') && (
                    <p className="text-red-500 text-sm">{formik.errors.dateOfBirth}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formik.values.gender}
                    disabled={isLoading}
                    onValueChange={(value) => formik.setFieldValue('gender', value)}
                  >
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
                  {getFieldError('gender') && (
                    <p className="text-red-500 text-sm">{formik.errors.gender}</p>
                  )}
                </div>

                {/* SSN */}
                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security Number *</Label>
                  <Input
                    id="ssn"
                    name="ssn"
                    value={formik.values.ssn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                    placeholder="XXX-XX-XXXX"
                  />
                  {getFieldError('ssn') && (
                    <p className="text-red-500 text-sm">{formik.errors.ssn}</p>
                  )}
                </div>

                {/* Status  */}
                <div className="space-y-2">
                  <Label htmlFor="status">Patient Status *</Label>
                  <Select
                    value={formik.values.status}
                    disabled={isLoading}
                    onValueChange={(value) => formik.setFieldValue('status', value)}
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
                  {getFieldError('status') && (
                    <p className="text-red-500 text-sm">{formik.errors.status}</p>
                  )}
                </div>

                {/* Registration Date */}
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Registration Date *</Label>
                  <Input
                    id="registrationDate"
                    name="registrationDate"
                    type="date"
                    value={formik.values.registrationDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {getFieldError('registrationDate') && (
                    <p className="text-red-500 text-sm">{formik.errors.registrationDate}</p>
                  )}
                </div>

                {/* Preferred Language */}
                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage">Preferred Language *</Label>
                  <Select
                    value={formik.values.preferredLanguage}
                    onValueChange={(value) => formik.setFieldValue('preferredLanguage', value)}
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
                  {getFieldError('preferredLanguage') && (
                    <p className="text-red-500 text-sm">{formik.errors.preferredLanguage}</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600"
                  disabled={isLoading}
                />
                {getFieldError('phone') && (
                  <p className="text-red-500 text-sm">{formik.errors.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {getFieldError('email') && (
                  <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address.street">Street Address *</Label>
                <Input
                  id="address.street"
                  name="address.street"
                  value={formik.values.address.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {formik.touched.address?.street && formik.errors.address?.street && (
                  <p className="text-red-500 text-sm">{formik.errors.address.street}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label htmlFor="address.city">City *</Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    value={formik.values.address.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.address?.city && formik.errors.address?.city && (
                    <p className="text-red-500 text-sm">{formik.errors.address.city}</p>
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
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.address?.state && formik.errors.address?.state && (
                    <p className="text-red-500 text-sm">{formik.errors.address.state}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address.zipCode">ZIP Code *</Label>
                  <Input
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formik.values.address.zipCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.address?.zipCode && formik.errors.address?.zipCode && (
                    <p className="text-red-500 text-sm">{formik.errors.address.zipCode}</p>
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
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                    placeholder="United States"
                  />
                  {formik.touched.address?.country && formik.errors.address?.country && (
                    <p className="text-red-500 text-sm">{formik.errors.address.country}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.name">Contact Name *</Label>
                <Input
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formik.values.emergencyContact.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {formik.touched.emergencyContact?.name && formik.errors.emergencyContact?.name && (
                  <p className="text-red-500 text-sm">{formik.errors.emergencyContact.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.relationship">Relationship *</Label>
                <Select
                  value={formik.values.emergencyContact.relationship}
                  disabled={isLoading}
                  onValueChange={(value) => formik.setFieldValue('emergencyContact.relationship', value)}
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
                {formik.touched.emergencyContact?.relationship && formik.errors.emergencyContact?.relationship && (
                  <p className="text-red-500 text-sm">{formik.errors.emergencyContact.relationship}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.phone">Phone Number *</Label>
                <Input
                  id="emergencyContact.phone"
                  name="emergencyContact.phone"
                  value={formik.values.emergencyContact.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {formik.touched.emergencyContact?.phone && formik.errors.emergencyContact?.phone && (
                  <p className="text-red-500 text-sm">{formik.errors.emergencyContact.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact.email">Email Address *</Label>
                <Input
                  id="emergencyContact.email"
                  name="emergencyContact.email"
                  type="email"
                  value={formik.values.emergencyContact.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {formik.touched.emergencyContact?.email && formik.errors.emergencyContact?.email && (
                  <p className="text-red-500 text-sm">{formik.errors.emergencyContact.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Medical Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies *</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  disabled={isLoading}
                  value={Array.isArray(formik.values.allergies) ? formik.values.allergies.join(", ") : ""}
                  onChange={(e) => {
                    const allergiesArray = e.target.value.split(",").map(item => item.trim()).filter(item => item);
                    formik.setFieldValue('allergies', allergiesArray);
                  }}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter allergies separated by commas"
                />
                {getFieldError('allergies') && (
                  <p className="text-red-500 text-sm">{formik.errors.allergies}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="chronicConditions">Chronic Conditions *</Label>
                <Textarea
                  id="chronicConditions"
                  name="chronicConditions"
                  disabled={isLoading}
                  value={Array.isArray(formik.values.chronicConditions) ? formik.values.chronicConditions.join(", ") : ""}
                  onChange={(e) => {
                    const conditionsArray = e.target.value.split(",").map(item => item.trim()).filter(item => item);
                    formik.setFieldValue('chronicConditions', conditionsArray);
                  }}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter chronic conditions separated by commas"
                />
                {getFieldError('chronicConditions') && (
                  <p className="text-red-500 text-sm">{formik.errors.chronicConditions}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Medication Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-medication-name">Medication Name *</Label>
                  <Input
                    id="new-medication-name"
                    name="newMedicationName"
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Lisinopril"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-medication-dosage">Dosage *</Label>
                  <Input
                    id="new-medication-dosage"
                    name="newMedicationDosage"
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., 10mg"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-medication-frequency">Frequency *</Label>
                  <Input
                    id="new-medication-frequency"
                    name="newMedicationFrequency"
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Once daily"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-medication-prescriber">Prescribed By</Label>
                  <Input
                    id="new-medication-prescriber"
                    name="newMedicationPrescriber"
                    className="bg-slate-700 border-slate-600"
                    placeholder="e.g., Dr. Smith"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-medication-start-date">Start Date</Label>
                  <Input
                    id="new-medication-start-date"
                    name="newMedicationStartDate"
                    type="date"
                    className="bg-slate-700 border-slate-600"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      const form = document.forms[0]; // Assuming this is in a form
                      const newMedication = {
                        name: form.newMedicationName.value,
                        dosage: form.newMedicationDosage.value,
                        frequency: form.newMedicationFrequency.value,
                        prescribedBy: form.newMedicationPrescriber.value,
                        startDate: form.newMedicationStartDate.value
                      };

                      // Validate required fields
                      if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
                        alert('Please fill in all required fields');
                        return;
                      }

                      handleAddMedication(newMedication);

                      // Clear form
                      form.newMedicationName.value = '';
                      form.newMedicationDosage.value = '';
                      form.newMedicationFrequency.value = '';
                      form.newMedicationPrescriber.value = '';
                      form.newMedicationStartDate.value = '';
                    }}
                    size="sm"
                    className="sm:h-9.5 sm:w-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Display Current Medications */}
              <div className="space-y-2">
                {Array.isArray(formik.values.currentMedications) && formik.values.currentMedications.length === 0 ? (
                  <p className="text-gray-500 text-sm">No medications added yet</p>
                ) : (
                  Array.isArray(formik.values.currentMedications) && formik.values.currentMedications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700/50 p-3 rounded border border-slate-600">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-white">Name:</span>
                            <p className="text-gray-300">{medication.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-white">Dosage:</span>
                            <p className="text-gray-300">{medication.dosage}</p>
                          </div>
                          <div>
                            <span className="font-medium text-white">Frequency:</span>
                            <p className="text-gray-300">{medication.frequency}</p>
                          </div>
                          <div>
                            <span className="font-medium text-white">Prescribed By:</span>
                            <p className="text-gray-300">{medication.prescribedBy || 'N/A'}</p>
                          </div>
                        </div>
                        {medication.startDate && (
                          <div className="mt-2">
                            <span className="font-medium text-white">Start Date:</span>
                            <span className="text-gray-300 ml-2">{medication.startDate}</span>
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMedication(index)}
                        className="ml-2 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Insurance Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance.provider">Insurance Provider *</Label>
                <Input
                  id="insurance.provider"
                  name="insurance.provider"
                  value={formik.values.insurance.provider}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                />
                {formik.touched.insurance?.provider && formik.errors.insurance?.provider && (
                  <p className="text-red-500 text-sm">{formik.errors.insurance.provider}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance.policyNumber">Policy Number *</Label>
                  <Input
                    id="insurance.policyNumber"
                    name="insurance.policyNumber"
                    value={formik.values.insurance.policyNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.insurance?.policyNumber && formik.errors.insurance?.policyNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.policyNumber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance.groupNumber">Group Number *</Label>
                  <Input
                    id="insurance.groupNumber"
                    name="insurance.groupNumber"
                    value={formik.values.insurance.groupNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.insurance?.groupNumber && formik.errors.insurance?.groupNumber && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.groupNumber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance.subscriberId">Subscriber ID *</Label>
                  <Input
                    id="insurance.subscriberId"
                    name="insurance.subscriberId"
                    value={formik.values.insurance.subscriberId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.insurance?.subscriberId && formik.errors.insurance?.subscriberId && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.subscriberId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance.relationshipToSubscriber">Relationship to Subscriber *</Label>
                  <Select
                    value={formik.values.insurance.relationshipToSubscriber}
                    disabled={isLoading}
                    onValueChange={(value) => formik.setFieldValue('insurance.relationshipToSubscriber', value)}
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
                  {formik.touched.insurance?.relationshipToSubscriber && formik.errors.insurance?.relationshipToSubscriber && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.relationshipToSubscriber}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance.effectiveDate">Effective Date *</Label>
                  <Input
                    id="insurance.effectiveDate"
                    name="insurance.effectiveDate"
                    type="date"
                    value={formik.values.insurance.effectiveDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.insurance?.effectiveDate && formik.errors.insurance?.effectiveDate && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.effectiveDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance.expirationDate">Expiration Date *</Label>
                  <Input
                    id="insurance.expirationDate"
                    name="insurance.expirationDate"
                    type="date"
                    value={formik.values.insurance.expirationDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    className="bg-slate-700 border-slate-600"
                  />
                  {formik.touched.insurance?.expirationDate && formik.errors.insurance?.expirationDate && (
                    <p className="text-red-500 text-sm">{formik.errors.insurance.expirationDate}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Audit Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createdBy">Created By *</Label>
                <Input
                  id="createdBy"
                  name="createdBy"
                  value={formik.values.createdBy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter creator name"
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
