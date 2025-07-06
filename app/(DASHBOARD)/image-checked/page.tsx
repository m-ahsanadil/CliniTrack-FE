"use client";
import { profileApi } from "@/src/modules/Authentication/profile/api/api";
import { useAppSelector } from "@/src/redux/store/reduxHook";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";


export default function ImagePage() {
    const { user } = useAppSelector((state) => state.auth);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);

    console.log("Blob URL", imageUrl);
    console.log("User ID:", user?.id);

    const fetchPhoto = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const blob = await profileApi.get_photo(user.id);
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
        } catch (err) {
            console.log("❌ Failed to fetch photo:", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    const handlePhotoUpload = useCallback(async (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);

        try {
            setUploading(true);
            await profileApi.upload_photo(formData);
            await fetchPhoto();
        } catch (err: any) {
            console.log("❌ Upload failed:", err.message);
        } finally {
            setUploading(false);
        }
    }, [fetchPhoto]);

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handlePhotoUpload(file);
    };

    useEffect(() => {
        fetchPhoto();
    }, [fetchPhoto]);

    // Function to get user initials
    const getUserInitials = () => {
        if (!user?.fullName) return "U";
        return user.fullName
            .split(" ")
            .map(name => name.charAt(0).toUpperCase())
            .slice(0, 2)
            .join("");
    };

    // Function to generate a color based on user name
    const getBackgroundColor = () => {
        if (!user?.fullName) return "bg-gray-500";
        const colors = [
            "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
            "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
        ];
        const index = user.fullName.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-xl font-semibold">User Image</h1>

            <div className="w-40 h-40 relative">
                {loading || uploading ? (
                    <div className="w-full h-full rounded-full border-4 border-dashed border-gray-300 animate-spin" />
                ) : imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="User Photo"
                        width={160}
                        height={160}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                    />
                ) : (
                    <div className={`w-full h-full rounded-full ${getBackgroundColor()} flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300`}>
                        {getUserInitials()}
                    </div>
                    // Option 2: User icon (uncomment to use)
                    // <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                    //     <User className="w-16 h-16 text-gray-400" />
                    // </div>

                    // Option 3: Camera icon with upload prompt (uncomment to use)
                    // <div className="w-full h-full rounded-full bg-gray-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                    //     <Camera className="w-12 h-12 text-gray-400 mb-2" />
                    //     <span className="text-xs text-gray-500">No Photo</span>
                    // </div>

                    // Option 4: Default avatar image (uncomment to use)
                    // <Image
                    //     src="/images/default-avatar.png" // Add this image to your public folder
                    //     alt="Default Avatar"
                    //     width={160}
                    //     height={160}
                    //     className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                    // />

                    // Option 5: Gradient background with initials (uncomment to use)
                    // <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-300">
                    //     {getUserInitials()}
                    // </div>

                )}
            </div>

            <label className="text-sm font-medium text-slate-700">Upload New Photo</label>
            <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={uploading}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {uploading && <p className="text-xs text-gray-500">Uploading...</p>}
        </div>
    );
}