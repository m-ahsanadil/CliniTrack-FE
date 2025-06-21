"use client"

// Import components
import { RoleGuard } from "@/components/role-guard"
import { Shield, } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// hook
import { useAppSelector } from "@/src/redux/store/reduxHook"

export default function index() {
    const { user } = useAppSelector(state => state.auth)

    return (
        <RoleGuard
            allowedRoles={["admin"]}
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
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">
                                    Full Name
                                </Label>
                                <Input id="name" defaultValue={user?.username} className="border-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">
                                    Email Address
                                </Label>
                                <Input id="email" type="email" defaultValue={user?.email} className="border-slate-300" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-slate-700">
                                    Department
                                </Label>
                                <Input id="department" defaultValue={user?.department} className="border-slate-300" />
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
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
    )
}
