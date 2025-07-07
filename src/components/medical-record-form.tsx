// "use client"

// import type React from "react"

// import { FormEvent, useEffect, useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { CalendarIcon, Loader2, Plus, X } from "lucide-react"
// import { format } from "date-fns"
// import { Badge } from "@/components/ui/badge"
// import { doctors } from "@/src/constants"
// import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook"
// import { useMedicalRecordsFetcher } from "../modules/Dashboard/medicalRecords/api/useMedicalRecord"
// import { clearCreateError, clearCreateSuccess, clearUpdateSuccess, createMedicalRecord, updateMedicalRecord } from "../modules/Dashboard/medicalRecords/api/slice"
// // import { PatientBasicInfo } from "../modules/Dashboard/patients/api/types"
// import { ProviderBasicInfo } from "../modules/Dashboard/Provider/api/types"
// // import { fetchPatientBasicInfo } from "../modules/Dashboard/patients/api/slice"
// // import { fetchProviderBasicInfo } from "../modules/Dashboard/Provider/api/slice"
// import { extractId } from "../utils/extractIdForSelector"
// import { medicalRecordApi } from "../modules/Dashboard/medicalRecords/api/api"

// interface MedicalRecordFormProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   record?: any
//   mode: 'create' | 'edit';
//   onSave?: (record: any) => void
//   patients: any[]
//   // patients: PatientBasicInfo[]
//   provider: ProviderBasicInfo[]
// }

// interface MedicalRecordData {
//   id?: string | number
//   patientId: string
//   providerId: string
//   diagnosis: string
//   treatment: string
//   prescription: string;
//   prescriptions?: string[]
//   notes: string
//   recordDate: string
//   createdBy: string
//   updatedBy: string
// }

// // Initial form state
// const initialFormState: MedicalRecordData = {
//   patientId: "",
//   providerId: "",
//   diagnosis: "",
//   treatment: "",
//   prescription: "",
//   prescriptions: [],
//   notes: "",
//   recordDate: new Date().toISOString().slice(0, 16),
//   createdBy: "",
//   updatedBy: "",
// }


// export default function MedicalRecordForm({ open, onOpenChange, record, onSave, patients, provider, mode = 'create' }: MedicalRecordFormProps) {
//   const dispatch = useAppDispatch();
//   const { createError, createLoading, createSuccess, updateLoading, updateError, updateSuccess } = useAppSelector(state => state.medicalRecord);

//   const [formData, setFormData] = useState<MedicalRecordData>(initialFormState)
//   const [selectedDate, setSelectedDate] = useState<Date | undefined>(record?.date ? new Date(record.date) : new Date())
//   const [patientProviderMap, setPatientProviderMap] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (open) {
//       medicalRecordApi.getSelected().then((res) => {
//         const map: Record<string, string> = {};
//         res.data.forEach(({ patient }) => {
//           if (patient && patient.id && patient.provider?.id) {
//             map[patient.id] = patient.provider.id;
//           }
//         });
//         setPatientProviderMap(map);
//       });
//     }
//   }, [open]);


//   // Initialize form data based on mode
//   useEffect(() => {
//     if (mode === 'edit' && record) {
//       console.log('Record structure:', record);

//       // Extract IDs from objects if they are objects, otherwise use as strings
//       const patientId = extractId(record.patientId || record.patient);
//       const providerId = extractId(record.providerId || record.provider);

//       let prescriptions: string[] = [];
//       if (record.prescriptions && Array.isArray(record.prescriptions)) {
//         prescriptions = record.prescriptions;
//       } else if (record.prescription && typeof record.prescription === 'string') {
//         // Split by semicolon if it's a concatenated string
//         prescriptions = record.prescription.split(';').map((p: string) => p.trim()).filter(Boolean);
//       }

