import React, { FC } from 'react'
import { useRegister } from '../auth/api/hooks/useRegister';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRole, UserRoleValues } from '@/src/enum';
import { useGlobalUI } from '@/src/redux/providers/contexts/GlobalUIContext';

interface RegisterTabProps {
    onSuccessCallback?: () => void;
}

export const RegisterTab: FC<RegisterTabProps> = ({ onSuccessCallback }) => {
    const { formik: registerFormik, loading, serverErrorMessage, serverSuccessMessage } = useRegister(onSuccessCallback);
    const {
        showRegisterPassword,
        setShowRegisterPassword,
        toggleRegisterPasswordVisibility,
        showConfirmPassword,
        setShowConfirmPassword,
        toggleConfirmPasswordVisibility,
    } = useGlobalUI();

    const sanitize = (text: string) =>
        text.toLowerCase().replace(/[^a-z]/g, "");



    const handleRoleChange = (role: string) => {
        registerFormik.setFieldValue('role', role);
        if (registerFormik.values.username && role) {
            const generatedEmail = `${sanitize(registerFormik.values.username)}.${role}@clinitrack.com`;
            registerFormik.setFieldValue('email', generatedEmail);
        }
    };

    // Handle username change and auto-generate email
    const handleUsernameChange = (username: string) => {
        registerFormik.setFieldValue('username', username);
        if (username && registerFormik.values.role) {
            const generatedEmail = `${sanitize(username)}.${registerFormik.values.role}@clinitrack.com`;
            registerFormik.setFieldValue('email', generatedEmail);
        }
    };


    return (
        <TabsContent value="register">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-slate-800">Create Account</CardTitle>
                    <CardDescription>Register to access CliniTrack</CardDescription>
                    {serverErrorMessage && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                            {serverErrorMessage}
                        </div>
                    )}
                    {serverSuccessMessage && (
                        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                            {serverSuccessMessage}
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={registerFormik.handleSubmit}
                        className="space-y-4"
                    >
                        {/* Role Selector */}
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-slate-700">Role</Label>
                            <select
                                id="role"
                                name="role"
                                value={registerFormik.values.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                onBlur={registerFormik.handleBlur}
                                className="h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Role</option>
                                {UserRoleValues.filter(role => role !== UserRole.PATIENT).map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize for display */}
                                    </option>
                                ))}
                            </select>
                            {registerFormik.touched.role && registerFormik.errors.role && (
                                <div className="text-sm text-red-600">{registerFormik.errors.role}</div>
                            )}
                        </div>


                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-700">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                value={registerFormik.values.username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                onBlur={registerFormik.handleBlur}
                                className="h-12"
                            />
                            {registerFormik.touched.username && registerFormik.errors.username && (
                                <div className="text-sm text-red-600">{registerFormik.errors.username}</div>
                            )}
                        </div>

                        {/* Auto-generated Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Auto-generated email"
                                value={registerFormik.values.email}
                                disabled
                                readOnly
                                className="h-12 bg-gray-100 text-slate-700 placeholder:text-slate-400 cursor-not-allowed"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter full name"
                                value={registerFormik.values.fullName}
                                onChange={registerFormik.handleChange}
                                onBlur={registerFormik.handleBlur}
                                className="h-12"
                            />
                            {registerFormik.touched.fullName && registerFormik.errors.fullName && (
                                <div className="text-sm text-red-600">{registerFormik.errors.fullName}</div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-700">Password</Label>
                            <div className='relative'>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showRegisterPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    value={registerFormik.values.password}
                                    onChange={registerFormik.handleChange}
                                    onBlur={registerFormik.handleBlur}
                                    className="h-12 pr-12"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                                    onClick={toggleRegisterPasswordVisibility}
                                >
                                    {showRegisterPassword ? (
                                        <EyeOff className="h-4 w-4 text-slate-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-slate-500" />
                                    )}
                                </Button>
                            </div>
                            {registerFormik.touched.password && registerFormik.errors.password && (
                                <div className="text-sm text-red-600">{registerFormik.errors.password}</div>
                            )}
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="dob" className="text-slate-700">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                value={registerFormik.values.dob}
                                onChange={registerFormik.handleChange}
                                onBlur={registerFormik.handleBlur}
                                className="h-12"
                            />
                            {registerFormik.touched.dob && registerFormik.errors.dob && (
                                <div className="text-sm text-red-600">{registerFormik.errors.dob}</div>
                            )}
                        </div>

                        {/* Education */}
                        <div className="space-y-2">
                            <Label htmlFor="education" className="text-slate-700">Education</Label>
                            <Input
                                id="education"
                                name="education"
                                placeholder="Enter education background"
                                value={registerFormik.values.education}
                                onChange={registerFormik.handleChange}
                                onBlur={registerFormik.handleBlur}
                                className="h-12"
                            />
                            {registerFormik.touched.education && registerFormik.errors.education && (
                                <div className="text-sm text-red-600">{registerFormik.errors.education}</div>
                            )}
                        </div>

                        {/* Experience */}
                        <div className="space-y-2">
                            <Label htmlFor="experience" className="text-slate-700">Experience</Label>
                            <Input
                                id="experience"
                                name="experience"
                                placeholder="Enter experience"
                                value={registerFormik.values.experience}
                                onChange={registerFormik.handleChange}
                                onBlur={registerFormik.handleBlur}
                                className="h-12"
                            />
                            {registerFormik.touched.experience && registerFormik.errors.experience && (
                                <div className="text-sm text-red-600">{registerFormik.errors.experience}</div>
                            )}
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading || registerFormik.isSubmitting}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>

    )
}
