import type React from "react"
import { FormikHelpers, useFormik } from 'formik'
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/src/redux/store/reduxHook";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerValidationSchema } from "@/src/validation/schemas";
import { registerApi } from "../api";
import { RegisterApiResponse, RegisterRequest } from "../types";
import { UserRole } from "@/src/enum";

interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
    role: string;
    dob: string;
    education: string;
    experience: string;
    fullName: string;
}

const initialRegisterValues: RegisterFormValues = {
    email: '',
    password: '',
    username: "",
    role: "",
    dob: '',
    education: '',
    experience: '',
    fullName: ''
}

export const useRegister = (onSuccessCallback?: () => void) => {
    const { toast } = useToast()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [serverErrorMessage, setServerErrorMessage] = useState('')
    const [serverSuccessMessage, setServerSuccessMessage] = useState('')

    const handleRegister = async (values: RegisterFormValues, action: FormikHelpers<RegisterFormValues>) => {
        setLoading(true)
        setServerErrorMessage('')
        setServerSuccessMessage('')
        // Prepare credentials object matching RegisterRequest interface
        const credentials: RegisterRequest = {
            username: values.username,
            email: values.email,
            password: values.password,
            fullName: values.fullName,
            role: values.role as UserRole,
            dob: values.dob,
            education: values.education,
            experience: values.experience
        }

        const response: RegisterApiResponse = await registerApi.register(credentials)

        try {
            if (response.success === true) {
                // Success case
                setServerErrorMessage('')
                setServerSuccessMessage(response.message)

                toast({
                    title: "Registration Successful",
                    description: response.message,
                })

                action.resetForm()

                // Call success callback if provided (e.g., switch to login tab)
                if (onSuccessCallback) {
                    onSuccessCallback()
                }
            } else {
                // Error case
                setServerErrorMessage(response.message);
                setServerSuccessMessage('');

                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: response.message,
                })
            }
        }
        catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error?.message || "Network error occurred";
            setServerErrorMessage(errorMessage);
            setServerSuccessMessage('');

            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: errorMessage,
            })
        } finally {
            setLoading(false)
            action.setSubmitting(false)
        }
    }

    const formik = useFormik({
        initialValues: initialRegisterValues,
        validationSchema: registerValidationSchema,
        onSubmit: handleRegister
    })

    return {
        formik,
        loading,
        serverErrorMessage,
        serverSuccessMessage,
        // Additional utilities
        resetMessages: () => {
            setServerErrorMessage('')
            setServerSuccessMessage('')
        }

    }
}