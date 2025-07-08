"use client"

import type React from "react"

import { useCallback, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, FileText, Loader2 } from "lucide-react"
import { AppointmentPriority, AppointmentPriorityValues, AppointmentStatus, AppointmentStatusValues, AppointmentType, AppointmentTypeValues, DepartmentName, DepartmentNameValues } from "@/src/enum"
import { Input } from "@/components/ui/input"
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
import { useToast } from "@/hooks/use-toast"
import { useAppointment } from "../redux/providers/contexts/AppointmentContext"
import { FormikHelpers, getIn, useFormik } from "formik"
import { appointmentValidationSchema } from "../validation/schemas"
import { generateId } from "../utils/idGenerator"

interface AppointmentFormValues {
  appointmentNumber: string;
  patientId: string;
  providerId: string;
  departmentName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  timeZone: string;
  type: AppointmentType.CONSULTATION | AppointmentType.EMERGENCY | AppointmentType.FOLLOW_UP | AppointmentType.PROCEDURE;
  priority: AppointmentPriority.HIGH | AppointmentPriority.LOW | AppointmentPriority.MEDIUM | AppointmentPriority.URGENT;
  status: AppointmentStatus.CANCELLED | AppointmentStatus.COMPLETED | AppointmentStatus.NO_SHOW | AppointmentStatus.RESCHEDULED | AppointmentStatus.SCHEDULED;
  location: {
    facilityId: string;
    facilityName: string;
    roomNumber: string;
    address: string;
  };
  reasonForVisit: string;
  symptoms: string[];
  notes: string;
  createdBy: string;
  updatedBy: string;
}

interface AppointmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}


