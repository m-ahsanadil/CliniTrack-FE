"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoleGuard } from "@/src/redux/hook/ProtectedRoute"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormikHelpers, getIn, useFormik } from 'formik'
import { CalendarIcon, Loader2 } from "lucide-react";
import { UserRole, UserRoleValues } from "@/src/enum";
import { useToast } from "@/hooks/use-toast";
import { registerValidationSchema } from "@/src/validation/schemas";
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook";
import { clearCreateError, createUsersBySuperAdmin } from "./api/slice";
import { CreateAdmminProps } from "@/app/(DASHBOARD)/[role]/(SUPER-ADMIN)/create-admin/page";


interface CreateAdminFormValues {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role: string;
    education: string;
    dob: string;
    experience: string
};

const initialCreateAdminValues: CreateAdminFormValues = {
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "",
    education: "",
    dob: "",
    experience: ""
}

export default function index({ role }: CreateAdmminProps) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();
    const {
        createError,
        createLoading,
        createSuccess
    } = useAppSelector(state => state.createUsersByAdmin);

    useEffect(() => {
        if (createError) {
            toast({
                title: "Error",
                description: createError,
                variant: "destructive",
            });

            const timer = setTimeout(() => {
                dispatch(clearCreateError());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [createError]);

    const getInitialValues = useMemo((): CreateAdminFormValues => {
        // if (createSuccess === false) {
        //     return {
        //         username: "",
        //         email: "",
        //         password: "",
        //         fullName: "",
        //         role: "",
        //         education: "",
        //         dob: "",
        //         experience: ""
        //     }
        // }
        return initialCreateAdminValues
    }, [])

    const handleCreateAdminForm = useCallback(async (values: CreateAdminFormValues, actions: FormikHelpers<CreateAdminFormValues>) => {
        try {
            await dispatch(createUsersBySuperAdmin(values)).unwrap();

            actions.resetForm();
            actions.setSubmitting(false);

            toast({
                title: "User Created successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while processing your request.",
                variant: "destructive",
            });
        } finally {
            actions.resetForm();
        }
    }, [dispatch, toast])

    const formik = useFormik({
        initialValues: getInitialValues,
        validationSchema: registerValidationSchema,
        onSubmit: handleCreateAdminForm,
        enableReinitialize: true,
    })


    const sanitize = (text: string) =>
        text.toLowerCase().replace(/[^a-z]/g, "");



    const handleRoleChange = (role: string) => {
        formik.setFieldValue('role', role);
        if (formik.values.username && role) {
            const generatedEmail = `${sanitize(formik.values.username)}.${role}@clinitrack.com`;
            formik.setFieldValue('email', generatedEmail);
        }
    };

    // Handle username change and auto-generate email
    const handleUsernameChange = (username: string) => {
        formik.setFieldValue('username', username);
        if (username && formik.values.role) {
            const generatedEmail = `${sanitize(username)}.${formik.values.role}@clinitrack.com`;
            formik.setFieldValue('email', generatedEmail);
        }
    };



    // Function to get field error
    const getFieldError = (fieldName: string) => {
        const touched = getIn(formik.touched, fieldName);
        const error = getIn(formik.errors, fieldName);
        return touched && error ? error : null;
    };

    return (
        <ProtectedRoleGuard role={role}>
            <Card className="max-w-3xl mx-auto bg-slate-800 border-slate-700 text-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Create New Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6" onSubmit={formik.handleSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-200">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={(e) => handleUsernameChange(e.target.value)}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="john1234"
                                />
                                {getFieldError('username') && (
                                    <p className="text-red-500 text-sm">{formik.errors.username}</p>
                                )}
                            </div>

                            {/* Role Selector */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-slate-200">Role</Label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formik.values.role}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    onBlur={formik.handleBlur}
                                    className="h-10 w-full rounded-md bg-slate-700 border-slate-600 text-white px-4 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Role</option>
                                    {UserRoleValues.filter(role => role !== UserRole.PATIENT).map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)} {/* Capitalize for display */}
                                        </option>
                                    ))}
                                </select>
                                {getFieldError('role') && (
                                    <p className="text-red-500 text-sm">{formik.errors.role}</p>
                                )}
                            </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-200">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    // onChange={formik.handleChange}
                                    // onBlur={formik.handleBlur}
                                    disabled
                                    readOnly
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="Auto-generated email"
                                />
                                {getFieldError('email') && (
                                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={formik.values.fullName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="John Doe"
                                />
                                {getFieldError('fullName') && (
                                    <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-200">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="••••••••"
                                />
                                {getFieldError('password') && (
                                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                                )}
                            </div>
                            {/* Date of Birth Date */}
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-slate-200">
                                    Date of Birth
                                </Label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formik.values.dob
                                                ? format(new Date(`${formik.values.dob}T00:00:00`), "PPP") // 👈 safe way
                                                : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-auto p-0 bg-slate-700 border-slate-600">
                                        <Calendar
                                            mode="single"
                                            selected={
                                                formik.values.dob
                                                    ? new Date(`${formik.values.dob}T00:00:00`) // 👈 avoids timezone shift
                                                    : undefined
                                            }
                                            onSelect={(date) =>
                                                formik.setFieldValue("dob", date ? format(date, "yyyy-MM-dd") : "")
                                            }
                                            initialFocus
                                            captionLayout="dropdown"
                                            fromYear={1950}
                                            toYear={new Date().getFullYear()}
                                            classNames={{
                                                caption_dropdowns: "flex gap-2 text-white",
                                                dropdown:
                                                    "bg-slate-800 text-white border border-slate-600 rounded px-2 py-1",
                                                caption_label: "text-white",
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                {getFieldError("dob") && (
                                    <p className="text-red-400 text-sm mt-1">{getFieldError("dob")}</p>
                                )}
                            </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="education" className="text-slate-200">Education</Label>
                                <Input
                                    id="education"
                                    name="education"
                                    value={formik.values.education}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="MBBS"
                                />
                                {getFieldError('education') && (
                                    <p className="text-red-500 text-sm">{formik.errors.education}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="experience" className="text-slate-200">Experience</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    value={formik.values.experience}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="bg-slate-700 border-slate-600 text-white"
                                    placeholder="5 years"
                                />
                                {getFieldError('experience') && (
                                    <p className="text-red-500 text-sm">{formik.errors.experience}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">

                            <Button
                                type="submit"
                                disabled={formik.isSubmitting || createLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {
                                    createLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating....
                                        </>
                                    ) : "Create Users"
                                }
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ProtectedRoleGuard>
    )
}
