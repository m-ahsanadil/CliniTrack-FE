import React from "react";
import { X, Mail, UserCircle2, Phone, MapPin, Calendar, ShieldCheck, Activity, Briefcase } from "lucide-react";
import { User } from "../api/types";
import { usePhoto } from "@/src/modules/Authentication/profile/api/usePhoto";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const UserViewModal: React.FC<ModalProps> = ({ open, onClose, user }) => {
    // const { photoUrl, loading } = usePhoto(user?._id);
    if (!open || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <UserCircle2 className="w-6 h-6 text-gray-500" />
                        {user.fullName || user.username}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
                        <InfoItem icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone || "—"} />
                        <InfoItem icon={<ShieldCheck className="w-4 h-4" />} label="Role" value={user.role} />
                        <InfoItem icon={<Activity className="w-4 h-4" />} label="Status" value={user.status || "Active"} />
                        <InfoItem icon={<Calendar className="w-4 h-4" />} label="Joined" value={user.joinDate || "N/A"} />
                        <InfoItem icon={<Briefcase className="w-4 h-4" />} label="Organization" value={user.organization || "N/A"} />
                        <InfoItem icon={<MapPin className="w-4 h-4" />} label="Location" value={user.location || "—"} />
                        <InfoItem icon={<Activity className="w-4 h-4" />} label="Last Active" value={user.lastActive || "—"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-2">
        <div className="mt-1 text-gray-500">{icon}</div>
        <div>
            <p className="font-medium text-gray-800">{label}</p>
            <p className="text-gray-600">{value}</p>
        </div>
    </div>
);

export default UserViewModal;
