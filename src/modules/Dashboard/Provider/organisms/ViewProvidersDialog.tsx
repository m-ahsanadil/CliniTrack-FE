"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Provider } from "../api/types"
import { ProviderStatus } from "@/src/enum"

type Props = {
    provider: Provider | null
    isOpen: boolean
    onClose: () => void
}

export const ViewProviderDialog = ({ provider, isOpen, onClose }: Props) => {
    if (!provider) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-slate-700 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">Provider Details</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    {/* Basic Information */}
                    <div className="col-span-2 mb-4">
                        <h3 className="text-base font-semibold text-slate-900 mb-2">Basic Information</h3>
                    </div>

                    <div><strong>Provider ID:</strong> {provider.providerId}</div>
                    <div><strong>Status:</strong>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${provider.status === ProviderStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                            provider.status === ProviderStatus.INACTIVE ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {provider.status}
                        </span>
                    </div>
                    <div><strong>Full Name:</strong> {provider.name}</div>
                    <div><strong>Specialty:</strong> {provider.specialty}</div>

                    {/* Contact Information */}
                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Contact Information</h3>
                    </div>

                    <div><strong>Phone:</strong> {provider.phone}</div>
                    <div><strong>Email:</strong> {provider.email}</div>

                    {/* Address Information */}
                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Address</h3>
                    </div>

                    <div><strong>Street:</strong> {provider.address.street}</div>
                    <div><strong>City:</strong> {provider.address.city}</div>
                    <div><strong>State:</strong> {provider.address.state}</div>
                    <div><strong>Zip Code:</strong> {provider.address.zipCode}</div>
                    <div><strong>Country:</strong> {provider.address.country}</div>

                    {/* Professional Information */}
                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-base font-semibold text-slate-900">Professional Information</h3>
                    </div>

                    <div><strong>License Number:</strong> {provider.licenseNumber}</div>
                    <div><strong>NPI Number:</strong> {provider.npiNumber}</div>
                    <div className="col-span-2"><strong>Clinic Affiliation:</strong> {provider.clinicAffiliation}</div>

                    {/* System Information */}
                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="text-base font-semibold text-slate-900">System Information</h3>
                    </div>

                    <div><strong>Created By:</strong> {provider.createdBy}</div>
                    <div><strong>Updated By:</strong> {provider.updatedBy}</div>
                    <div><strong>Created At:</strong> {new Date(provider.createdAt).toLocaleString()}</div>
                    <div><strong>Updated At:</strong> {new Date(provider.updatedAt).toLocaleString()}</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}