//       setFormData({
//         // id: record._id,
//         patientId: patientId,
//         providerId: providerId,
//         diagnosis: record?.diagnosis || "",
//         treatment: record?.treatment || "",
//         prescription: record?.prescription || "",
//         prescriptions: prescriptions,
//         notes: record?.notes || "",
//         recordDate: record?.recordDate || new Date().toISOString().slice(0, 16),
//         createdBy: record?.createdBy || "",
//         updatedBy: record?.updatedBy || "",
//       });
//       if (record.recordDate) {
//         setSelectedDate(new Date(record.recordDate));
//       }
//     } else {
//       setFormData(initialFormState);
//     }
//   }, [mode, record, open]);

//   console.log(formData);


//   // useEffect(() => {
//   //   if (open) {
//   //     dispatch(fetchPatientBasicInfo());
//   //     dispatch(fetchProviderBasicInfo());
//   //   }
//   // }, [open, dispatch]);

//   // Handle successful creation or update
//   useEffect(() => {
//     if (createSuccess || updateSuccess) {
//       // successHandledRef.current = true;

//       if (onSave) {
//         onSave({ ...formData, id: record?._id });
//       }

//       // Clear form data
//       setFormData(initialFormState);
//       setNewPrescription("");
//       setSelectedDate(new Date());

//       // Clear success states
//       if (createSuccess) {
//         dispatch(clearCreateSuccess());
//       }
//       if (updateSuccess) {
//         dispatch(clearUpdateSuccess());
//       }

//       // Close dialog
//       onOpenChange(false);
//     }
//   }, [createSuccess, updateSuccess]);

//   // Clear errors when dialog closes
//   useEffect(() => {
//     if (!open) {
//       dispatch(clearCreateError());
//       setFormData(initialFormState);
//       setNewPrescription("");
//       setSelectedDate(new Date());
//     }
//   }, [open, dispatch]);


//   const [newPrescription, setNewPrescription] = useState("")

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault()

//     // Prepare data for submission
//     const submissionData: MedicalRecordData = {
//       ...formData,
//       recordDate: selectedDate ? selectedDate.toISOString() : formData.recordDate,
//       // id: record?._id,
//       prescription: formData.prescriptions?.length ? formData.prescriptions.join('; ') : formData.prescription,
//     }
//     console.log(submissionData);

//     if (mode === 'edit' && record?._id) {
//       // Dispatch update action
//       dispatch(updateMedicalRecord({
//         id: record._id,
//         medicalRecordData: submissionData,
//       }));
//     } else {
//       // Dispatch create action
//       dispatch(createMedicalRecord(submissionData));
//     }
//     // onOpenChange(false)
//   }

//   // Handle patient selection and auto-select provider
//   const handlePatientChange = (patientId: string) => {
//     console.log('Patient selected:', patientId);
//     console.log('Looking for provider in map:', patientProviderMap[patientId]);

//     // Find the corresponding provider for this patient
//     const providerId = patientProviderMap[patientId];

//     setFormData(prev => ({
//       ...prev,
//       patientId: patientId,
//       providerId: providerId || prev.providerId // Only update if provider found
//     }));

//     // Log for debugging
//     if (providerId) {
//       console.log('Auto-selected provider:', providerId);
//     } else {
//       console.log('No provider found for patient:', patientId);
//     }
//   };

//   // Handle provider selection
//   const handleProviderChange = (providerId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       providerId: providerId
//     }));
//   };

//   // Get selected patient and provider names for display
//   const getSelectedPatientName = () => {
//     if (!formData.patientId) return "Select patient";
//     const patient = patients.find(p => p._id === formData.patientId);
//     return patient ? `${patient.fullName} (${patient.patientId})` : "Select patient";
//   };

//   const getSelectedProviderName = () => {
//     if (!formData.providerId) return "Select doctor";
//     const selectedProvider = provider.find(p => p._id === formData.providerId);
//     return selectedProvider ? `${selectedProvider.name} (${selectedProvider.providerId})` : "Select doctor";
//   };

