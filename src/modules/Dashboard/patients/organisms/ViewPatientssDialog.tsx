"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Patient } from "../api/types"

type Props = {
    patient: Patient | null
    isOpen: boolean
    onClose: () => void
}

export const ViewPatientDialog = ({ patient, isOpen, onClose }: Props) => {
    if (!patient) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">Patient Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    {/* Basic Information */}
                    <div><strong>Patient ID:</strong> {patient.patientId}</div>
                    <div><strong>Status:</strong> {patient.status}</div>
                    <div><strong>Full Name:</strong> {patient.fullName}</div>
                    <div><strong>First Name:</strong> {patient.firstName}</div>
                    <div><strong>Last Name:</strong> {patient.lastName}</div>
                    <div><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</div>
                    <div><strong>Age:</strong> {patient.age} years</div>
                    <div><strong>Gender:</strong> {patient.gender}</div>
                    
                    {/* Contact Information */}
                    <div><strong>Phone:</strong> {patient.phone}</div>
                    <div><strong>Email:</strong> {patient.email}</div>
                    <div><strong>SSN:</strong> {patient.ssn}</div>
                    <div><strong>Preferred Language:</strong> {patient.preferredLanguage}</div>

                    {/* Address Information */}
                    <div className="col-span-2 mt-4"><strong>Address:</strong></div>
                    <div><strong>Street:</strong> {patient.address.street}</div>
                    <div><strong>City:</strong> {patient.address.city}</div>
                    <div><strong>State:</strong> {patient.address.state}</div>
                    <div><strong>Zip Code:</strong> {patient.address.zipCode}</div>
                    <div><strong>Country:</strong> {patient.address.country}</div>

                    {/* Emergency Contact */}
                    <div className="col-span-2 mt-4"><strong>Emergency Contact:</strong></div>
                    <div><strong>Name:</strong> {patient.emergencyContact.name}</div>
                    <div><strong>Relationship:</strong> {patient.emergencyContact.relationship}</div>
                    <div><strong>Phone:</strong> {patient.emergencyContact.phone}</div>
                    <div><strong>Email:</strong> {patient.emergencyContact.email}</div>

                    {/* Insurance Information */}
                    <div className="col-span-2 mt-4"><strong>Insurance:</strong></div>
                    <div><strong>Provider:</strong> {patient.insurance.provider}</div>
                    <div><strong>Policy Number:</strong> {patient.insurance.policyNumber}</div>
                    <div><strong>Group Number:</strong> {patient.insurance.groupNumber}</div>
                    <div><strong>Subscriber ID:</strong> {patient.insurance.subscriberId}</div>
                    <div><strong>Relationship to Subscriber:</strong> {patient.insurance.relationshipToSubscriber}</div>
                    <div><strong>Effective Date:</strong> {new Date(patient.insurance.effectiveDate).toLocaleDateString()}</div>
                    <div><strong>Expiration Date:</strong> {new Date(patient.insurance.expirationDate).toLocaleDateString()}</div>

                    {/* Medical Information */}
                    <div className="col-span-2 mt-4"><strong>Medical Information:</strong></div>
                    <div className="col-span-2"><strong>Allergies:</strong> {patient.allergies.length ? patient.allergies.join(", ") : "None"}</div>
                    <div className="col-span-2"><strong>Chronic Conditions:</strong> {patient.chronicConditions.length ? patient.chronicConditions.join(", ") : "None"}</div>
                    
                    {/* Current Medications */}
                    <div className="col-span-2 mt-4"><strong>Current Medications:</strong></div>
                    {patient.currentMedications.length > 0 ? (
                        <div className="col-span-2">
                            {patient.currentMedications.map((medication, index) => (
                                <div key={medication._id} className="mb-2 p-2 bg-gray-50 rounded">
                                    <div><strong>Medication {index + 1}:</strong> {medication.name}</div>
                                    <div><strong>Dosage:</strong> {medication.dosage}</div>
                                    <div><strong>Frequency:</strong> {medication.frequency}</div>
                                    <div><strong>Prescribed By:</strong> {medication.prescribedBy}</div>
                                    <div><strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="col-span-2">No current medications</div>
                    )}

                    {/* Tags */}
                    <div className="col-span-2 mt-4"><strong>Tags:</strong> {patient.tags.length ? patient.tags.join(", ") : "None"}</div>

                    {/* System Information */}
                    <div className="col-span-2 mt-4"><strong>System Information:</strong></div>
                    <div><strong>Registration Date:</strong> {new Date(patient.registrationDate).toLocaleDateString()}</div>
                    <div><strong>Created By:</strong> {patient.createdBy}</div>
                    <div><strong>Updated By:</strong> {patient.updatedBy}</div>
                    <div><strong>Created At:</strong> {new Date(patient.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(patient.updatedAt).toLocaleString()}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}