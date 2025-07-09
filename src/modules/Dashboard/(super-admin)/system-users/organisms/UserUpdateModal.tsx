import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import React, { useEffect, useState } from "react";
import { resetUpdateStatus, updateUsersBySuperAdmin } from "../api/slice";
import { Modal } from "@/src/components/Modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";



interface UpdatePasswordModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ open, onClose, userId }) => {
    const dispatch = useAppDispatch();
    const [newPassword, setNewPassword] = useState("");
    const { toast } = useToast()
    const { updateLoading, updateError, updateSuccess } = useAppSelector(state => state.systemUsers);

    const handleSubmit = async () => {
        if (!newPassword.trim()) return;

        await dispatch(updateUsersBySuperAdmin({ id: userId, payload: { newPassword } }));
    };

    const handleCancel = () => {
        setNewPassword("");
        onClose();
    };


    // Close modal on success
    useEffect(() => {
        if (updateSuccess) {
            toast({ description: `Password updated successfully` });
            setNewPassword("");
            onClose();
            dispatch(resetUpdateStatus());
        }
    }, [updateSuccess]);

    return (
        <Modal open={open} onClose={onClose} title="Update User Password">
            <div className="space-y-4">
                <label className="block">
                    <span className="block text-sm font-medium text-gray-700">New Password</span>
                    <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-black"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={updateLoading}
                    />
                </label>

                {updateError && <p className="text-red-600 text-sm">Error: {updateError}</p>}

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                        onClick={handleCancel}
                        disabled={updateLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center min-w-[100px]"
                        onClick={handleSubmit}
                        disabled={updateLoading}
                    >
                        {updateLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        {updateLoading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