export default function AppointmentForm({ open, onOpenChange }: AppointmentFormProps) {
  const { toast } = useToast()

  // CONTEXT STATES
  const {
    isEditing,
    appointment,
    handleSaveAppointment,
    profile,
    patientNames,
    providerNames
  } = useAppointment();

  //REDUX STATES
  const {
    appointments,
    createError,
    createLoading,
    updateError,
    createSuccess,
    updateSuccess,
    updateLoading,
  } = useAppSelector(state => state.appointment)

  const initialAppointmentValues: AppointmentFormValues = {
    appointmentNumber: "",
    patientId: "",
    providerId: "",
    departmentName: DepartmentName.ANESTHESIOLOGY,
    appointmentDate: "",
    startTime: "",
    endTime: "",
    duration: 0,
    timeZone: "",
    type: AppointmentType.CONSULTATION,
    priority: AppointmentPriority.LOW,
    status: AppointmentStatus.SCHEDULED,
    location: {
      facilityId: "",
      facilityName: "",
      roomNumber: "",
      address: ""
    },
    reasonForVisit: "",
    symptoms: [],
    notes: "",
    createdBy: profile?.name || '',
    updatedBy: profile?.name || ""
  }

  // Determine mode based on editingItem
  const mode = isEditing ? 'edit' : 'create';
  const isLoading = isEditing ? updateLoading : createLoading;
  const errorMessage = isEditing ? updateError : createError;

  const getInitialValues = useMemo((): AppointmentFormValues => {
    if (mode === 'edit' && appointment) {
      return {
        appointmentNumber: appointment.appointmentNumber || "",
        patientId: appointment.patientId?._id || "",
        providerId: appointment.providerId?._id || "",
        departmentName: appointment.departmentName || "",
        appointmentDate: appointment.appointmentDate || "",
        startTime: appointment.startTime || "",
        endTime: appointment.endTime || "",
        duration: appointment.duration || 0,
        timeZone: appointment.timeZone || "",
        type: appointment.type || AppointmentType.CONSULTATION,
        priority: appointment.priority || AppointmentPriority.LOW,
        status: appointment.status || AppointmentStatus.SCHEDULED,
        location: {
          facilityId: appointment.location?.facilityId || "",
          facilityName: appointment.location?.facilityName || "",
          roomNumber: appointment.location?.roomNumber || "",
          address: appointment.location?.address || ""
        },
        reasonForVisit: appointment.reasonForVisit || "",
        symptoms: appointment.symptoms || [],
        notes: appointment.notes || "",
        createdBy: appointment.createdBy || "",
        updatedBy: profile?.name || ""
      }
    }
    return initialAppointmentValues;
  }, [mode, appointment, profile]);


  const handleAppointmentForm = useCallback(async (values: AppointmentFormValues, actions: FormikHelpers<AppointmentFormValues>) => {
    console.log('🆔 ID Validation:', {
      patientId: values.patientId,
      providerId: values.providerId,
      selectedPatient: patientNames?.find(p => p._id === values.patientId),
      selectedProvider: providerNames?.find(d => d._id === values.providerId)
    });

    try {
      handleSaveAppointment(values, () => {
        actions.resetForm();
        actions.setSubmitting(false);
        onOpenChange(false);
        toast({
          title: isEditing ? "Appointment Updated" : "Appointment Created",
          description: isEditing ? "Appointment updated successfully!" : "Appointment created successfully!",
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
  }, [handleSaveAppointment, isEditing, onOpenChange, toast, errorMessage, patientNames, providerNames]);


  const formik = useFormik({
    initialValues: getInitialValues,
    validationSchema: appointmentValidationSchema,
    onSubmit: handleAppointmentForm,
    enableReinitialize: true,
  });

  const timeSlots = useMemo(() => [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
    "05:00 PM", "05:30 PM",
  ], []);

  const handleGenerateAppointmentId = useCallback(() => {
    const newId = generateId({ prefix: "App", suffix: "Patient" })
    formik.setFieldValue('appointmentNumber', newId)
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
          <DialogTitle className="text-2xl text-white flex items-center gap-2">
            {mode === 'create' ? (
              <>
                <FileText className="h-6 w-6" />
                Schedule New Appointment
              </>
            ) : (
              <>
                <FileText className="h-6 w-6" />
                Edit Appointment
              </>
            )}
          </DialogTitle>
          <p className="text-slate-400">
            {mode === 'create' ? "Fill in the details to create a new appointment" : "Update the appointment information below"}
          </p>
          {errorMessage && !isLoading && (
            <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
          )}
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Section 1: Appointment Details */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">

              {/* Appointment Number */}
              <div className="space-y-2">
                <Label htmlFor="appointmentNumber" className="text-slate-200">
                  Appointment Number
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="appointmentNumber"
                    name="appointmentNumber"
                    value={formik.values.appointmentNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter appointment number"
                    readOnly={mode === 'edit'}
                    autoComplete="off"
                  />
                  {mode === 'create' && (
                    <Button
                      type="button"
                      onClick={handleGenerateAppointmentId}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 whitespace-nowrap"
                      disabled={isLoading}
                    >
                      Generate ID
                    </Button>
                  )}
                </div>
                {getFieldError('appointmentNumber') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('appointmentNumber')}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Appointment Date */}
                <div className="space-y-2">
                  <Label htmlFor="appointmentDate" className="text-slate-200">
                    Appointment Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formik.values.appointmentDate
                          ? format(new Date(formik.values.appointmentDate), "PPP")
                          : "Pick a date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                      <Calendar
                        mode="single"
                        selected={formik.values.appointmentDate ? new Date(formik.values.appointmentDate) : undefined}
                        onSelect={(date) => formik.setFieldValue('appointmentDate', date?.toISOString().split('T')[0])}
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  {getFieldError('appointmentDate') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('appointmentDate')}</p>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-200">
                    Status
                  </Label>
                  <Select
                    value={formik.values.status}
                    onValueChange={(value) => formik.setFieldValue('status', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {AppointmentStatusValues.map((status) => (
                        <SelectItem key={status} value={status} className="text-white">
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('status') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('status')}</p>
                  )}
                </div>

                {/* Appointment Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-slate-200">
                    Appointment Type
                  </Label>
                  <Select
                    value={formik.values.type}
                    onValueChange={(value) => formik.setFieldValue('type', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {AppointmentTypeValues.map((type) => (
                        <SelectItem key={type} value={type} className="text-white">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('type') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('type')}</p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-slate-200">
                    Priority
                  </Label>
                  <Select
                    value={formik.values.priority}
                    onValueChange={(value) => formik.setFieldValue('priority', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {AppointmentPriorityValues.map((priority) => (
                        <SelectItem key={priority} value={priority} className="text-white">
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('priority') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('priority')}</p>
                  )}
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-slate-200">
                    Start Time
                  </Label>
                  <Select
                    value={formik.values.startTime}
                    onValueChange={(value) => formik.setFieldValue('startTime', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time} className="text-white">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('startTime') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('startTime')}</p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-slate-200">
                    End Time
                  </Label>
                  <Select
                    value={formik.values.endTime}
                    onValueChange={(value) => formik.setFieldValue('endTime', value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time} className="text-white">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getFieldError('endTime') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('endTime')}</p>
                  )}
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-200">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="30"
                  />
                  {getFieldError('duration') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('duration')}</p>
                  )}
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label htmlFor="timeZone" className="text-slate-200">
                    Time Zone
                  </Label>
                  <Input
                    id="timeZone"
                    name="timeZone"
                    value={formik.values.timeZone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="UTC-5"
                  />
                  {getFieldError('timeZone') && (
                    <p className="text-red-400 text-sm mt-1">{getFieldError('timeZone')}</p>
                  )}
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Section 2: Patient & Provider Info */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Patient & Provider Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Selection */}
              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-slate-200">
                  Patient Name
                </Label>
                <Select
                  value={formik.values.patientId}
                  onValueChange={(value) => formik.setFieldValue('patientId', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {patientNames?.map((patient) => (
                      <SelectItem key={patient._id} value={patient._id} className="text-white">
                        {patient.fullName} ({patient.patientId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('patientId') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('patientId')}</p>
                )}
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="providerId" className="text-slate-200">
                  Doctor Name
                </Label>
                <Select
                  value={formik.values.providerId}
                  onValueChange={(value) => formik.setFieldValue('providerId', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {providerNames?.map((doctor) => (
                      <SelectItem key={doctor._id} value={doctor._id} className="text-white">
                        {doctor.name} ({doctor.providerId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('providerId') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('providerId')}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="departmentName" className="text-slate-200">
                  Department
                </Label>
                <Select
                  value={formik.values.departmentName}
                  onValueChange={(value) => formik.setFieldValue('departmentName', value)}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {DepartmentNameValues.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-white">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getFieldError('departmentName') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('departmentName')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Location */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Facility Id */}
              <div className="space-y-2">
                <Label htmlFor="location.facilityId" className="text-slate-200">Facility ID</Label>
                <Input
                  id="location.facilityId"
                  name="location.facilityId"
                  value={formik.values.location.facilityId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter facility ID"
                />
                {getFieldError('location.facilityId') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('location.facilityId')}</p>
                )}
              </div>

              {/* Facility Name */}
              <div className="space-y-2">
                <Label htmlFor="location.facilityName" className="text-slate-200">
                  Facility Name
                </Label>
                <Input
                  id="location.facilityName"
                  name="location.facilityName"
                  value={formik.values.location.facilityName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter facility name"
                />
                {getFieldError('location.facilityName') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('location.facilityName')}</p>
                )}
              </div>

              {/* Room Number */}
              <div className="space-y-2">
                <Label htmlFor="location.roomNumber" className="text-slate-200">
                  Room Number
                </Label>
                <Input
                  id="location.roomNumber"
                  name="location.roomNumber"
                  value={formik.values.location.roomNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter room number"
                />
                {getFieldError('location.roomNumber') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('location.roomNumber')}</p>
                )}
              </div>
              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="location.address" className="text-slate-200">
                  Address
                </Label>
                <Input
                  id="location.address"
                  name="location.address"
                  value={formik.values.location.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter facility address"
                />
                {getFieldError('location.address') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('location.address')}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Reason & Notes */}
          <Card className="bg-slate-800 border-slate-700 text-white">
            <CardHeader>
              <CardTitle>Reason & Notes</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              {/* Reason for Visit */}
              <div className="space-y-2">
                <Label htmlFor="reasonForVisit" className="text-slate-200">
                  Reason for Visit
                </Label>
                <Textarea
                  id="reasonForVisit"
                  name="reasonForVisit"
                  value={formik.values.reasonForVisit}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter reason for visit"
                  rows={3}
                />
                {getFieldError('reasonForVisit') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('reasonForVisit')}</p>
                )}
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-slate-200">Symptoms</Label>
                <Input
                  id="symptoms"
                  name="symptoms"
                  value={formik.values.symptoms.join(', ')}
                  onChange={(e) => formik.setFieldValue('symptoms', e.target.value.split(',').map(s => s.trim()))}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g. Headache, Fever"
                />
                {getFieldError('symptoms') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('symptoms')}</p>
                )}
              </div>


              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-200">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Additional notes"
                  rows={3}
                />
                {getFieldError('notes') && (
                  <p className="text-red-400 text-sm mt-1">{getFieldError('notes')}</p>
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


          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  {mode === 'create' ? 'Create Appointment' : 'Update Appointment'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog >
  )
}