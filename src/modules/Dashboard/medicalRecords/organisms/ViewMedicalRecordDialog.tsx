"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MedicalRecordGetAll } from "../api/types"

type Props = {
    medicalRecord: MedicalRecordGetAll | null
    isOpen: boolean
    onClose: () => void
}

export const ViewMedicalRecordDialog = ({ medicalRecord, isOpen, onClose }: Props) => {
    if (!medicalRecord) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">Medical Record Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    {/* Basic Information */}
                    <div><strong>Record ID:</strong> {medicalRecord._id}</div>
                    <div><strong>Record Date:</strong> {new Date(medicalRecord.recordDate).toLocaleDateString()}</div>
                    
                    {/* Patient Information */}
                    <div className="col-span-2 mt-4"><strong>Patient Information:</strong></div>
                    <div><strong>Patient ID:</strong> {medicalRecord.patientId?._id}</div>
                    <div><strong>Patient Name:</strong> {medicalRecord.patientId?.fullName}</div>
                    
                    {/* Provider Information */}
                    <div className="col-span-2 mt-4"><strong>Provider Information:</strong></div>
                    <div><strong>Provider ID:</strong> {medicalRecord.providerId?._id}</div>
                    <div><strong>Provider Name:</strong> {medicalRecord.providerId?.name}</div>
                    
                    {/* Medical Details */}
                    <div className="col-span-2 mt-4"><strong>Medical Details:</strong></div>
                    <div className="col-span-2">
                        <div className="mb-2">
                            <strong>Diagnosis:</strong>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-gray-800">
                                {medicalRecord.diagnosis}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-2">
                        <div className="mb-2">
                            <strong>Treatment:</strong>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-gray-800">
                                {medicalRecord.treatment}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-2">
                        <div className="mb-2">
                            <strong>Prescription:</strong>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-gray-800">
                                {medicalRecord.prescription}
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-span-2">
                        <div className="mb-2">
                            <strong>Notes:</strong>
                            <div className="mt-1 p-2 bg-gray-50 rounded text-gray-800">
                                {medicalRecord.notes}
                            </div>
                        </div>
                    </div>

                    {/* System Information */}
                    <div className="col-span-2 mt-4"><strong>System Information:</strong></div>
                    <div><strong>Created By:</strong> {medicalRecord.createdBy}</div>
                    <div><strong>Updated By:</strong> {medicalRecord.updatedBy}</div>
                    <div><strong>Created At:</strong> {new Date(medicalRecord.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(medicalRecord.updatedAt).toLocaleString()}</div>
                    <div><strong>Version:</strong> {medicalRecord.__v}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}