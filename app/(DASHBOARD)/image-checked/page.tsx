"use client";
import { profileApi } from "@/src/modules/Authentication/profile/api/api";
import { usePhoto } from "@/src/modules/Authentication/profile/api/usePhoto";
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { compressImage } from "@/src/utils/compressImage";
import Image from "next/image";
import { ChangeEvent, useCallback, useEffect, useState } from "react";


export default function ImagePage() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [uploading, setUploading] = useState<boolean>(false);

    const {
        photoUrl,
        loading: isPhotoLoading,
        error,
        fileInputRef,
        handleUploadClick,
        handleImageChange,
    } = usePhoto();
    console.log("Blob URL", imageUrl);
    console.log("User ID:", user?.id);


    const fetchPhoto = useCallback(async () => {
        if (!user?.id) return;

        setLoading(true);
        try {
            const blob = await profileApi.get_photo(user.id);
            if (blob) {
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } else {
                console.warn("❌ No photo blob returned.");
            }
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

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [fetchPhoto]);

    // Function to get user initials
    const getUserInitials = () => {
        if (!user?.fullName) return "U";
        return user.fullName
            .split(" ")
            .map((name: string) => name.charAt(0).toUpperCase())
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
        <div className="grid grid-cols-1 gap-5 items-center justify-center bg-gray-500 h-full">
            <div className="flex flex-col items-center gap-4 ">
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
            </div>
            <div className="flex flex-col items-center gap-4 p-4 border rounded-xl shadow w-fit">
                <h2 className="text-lg font-semibold">User Photo</h2>

                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Spinning Dashed Border (behind image) */}
                    {isPhotoLoading && (
                        <div className="absolute w-full h-full rounded-full border-4 border-dashed border-blue-500 animate-spin z-0" />
                    )}

                    {/* Image */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300 z-10 bg-white">
                        <Image
                            src={photoUrl || '/default-avatar.png'}
                            alt="User Avatar"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>


                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    disabled={isPhotoLoading}
                >
                    {isPhotoLoading ? 'Uploading...' : 'Change Photo'}
                </button>

                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    );
}