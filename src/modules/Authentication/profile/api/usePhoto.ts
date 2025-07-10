import { ChangeEvent, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { clearPhoto, fetchUserPhoto, uploadUserPhoto } from "./photoSlice";
import { compressImage } from "@/src/utils/compressImage";


export const usePhoto = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.auth)
    const { photoUrl, loading, error } = useAppSelector(state => state.photo);
    const fileInputRef = useRef<HTMLInputElement>(null);
    

    // Fetch photo on mount
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchUserPhoto(user.id));
        }
    }, [user?.id]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const compressed = await compressImage(file);
            dispatch(uploadUserPhoto(compressed));
        } catch (err) {
            console.error("Compression or upload failed:", err);
        }
    };

    
    return {
        photoUrl,
        loading,
        error,
        fileInputRef,
        handleUploadClick,
        handleImageChange,
    };
};