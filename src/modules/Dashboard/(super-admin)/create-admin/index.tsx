"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { CreateAdmminProps } from "@/app/(DASHBOARD)/[dashboardId]/[role]/(SUPER-ADMIN)/create-admin/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateAdminForm = {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: string;
    education: string;
    dob: string;
    experience: string;
};


export default function index({ dashboardId, role }: CreateAdmminProps) {
    // const { register, handleSubmit, reset } = useForm<CreateAdminForm>();

    const onSubmit = (data: CreateAdminForm) => {
        console.log("Submitted Admin Data:", data);
        // TODO: send to backend
        // reset();
    };

    return (
        <ProtectedRoleGuard dashboardId={dashboardId} role={role}>
            <div className="p-4 sm:p-6 lg:p-10">
                <Card className="max-w-3xl mx-auto shadow-lg border border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-slate-900 text-xl sm:text-2xl">Create New Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username"
                                        // {...register("username")}
                                        placeholder="john1234" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" 
                                     placeholder="john@clinitrack.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" 
                                     placeholder="••••••••" />
                                </div>
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName"
                                     placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="education">Education</Label>
                                    <Input id="education"  placeholder="MBBS" />
                                </div>
                                <div>
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" type="date"  />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="experience">Experience</Label>
                                    <Input id="experience"  placeholder="5 years" />
                                </div>
                                <div>
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" placeholder="admin" />
                                    {/* Optional: Replace with a <select> if role options are fixed */}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Create Admin
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoleGuard>
    )
}
