"use client"

// Import components
import { FormikHelpers, useFormik } from 'formik'
import { RoleGuard } from "@/components/role-guard"
import { AlertCircle, Loader2, Shield, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image";

// hook
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { useEffect } from "react"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { UserRole } from "@/src/enum"
import { useToast } from "@/hooks/use-toast"
import { clearErrors, fetchProfile, updateProfile } from '../../Authentication/profile/api/slice'
import { UpdateProfileRequest } from '../../Authentication/profile/api/types'
import { updateProfileValidationSchema } from '@/src/validation/schemas'
import { usePhoto } from '../../Authentication/profile/api/usePhoto'
import { SettingProps } from '@/app/(DASHBOARD)/[role]/settings/page'

interface UpdateProfileFormValues {
    name: string;
    age: number | '';
    dob: string;
    speciality: string;
    intro: string;
    field: string;
    degree: string;
    education: string;
    experience: string;
}

export default function index({ role }: SettingProps) {
    const { profile, updateError, isUpdating, loading } = useAppSelector(state => state.profile)

    const {
        photoUrl,
        loading: isPhotoLoading,
        error,
        fileInputRef,
        handleUploadClick,
        handleImageChange,
    } = usePhoto();

    const dispatch = useAppDispatch()
    const { toast } = useToast()

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile())
        }
    }, [dispatch, profile])

    const initialUpdateProfileValues: UpdateProfileFormValues = {
        name: profile?.fullName || '',
        age: profile?.age || '',
        dob: profile?.dob?.split("T")[0] || '',
        speciality: profile?.speciality || '',
        intro: profile?.intro || '',
        field: profile?.field || '',
        degree: profile?.degree || '',
        education: profile?.education || '',
        experience: profile?.experience || ''
    }

    const handleUpdateProfile = async (
        values: UpdateProfileFormValues,
        actions: FormikHelpers<UpdateProfileFormValues>
    ) => {
        try {
            dispatch(clearErrors());

            const credentials: UpdateProfileRequest = {
                name: values.name,
                age: values.age,
                dob: values.dob,
                education: values.education,
                experience: values.experience,
                degree: values.degree,
                field: values.field,
                speciality: values.speciality,
                intro: values.intro,
            };

            await dispatch(updateProfile(credentials)).unwrap();
            await dispatch(fetchProfile());

            toast({
                title: "Profile updated!",
                description: "All your changes have been saved.",
                variant: "default",
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: (error as string) || "Something went wrong while updating profile.",
                variant: "destructive",
            });
        } finally {
            actions.setSubmitting(false);
        }
    };


    const formik = useFormik({
        initialValues: initialUpdateProfileValues,
        validationSchema: updateProfileValidationSchema,
        onSubmit: handleUpdateProfile,
        enableReinitialize: true
    });

    useEffect(() => {
        if (updateError) {
            toast({
                title: "Update Failed",
                description: updateError,
                variant: "destructive",
            });
        }
    }, [updateError]);

    // ✅ loader rendered AFTER hooks
    if (loading || !profile) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-sm font-medium">Loading profile data...</p>
            </div>

        );
    }


    return (
        <ProtectedRoleGuard role={role}>

            <RoleGuard
                allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
                fallback={
                    <div className="text-center py-12">
                        <Shield className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Access Restricted</h3>
                        <p className="text-slate-600">Only administrators can access system settings.</p>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                        <p className="text-slate-600">Manage your account and application preferences</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white border border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Account Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={formik.handleSubmit}>
                                    <div className="space-y-2">
                                        <Label htmlFor="photo" className="text-slate-700">Profile Photo</Label>
                                        <div
                                            title="Click to change profile photo"
                                            className="relative w-32 h-32 flex items-center justify-center cursor-pointer group"
                                            onClick={handleUploadClick}
                                        >
                                            {/* Spinning Dashed Border (behind image) */}
                                            {isPhotoLoading && (
                                                <div className="absolute w-full h-full rounded-full border-4 border-dashed border-blue-500 animate-spin z-0" />
                                            )}

                                            {/* Error fallback overlay */}
                                            {error && (
                                                <div className="absolute inset-0 rounded-full bg-red-100 flex items-center justify-center z-20">
                                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                                </div>
                                            )}

                                            {/* Image */}
                                            <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300 z-10 bg-white">
                                                <Image
                                                    src={photoUrl || '/default-avatar.png'}
                                                    alt="User Avatar"
                                                    fill
                                                    className="object-cover transition duration-200 group-hover:opacity-75"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                        <Input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                                        <Input id="name" {...formik.getFieldProps("name")} />
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="text-slate-700">Age</Label>
                                        <Input id="age" type="number" {...formik.getFieldProps("age")} />
                                        {formik.touched.age && formik.errors.age && (
                                            <p className="text-red-500 text-sm">{formik.errors.age}</p>
                                        )}
                                    </div>


                                    <div className="space-y-2">
                                        <Label htmlFor="dob" className="text-slate-700">Date of Birth</Label>
                                        <Input id="dob" type="date" {...formik.getFieldProps("dob")} />
                                        {/* {formik.touched && formik.errors.name && (
                                            <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                        )} */}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="speciality" className="text-slate-700">Speciality</Label>
                                        <Input id="speciality" {...formik.getFieldProps("speciality")} />
                                        {formik.touched.speciality && formik.errors.speciality && (
                                            <p className="text-red-500 text-sm">{formik.errors.speciality}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="intro" className="text-slate-700">Intro</Label>
                                        <Input id="intro" {...formik.getFieldProps("intro")} />
                                        {formik.touched.intro && formik.errors.intro && (
                                            <p className="text-red-500 text-sm">{formik.errors.intro}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="field" className="text-slate-700">Field</Label>
                                        <Input id="field" {...formik.getFieldProps("field")} />
                                        {formik.touched.field && formik.errors.field && (
                                            <p className="text-red-500 text-sm">{formik.errors.field}</p>
                                        )}

                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="degree" className="text-slate-700">Degree</Label>
                                        <Input id="degree" {...formik.getFieldProps("degree")} />
                                        {formik.touched.degree && formik.errors.degree && (
                                            <p className="text-red-500 text-sm">{formik.errors.degree}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="education" className="text-slate-700">Education</Label>
                                        <Input id="education" {...formik.getFieldProps("education")} />
                                        {formik.touched.education && formik.errors.education && (
                                            <p className="text-red-500 text-sm">{formik.errors.education}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience" className="text-slate-700">Experience</Label>
                                        <Input id="experience" {...formik.getFieldProps("experience")} />
                                        {formik.touched.experience && formik.errors.experience && (
                                            <p className="text-red-500 text-sm">{formik.errors.experience}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-slate-700">
                                            Username
                                        </Label>
                                        <Input id="username" disabled defaultValue={profile?.username} className="border-slate-300" />
                                        {/* {formik.touched. && formik.errors.name && (
                                            <p className="text-red-500 text-sm">{formik.errors.name}</p>
                                        )} */}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700">
                                            Email Address
                                        </Label>
                                        <Input id="email" type="email" disabled defaultValue={profile?.email || ""} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-slate-700">
                                            Department
                                        </Label>
                                        <Input id="department" defaultValue={profile?.department || ""} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Role</Label>
                                        <Input disabled defaultValue={profile?.role || ""} className="border-slate-300" />
                                        {/* <p className="text-sm text-slate-900 bg-slate-100 px-3 py-2 rounded-md border border-slate-200">{profile?.role}</p> */}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Created At</Label>
                                        <Input disabled defaultValue={new Date(profile?.createdAt).toLocaleString()} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Last Updated</Label>
                                        <Input disabled defaultValue={new Date(profile?.updatedAt).toLocaleString()} className="border-slate-300" />
                                    </div>


                                    <Button disabled={isUpdating} type='submit' className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4" />
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Profile"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>


                        <Card className="bg-white border border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Notification Preferences</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="emailNotifications" className="text-slate-700">
                                            Email Notifications
                                        </Label>
                                        <p className="text-sm text-slate-500">Receive appointment reminders via email</p>
                                    </div>
                                    <Switch id="emailNotifications" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="smsNotifications" className="text-slate-700">
                                            SMS Notifications
                                        </Label>
                                        <p className="text-sm text-slate-500">Receive urgent alerts via SMS</p>
                                    </div>
                                    <Switch id="smsNotifications" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label htmlFor="reportNotifications" className="text-slate-700">
                                            Weekly Reports
                                        </Label>
                                        <p className="text-sm text-slate-500">Get weekly summary reports</p>
                                    </div>
                                    <Switch id="reportNotifications" defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </RoleGuard>
        </ProtectedRoleGuard>
    )
}
