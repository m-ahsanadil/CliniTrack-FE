import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import React, { useEffect, useState } from "react";
import { resetUpdateStatus, updateUsersBySuperAdmin } from "../slice";
import { Modal } from "@/src/components/Modal";



interface UpdatePasswordModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ open, onClose, userId }) => {
    const dispatch = useAppDispatch();
    const [newPassword, setNewPassword] = useState("");

    const { updateLoading, updateError, updateSuccess } = useAppSelector(state => state.systemUsers);

    const handleSubmit = async () => {
        if (!newPassword.trim()) return;

      await  dispatch(updateUsersBySuperAdmin({ id: userId, payload: { newPassword } }));
    };

    // Close modal on success
    useEffect(() => {
        if (updateSuccess) {
            setTimeout(() => {
                onClose();
                dispatch(resetUpdateStatus());
                setNewPassword("");
            }, 500);
        }
    }, [updateSuccess]);

    return (
        <Modal open={open} onClose={onClose} title="Update User Password">
            <div className="space-y-4">
                <label className="block">
                    <span className="block text-sm font-medium text-gray-700">New Password</span>
                    <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>

                {updateLoading && <p className="text-blue-600 text-sm">Updating password...</p>}
                {updateError && <p className="text-red-600 text-sm">Error: {updateError}</p>}
                {updateSuccess && <p className="text-green-600 text-sm">Password updated successfully!</p>}

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                        onClick={onClose}
                        disabled={updateLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        onClick={handleSubmit}
                        disabled={updateLoading}
                    >
                        Update
                    </button>
                </div>
            </div>
        </Modal>
    );
};
