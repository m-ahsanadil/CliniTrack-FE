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

const demoUsers: Record<string, DemoUser> = {
    "admin@clinitrack.com": {
        id: "1",
        username: "Dr. Sarah Wilson",
        email: "admin@clinitrack.com",
        role: UserRole.ADMIN,
        password: "admin123",
        avatar: "/placeholder-user.jpg",
        department: "Administration",
    },
    "doctor@clinitrack.com": {
        id: "2",
        username: "Dr. Michael Chen",
        email: "doctor@clinitrack.com",
        role: UserRole.DOCTOR,
        password: "doctor123",
        avatar: "/placeholder-user.jpg",
        department: "Cardiology",
        specialization: "Interventional Cardiology",
    },
    "staff@clinitrack.com": {
        id: "3",
        username: "Jennifer Martinez",
        email: "staff@clinitrack.com",
        role: UserRole.STAFF,
        password: "staff123",
        avatar: "/placeholder-user.jpg",
        department: "Reception",
    },
};

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
                router.push(`/${currentUser.id}/${currentUser.role}/dashboard`)
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

            // Check if email matches demo user
            const demoUser = demoUsers[values.email.toLowerCase()];

            if (demoUser) {
                // Demo user login
                dispatch(setLoading(true));

                if (demoUser.password === values.password) {
                    // Set credentials for demo user
                    dispatch(setCredentials({
                        user: {
                            id: demoUser.id,
                            username: demoUser.username,
                            email: demoUser.email,
                            role: demoUser.role,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            name: "",
                            dob: "",
                            age: 0,
                            education: "",
                            experience: "",
                            degree: "",
                            field: "",
                            intro: "",
                            speciality: ""
                        },
                        token: `demo-token-${demoUser.id}`,
                    }));

                    // Show success toast
                    toast({
                        title: "Login Successful",
                        description: `Welcome ${demoUser.username}`,
                    })

                    // Set current user and trigger navigation
                    setCurrentUser(demoUser);
                    setIsNavigating(true);
                } else {
                    // Wrong password for demo user
                    dispatch(setError("Invalid password"));
                    toast({
                        variant: "destructive",
                        title: "Login Failed",
                        description: "Invalid password",
                    })
                }

                dispatch(setLoading(false));
            } else {
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
        demoUsers: Object.keys(demoUsers),
    }
}