//   const addPrescription = () => {
//     if (newPrescription.trim()) {
//       setFormData({
//         ...formData,
//         prescriptions: [...(formData.prescriptions || []), newPrescription.trim()],
//       });
//       setNewPrescription("");
//     }
//   };

//   const removePrescription = (index: number) => {
//     setFormData({
//       ...formData,
//       prescriptions: formData.prescriptions?.filter((_, i) => i !== index) || [],
//     });
//   };

//   // Get current loading state and error based on mode
//   const isLoading = mode === 'edit' ? updateLoading : createLoading;
//   const currentError = mode === 'edit' ? updateError : createError;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
//         <DialogHeader>
//           <DialogTitle>{mode === 'edit' ? "Edit Medical Record" : "Add New Medical Record"}</DialogTitle>
//         </DialogHeader>
//         {currentError && (
//           <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4">
//             <div className="flex items-center justify-between">
//               <span className="text-red-400">{currentError}</span>
//               <button
//                 onClick={() => dispatch(clearCreateError())}
//                 className="text-red-400 hover:text-red-300"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}
//         <form className="space-y-6" onSubmit={handleSubmit}>

//           {/* Patient and Provider Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="patientId">Patient {mode === 'create' ? 'ID' : ''} *</Label>
//               <Select
//                 value={formData.patientId}
//                 disabled={isLoading}
//                 onValueChange={(value) => setFormData({ ...formData, patientId: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select patient" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {patients.map((patient) => (
//                     <SelectItem key={patient._id} value={patient._id}>
//                       {patient.fullName} ({patient.patientId})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="providerId">Provider ID *</Label>
//               <Select
//                 value={formData.providerId}
//                 disabled={isLoading}
//                 onValueChange={(value) => setFormData({ ...formData, providerId: value })}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select doctor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {provider.map((provider) => (
//                     <SelectItem key={provider._id} value={provider._id}>
//                       {provider.name} ({provider.providerId})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="patientId">Patient {mode === 'create' ? 'ID' : ''} *</Label>
//               <Select
//                 value={formData.patientId}
//                 disabled={isLoading}
//                 onValueChange={handlePatientChange}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select patient">
//                     {getSelectedPatientName()}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {patients.map((patient) => (
//                     <SelectItem key={patient._id} value={patient._id}>
//                       {patient.fullName} ({patient.patientId})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {formData.patientId && (
//                 <p className="text-sm text-slate-400">
//                   Selected: {getSelectedPatientName()}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="providerId">Provider ID *</Label>
//               <Select
//                 value={formData.providerId}
//                 disabled={isLoading}
//                 onValueChange={handleProviderChange}
//               >
//                 <SelectTrigger className="bg-slate-700 border-slate-600">
//                   <SelectValue placeholder="Select doctor">
//                     {getSelectedProviderName()}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {provider.map((providerItem) => (
//                     <SelectItem key={providerItem._id} value={providerItem._id}>
//                       {providerItem.name} ({providerItem.providerId})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {formData.providerId && (
//                 <p className="text-sm text-slate-400">
//                   Selected: {getSelectedProviderName()}
//                 </p>
//               )}
//             </div>
//           </div>

//           {process.env.NODE_ENV === 'development' && (
//             <div className="mt-4 p-3 bg-slate-800 rounded text-sm">
//               <p><strong>Debug Info:</strong></p>
//               <p>Selected Patient ID: {formData.patientId || 'None'}</p>
//               <p>Selected Provider ID: {formData.providerId || 'None'}</p>
//               <p>Patient-Provider Map: {JSON.stringify(patientProviderMap, null, 2)}</p>
//               <p>Mode: {mode}</p>
//             </div>
//           )}
//           {/* Diagnosis and Treatment */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="diagnosis">Diagnosis *</Label>
//               <Textarea
//                 id="diagnosis"
//                 value={formData.diagnosis}
//                 onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
//                 className="bg-slate-700 border-slate-600"
//                 disabled={isLoading}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="treatment">Treatment Plan *</Label>
//               <Textarea
//                 id="treatment"
//                 value={formData.treatment}
//                 onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
//                 className="bg-slate-700 border-slate-600"
//                 disabled={isLoading}
//                 required
//               />
//             </div>
//           </div>

