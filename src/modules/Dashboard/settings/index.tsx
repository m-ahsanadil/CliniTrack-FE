"use client"

// Import components
import { FormikHelpers, useFormik } from 'formik'
import { RoleGuard } from "@/components/role-guard"
import { Shield, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// hook
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { SettingProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/settings/page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { UserRole } from "@/src/enum"
import { useToast } from "@/hooks/use-toast"
import { updateProfile } from '../../Authentication/profile/api/slice'

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




export default function index({ dashboardId, role }: SettingProps) {

    const { user } = useAppSelector(state => state.auth);
    if (!user) return null;
    const initialUpdateProfileValues: UpdateProfileFormValues = {
        name: user?.fullName || '',
        age: 0,
        dob: '',
        speciality: '',
        intro: '',
        field: '',
        degree: '',
        education: '',
        experience: ''
        // age: user?.age || '',
        // dob: user?.dob?.split("T")[0] || '',
        // speciality: user?.speciality || '',
        // intro: user?.intro || '',
        // field: user?.field || '',
        // degree: user?.degree || '',
        // education: user?.education || '',
        // experience: user?.experience || ''
    }

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { toast } = useToast()


    useEffect(() => {
        console.log("My user information ", user);
    }, [])

    const handleUpdateProfile = async (values: UpdateProfileFormValues, actions: FormikHelpers<UpdateProfileFormValues>) => {
        // try {
        //     dispatch(updateProfile({}))
        toast({
            title: "Profile updated!",
            description: "All your changes have been saved.",
            variant: "default", // or "success" if your toast lib supports it
        })
        // }
        // catch () { }
        // finally { }
    }

    const formik = useFormik({
        initialValues: initialUpdateProfileValues,
        // validationSchema: loginValidationSchema,
        onSubmit: handleUpdateProfile,
        enableReinitialize: true
    });

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>

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
                                <form className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                                        <Input id="name" {...formik.getFieldProps("name")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="text-slate-700">Age</Label>
                                        <Input id="age" type="number" {...formik.getFieldProps("age")} />
                                    </div>


                                    <div className="space-y-2">
                                        <Label htmlFor="dob" className="text-slate-700">Date of Birth</Label>
                                        <Input id="dob" type="date" {...formik.getFieldProps("dob")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="speciality" className="text-slate-700">Speciality</Label>
                                        <Input id="speciality" {...formik.getFieldProps("speciality")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="intro" className="text-slate-700">Intro</Label>
                                        <Input id="intro" {...formik.getFieldProps("intro")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="field" className="text-slate-700">Field</Label>
                                        <Input id="field" {...formik.getFieldProps("field")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="degree" className="text-slate-700">Degree</Label>
                                        <Input id="degree" {...formik.getFieldProps("degree")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="education" className="text-slate-700">Education</Label>
                                        <Input id="education" {...formik.getFieldProps("education")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience" className="text-slate-700">Experience</Label>
                                        <Input id="experience" {...formik.getFieldProps("experience")} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-slate-700">
                                            Username
                                        </Label>
                                        <Input id="username" defaultValue={user?.username} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-700">
                                            Email Address
                                        </Label>
                                        <Input id="email" type="email" defaultValue={user?.email || ""} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-slate-700">
                                            Department
                                        </Label>
                                        <Input id="department" defaultValue={user?.department || ""} className="border-slate-300" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Role</Label>
                                        <p className="text-sm text-slate-900 bg-slate-100 px-3 py-2 rounded-md border border-slate-200">{user?.role}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Created At</Label>
                                        <p className="text-sm text-slate-900 bg-slate-100 px-3 py-2 rounded-md border border-slate-200">
                                            {new Date(user?.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-slate-700">Last Updated</Label>
                                        <p className="text-sm text-slate-900 bg-slate-100 px-3 py-2 rounded-md border border-slate-200">
                                            {new Date(user?.updatedAt).toLocaleString()}
                                        </p>
                                    </div>


                                    <Button type='submit' className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
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
