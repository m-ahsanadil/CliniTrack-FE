import type React from "react"
import { FormikHelpers, useFormik } from 'formik'
import { useAppDispatch, useAppSelector } from "@/src/redux/store/reduxHook"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { UserRole } from "@/src/enum"
import { useRouter } from "next/navigation"
import { clearError, setCredentials, setError, setLoading, setSuperAdminCredentials } from "../slice"
import { loginValidationSchema } from "@/src/validation/schemas";
import { loginApi } from "../api"
import { LoginApiResponse, SuperAdminLoginApiResponse } from "../types"


interface LoginFormValues {
    email: string
    password: string
}

const initialLoginValues: LoginFormValues = {
    email: '',
    password: ''
}

interface UseLoginProps {
    isSuperAdmin?: boolean;
}


interface DemoUser {
    id: string
    username: string
    email?: string
    role: UserRole
    password?: string
    avatar?: string
    department?: string
    specialization?: string
}


export const useLogin = ({ isSuperAdmin = false }: UseLoginProps = {}) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { toast } = useToast()
    const { loginLoading, loginError } = useAppSelector(state => state.auth)
    const [isNavigating, setIsNavigating] = useState(false)
    const [currentUser, setCurrentUser] = useState<DemoUser | null>(null)


    useEffect(() => {
        if (isNavigating && currentUser) {
            const timer = setTimeout(() => {
                router.push(`/${currentUser.role}/dashboard`)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, [isNavigating, router, currentUser])

    useEffect(() => {
        if (loginError) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: loginError,
            })
        }
    }, [loginError, toast])

    const handleSuperAdminLogin = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
        try {
            dispatch(setLoading(true));
            const res: SuperAdminLoginApiResponse = await loginApi.superAdminLogin({
                username: values.email,
                password: values.password
            });

            if (res.success) {
                dispatch(setSuperAdminCredentials({ user: res.user, token: res.user.token, }));

                toast({
                    title: "Super Admin Login Successful",
                    description: `Welcome ${res.user.role} ${res.user.username}`,
                })
                // Set current user for navigation
                setCurrentUser({
                    id: res.user.id,
                    username: res.user.username,
                    email: res.user.email,
                    role: res.user.role,
                    department: res.user.department,
                    avatar: res.user.avatar,
                });
                setIsNavigating(true);

            } else {
                dispatch(setError(res.message));
            }
        } catch (err: any) {
            dispatch(setError("Unexpected error occurred"));
        } finally {

            dispatch(setLoading(false));
            actions.setSubmitting(false);
        }
    }

    const handleRegularLogin = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
        try {
            // Clear any previous errors
            dispatch(clearError());


            // Real API login
            dispatch(setLoading(true));

            try {
                const response: LoginApiResponse = await loginApi.login({
                    usernameOrEmail: values.email,
                    password: values.password
                });

                if (response.success) {
                    // Successful login
                    dispatch(setCredentials({
                        user: response.user,
                        token: response.token
                    }));

                    toast({
                        title: "Login Successful",
                        description: `Welcome ${response.user.fullName}`,
                    })

                    // Set current user for navigation
                    setCurrentUser({
                        id: response.user.id,
                        username: response.user.username,
                        email: response.user.email,
                        role: response.user.role,
                        department: response.user.department,
                        avatar: response.user.avatar,
                    });
                    setIsNavigating(true);
                } else {
                    // API returned error
                    const errorMessage = response.message || "Login failed";
                    dispatch(setError(errorMessage));
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: errorMessage,
                    })
                }
            } catch (error: any) {
                const errorMessage = error?.message || "An unexpected error occurred";

                dispatch(setError(errorMessage));

                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: errorMessage,
                })
            } finally {
                dispatch(setLoading(false));
                actions.setSubmitting(false)
            }
        } catch (error: any) {
            const errorMessage = error?.message || "An unexpected error occurred";
            dispatch(setError(errorMessage));
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: errorMessage,
            })
            dispatch(setLoading(false));
        } finally {
            actions.setSubmitting(false);
        }
    };

    const handleLogin = async (values: LoginFormValues, actions: FormikHelpers<LoginFormValues>) => {
        if (isSuperAdmin) {
            await handleSuperAdminLogin(values, actions);
        } else {
            await handleRegularLogin(values, actions);
        }
    };


    const formik = useFormik({
        initialValues: initialLoginValues,
        validationSchema: loginValidationSchema,
        onSubmit: handleLogin,
    });

    return {
        formik,
        loginLoading,
        loginError,
        isNavigating,
    }
}