//           {/* Prescriptions */}
//           <div className="space-y-4">
//             <Label className="text-lg font-semibold">Prescriptions</Label>
//             <div className="flex space-x-2">
//               <Input
//                 value={newPrescription}
//                 onChange={(e) => setNewPrescription(e.target.value)}
//                 className="bg-slate-700 border-slate-600"
//                 placeholder="Add prescription (e.g., Lisinopril 10mg daily)"
//                 disabled={isLoading}
//                 onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrescription())}
//               />
//               <Button type="button" aria-required onClick={addPrescription} size="sm" className="h-auto" disabled={isLoading}>
//                 <Plus className="h-4 w-4" />
//               </Button>
//             </div>
//             <div className="space-y-2">
//               {formData.prescriptions?.map((prescription, index) => (
//                 <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
//                   <span>{prescription}</span>
//                   <Button type="button" variant="ghost" size="sm" onClick={() => removePrescription(index)} disabled={isLoading}>
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Record Date */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="recordDate">Record Date *</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {selectedDate ? format(selectedDate, "PPP p") : "Pick a date and time"}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
//                   <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => {
//                       if (date) {
//                         setSelectedDate(date);
//                         setFormData((prev) => ({
//                           ...prev,
//                           recordDate: date.toISOString().slice(0, 16), // format to "yyyy-MM-ddTHH:mm"
//                         }));
//                       }
//                     }}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Additional Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               className="bg-slate-700 border-slate-600"
//               rows={4}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Created By & Updated By */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="createdBy">Created By *</Label>
//               <Input
//                 id="createdBy"
//                 value={formData.createdBy}
//                 onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
//                 className="bg-slate-700 border-slate-600"
//                 required
//                 disabled={isLoading || mode === 'edit'}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="updatedBy">Updated By *</Label>
//               <Input
//                 id="updatedBy"
//                 value={formData.updatedBy}
//                 onChange={(e) => setFormData({ ...formData, updatedBy: e.target.value })}
//                 className="bg-slate-700 border-slate-600"
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//           </div>


//           <div className="flex justify-end space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {mode === 'edit' ? 'Updating...' : 'Saving...'}
//                 </>
//               ) : (
//                 <>
//                   {mode === 'edit' ? 'Update Record' : 'Save Record'}
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>

//       </DialogContent>
//     </Dialog >
//   )
// }

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
import { useEffect, useState } from "react"
import { medicalRecordValidationSchema } from "../validation/schemas"
import { FormikHelpers, useFormik } from 'formik'
import { useMedicalRecord } from "../redux/providers/contexts/MedicalRecordContext";
import { useAppDispatch, useAppSelector } from "../redux/store/reduxHook";
import { clearCreateError, clearUpdateError, fetchSelectedPatientProviders } from "../modules/Dashboard/medicalRecords/api/slice";


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


const initialMedicalRecordValues: MedicalRecordFormValues = {
  patientId: "",
  providerId: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  notes: "",
  recordDate: "",
  createdBy: "",
  updatedBy: ""
}

export default function MedicalRecordForm({ open, onOpenChange }: MedicalRecordFormProps) {
  const dispatch = useAppDispatch();
  // CONTEXT STATES
  const {
    isEditing,
    setIsEditing,
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
  } = useAppSelector(state => state.medicalRecord)

  const [date, setDate] = useState<Date | undefined>();
  const [newPrescription, setNewPrescription] = useState("");
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [doctorName, setDoctorName] = useState("");

  // Determine mode based on editingItem
  const mode = isEditing ? 'edit' : 'create';
  const isLoading = isEditing ? updateLoading : createLoading;
  const errorMessage = isEditing ? updateError : createError;

  // Determine initial values based on mode
  const getInitialValues = (): MedicalRecordFormValues => {
    if (mode === "edit" && medicalRecord) {
      const prescriptionArray = Array.isArray(medicalRecord.prescription) ? medicalRecord.prescription : medicalRecord.prescription ? [medicalRecord.prescription] : [];
      return {
        patientId: typeof medicalRecord.patientId === "object" ? medicalRecord.patientId._id || "" : medicalRecord.patientId,
        providerId: typeof medicalRecord.providerId === "object" ? medicalRecord.providerId._id || "" : medicalRecord.providerId,
        diagnosis: medicalRecord.diagnosis || "",
        treatment: medicalRecord.treatment || "",
        prescription: prescriptionArray.join(', ') || "",
        notes: medicalRecord.notes || "",
        recordDate: medicalRecord.recordDate || "",
        createdBy: medicalRecord.createdBy || "",
        updatedBy: medicalRecord.updatedBy || "",
      };
    }

    return initialMedicalRecordValues;
  };

  const handleMedicalForm = async (
    values: MedicalRecordFormValues,
    actions: FormikHelpers<MedicalRecordFormValues>
  ) => {
    try {
      const finalValues = {
        ...values,
        prescription: prescriptions.join(', '),
        recordDate: date?.toISOString() || values.recordDate,
        _id: isEditing && medicalRecord?._id ? medicalRecord._id : undefined,
      };

      handleSaveMedicalRecord(finalValues);
      actions.resetForm();
      setDate(undefined);
      // setMedicalRecordFormOpen(false);
      setMedicalRecord(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save record", error);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: medicalRecordValidationSchema,
    onSubmit: handleMedicalForm,
    enableReinitialize: true,
  });

  const handleCancel = () => {
    setMedicalRecordFormOpen(false);
    setMedicalRecord(null);
    setIsEditing(false);
  };

  // Update prescription handlers
  const addPrescription = () => {
    if (newPrescription.trim()) {
      const updatedPrescriptions = [...prescriptions, newPrescription.trim()];
      setPrescriptions(updatedPrescriptions);
      formik.setFieldValue("prescription", updatedPrescriptions.join(', '));
      setNewPrescription("");
    }
  };

  const removePrescription = (index: number) => {
    const updatedPrescriptions = prescriptions.filter((_, i) => i !== index);
    setPrescriptions(updatedPrescriptions);
    formik.setFieldValue("prescription", updatedPrescriptions.join(', '));
  };

  useEffect(() => {
    dispatch(fetchSelectedPatientProviders());
  }, []);

  useEffect(() => {
    if (mode === "edit" && medicalRecord) {
      const prescriptionArray = Array.isArray(medicalRecord.prescription)
        ? medicalRecord.prescription
        : medicalRecord.prescription
          ? [medicalRecord.prescription]
          : [];

      setPrescriptions(prescriptionArray);
    } else {
      setPrescriptions([]);
    }
  }, [medicalRecord, mode]);


  useEffect(() => {
    if (mode === "edit" && medicalRecord?.recordDate) {
      const recordDate = new Date(medicalRecord.recordDate);
      if (!isNaN(recordDate.getTime())) {
        setDate(recordDate);
      }
    } else {
      setDate(undefined);
    }
  }, [medicalRecord, mode]);

  useEffect(() => {
    if (date) {
      formik.setFieldValue("recordDate", date?.toISOString());
    }
  }, [date]);

  useEffect(() => {
    const shouldClose = (mode === "create" && createSuccess && !createError) || (mode === "edit" && updateSuccess && !updateError);
    if (shouldClose) {
      setMedicalRecordFormOpen(false);
      setMedicalRecord(null);
      setIsEditing(false);
      formik.resetForm();
      setDate(undefined);
    }
    if (errorMessage) {
      const timer = setTimeout(() => {
        if (mode === 'create') {
          dispatch(clearCreateError())
        } else {
          dispatch(clearUpdateError())
        }
      }, 1000);
      return () => clearTimeout(timer);

    }
  }, [createSuccess, updateSuccess, errorMessage, mode]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {mode === 'create' ? 'Create New Medical Record' : 'Edit Medical Record'}
          </DialogTitle>
          {errorMessage && (
            <p className="text-red-500 rounded-md py-3 text-center bg-red-300 text-sm">{errorMessage}</p>
          )}
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient *</Label>
              {/*  <Input
                id="patientId"
                name="patientId"
                value={formik.values.patientId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isEditing}
              />
              {formik.touched.patientId && formik.errors.patientId && (
                <p className="text-red-500 text-sm">{formik.errors.patientId}</p>
              )} */}
              <Select
                value={formik.values.patientId}
                onValueChange={(value) => {
                  formik.setFieldValue("patientId", value);

                  const found = selectedPatients.find(p => p.patient.id === value);
                  if (found?.patient.provider?.id) {
                    formik.setFieldValue("providerId", found.patient.provider.id);
                    setDoctorName(found.patient.provider.name); // 👈 Show doctor name
                  } else {
                    formik.setFieldValue("providerId", "");
                    setDoctorName("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Patient" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPatients.map((entry) => (
                    <SelectItem key={entry.patient.id} value={entry.patient.id}>
                      {entry.patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.patientId && formik.errors.patientId && (
                <p className="text-red-500 text-sm">{formik.errors.patientId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerId">Doctor *</Label>
              <Input
                id="providerId"
                name="providerId"
                value={doctorName}
                placeholder="Doctor will auto-fill"
                // onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                disabled
              />
              {formik.touched.providerId && formik.errors.providerId && (
                <p className="text-red-500 text-sm">{formik.errors.providerId}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Record Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {formik.touched.recordDate && formik.errors.recordDate && (
              <p className="text-red-500 text-sm">{formik.errors.recordDate}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis *</Label>
              <Textarea
                id="diagnosis"
                name="diagnosis"
                rows={3}
                value={formik.values.diagnosis}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.diagnosis && formik.errors.diagnosis && (
                <p className="text-red-500 text-sm">{formik.errors.diagnosis}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="treatment">Treatment *</Label>
              <Textarea
                id="treatment"
                name="treatment"
                rows={3}
                value={formik.values.treatment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.treatment && formik.errors.treatment && (
                <p className="text-red-500 text-sm">{formik.errors.treatment}</p>
              )}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Prescriptions</Label>
            <div className="flex space-x-2">
              <Input
                value={newPrescription}
                onChange={(e) => setNewPrescription(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="Add prescription (e.g., Lisinopril 10mg daily)"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPrescription())}
              />

              <Button type="button" onClick={addPrescription} size="sm" className="h-auto">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {Array.isArray(prescriptions) && prescriptions.length === 0 ? (
                <p className="text-gray-500 text-sm">No prescriptions added yet</p>
              ) : (
                Array.isArray(prescriptions) && prescriptions.map((prescription, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-700/50 p-2 rounded">
                    <span>{prescription}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePrescription(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            {formik.touched.prescription && formik.errors.prescription && (
              <p className="text-red-500 text-sm">{formik.errors.prescription}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="createdBy">Created By *</Label>
              <Input
                id="createdBy"
                name="createdBy"
                value={formik.values.createdBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isEditing}
              />
              {formik.touched.createdBy && formik.errors.createdBy && (
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
                placeholder={mode === 'edit' ? 'Enter your name' : ''}
              />
              {formik.touched.updatedBy && formik.errors.updatedBy && (
                <p className="text-red-500 text-sm">{formik.errors.updatedBy}</p>
              )}
            </div>
          </div>

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